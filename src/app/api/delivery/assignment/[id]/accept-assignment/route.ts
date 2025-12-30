import connectdb from "@/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order.model";
import DeliveryAssignment from "@/models/deliveryAssignment.model";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectdb()
        const { id } = await params
        const session = await auth()
        const deliveryboyId = session?.user?.id
        if (!deliveryboyId) {
            return NextResponse.json
                ({ message: "unauthorized" }, { status: 400 })
        }
        const assignment = await DeliveryAssignment.findById(id)
        if (!assignment) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 })
        }
        if (assignment.status !== "brodcasted") {
            return NextResponse.json({ message: "Assignment expired" }, { status: 404 })
        }
        const allreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: deliveryboyId,
            status: { $nin: ["brodcasted", "assigned"] }
        })
        if (allreadyAssigned) {
            return NextResponse.json({ message: "all ready assigned to other order" }, { status: 400 })
        }
        assignment.assignedTo = deliveryboyId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()
        const order = await Order.findById(assignment.order)
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 400 })
        }
        order.assignedDeliveryBoy = deliveryboyId
        await order.save()
        await DeliveryAssignment.updateMany(
            {
                _id: { $ne: assignment._id },
                brodcastedTo: deliveryboyId,
                status: "brodcasted"
            },
            {
                $pull: { brodcastedTo: deliveryboyId }
            }
        )
        return NextResponse.json({ message: "Assignment accepted" }, { status: 200 })


    } catch (error) {
        return NextResponse.json({ message: `accpect assignment Error:${error}` }, { status: 500 })
    }

}