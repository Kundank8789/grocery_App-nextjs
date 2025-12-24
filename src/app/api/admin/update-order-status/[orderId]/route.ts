import connectdb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
    try {
        await connectdb()
        const { orderId } = await params
        const { status } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            )
        }
        order.status = status
        let DeliveryBoysPayload: any = []
        if (status === "out of delivery" && !order.assignment) {
            const { latitude, longitude } = order.address
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
            })
            const nearByIds = nearByDeliveryBoys.map((b) => b._id)
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["brodcasted", "completed"] }
            }).distinct("assignedTo")
            const busyIdSet = new Set(busyIds.map(b => String(b)))
            const availableDeliveryBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(String(b._id)))
            const candidates = availableDeliveryBoys.map(b => b._id)
            if (candidates.length == 0) {
                await order.save()
                return NextResponse.json(
                    { messaage: "there is no available delivery boy" },
                    { status: 200 }
                )
            }
            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                brodcastTo: candidates,
                status: "brodcasted"
            })
            order.assignment = deliveryAssignment._id;
            DeliveryBoysPayload = availableDeliveryBoys.map(b => ({
                id: b._id,
                name: b.name,
                mobile: b.mobile,
                latitude: b.location.coordinates[1],
                longitude: b.location.coordinates[0]
            }))
            await deliveryAssignment.populate("order")
        }
        await order.save()
        await order.populate("user")
        return NextResponse.json({
            assignment: order.assignment?._id,
            availableBoys: DeliveryBoysPayload
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: `update status error: ${error}`
        }, { status: 500 })
    }
}