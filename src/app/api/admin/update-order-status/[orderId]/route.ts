// /api/admin/update-order-status/[orderId]/route.ts
import connectdb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
    try {
        await connectdb();
        
        // FIX 1: Remove await from params
        const { orderId } = params; 
        
        const { status } = await req.json();
        
        console.log(`📦 Updating order ${orderId} to status: ${status}`);
        
        // FIX 2: Correct populate path
        const order = await Order.findById(orderId).populate({
            path: 'userId',
            select: 'name email mobile'
        });
        
        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }
        
        order.status = status;
        
        let DeliveryBoysPayload: any = [];
        
        if (status === "out of delivery" && !order.assignment) {
            const { latitude, longitude } = order.address;
            
            // FIX 3: Check if coordinates exist
            if (!latitude || !longitude) {
                return NextResponse.json(
                    { message: "Order address coordinates are missing" },
                    { status: 400 }
                );
            }
            
            const nearByDeliveryBoys = await User.find({
                role: "deliveryboy",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(longitude), Number(latitude)]
                        },
                        $maxDistance: 100000
                    }
                }
            });
            
            const nearByIds = nearByDeliveryBoys.map((b) => b._id);
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["brodcasted", "completed"] }
            }).distinct("assignedTo");
            
            const busyIdSet = new Set(busyIds.map(b => String(b)));
            const availableDeliveryBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(String(b._id)));
            const candidates = availableDeliveryBoys.map(b => b._id);
            
            if (candidates.length === 0) {
                await order.save();
                
                await emitEventHandler("order-status-updated", {
                    orderId: order._id,
                    status: order.status
                });
                
                return NextResponse.json(
                    { message: "No available delivery boys in the area" },
                    { status: 200 }
                );
            }
            
            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                brodcastTo: candidates,
                status: "brodcasted"
            });
            
            await deliveryAssignment.populate("order");
            
            for (const boyId of candidates) {
                const boy = await User.findById(boyId);
                if (boy?.socketId) {
                    await emitEventHandler("new-assignment", deliveryAssignment, boy.socketId);
                }
            }
            
            order.assignment = deliveryAssignment._id;
            
            DeliveryBoysPayload = availableDeliveryBoys.map(b => ({
                id: b._id,
                name: b.name,
                mobile: b.mobile,
                latitude: b.location?.coordinates[1] || null,
                longitude: b.location?.coordinates[0] || null
            }));
        }
        
        await order.save();
        
        // FIX 4: Only populate if needed
        if (order.userId) {
            await order.populate({
                path: 'userId',
                select: 'name email mobile'
            });
        }
        
        await emitEventHandler("order-status-updated", { 
            orderId: order._id, 
            status: order.status 
        });
        
        return NextResponse.json({
            success: true,
            message: "Order status updated",
            order: {
                _id: order._id,
                status: order.status,
                assignment: order.assignment
            },
            assignment: order.assignment,
            availableBoys: DeliveryBoysPayload
        }, { status: 200 });
        
    } catch (error: any) {
        console.error("❌ Update status error:", error);
        
        return NextResponse.json({
            success: false,
            message: "Failed to update order status",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}