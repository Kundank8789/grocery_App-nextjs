import { auth } from "@/auth";
import connectdb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectdb()
        const session = await auth()
        const deliveryboyId=session?.user?.id
        const activeAssignment=await DeliveryAssignment.findOne({
            assignedTo:deliveryboyId,
            status:"assigned"
        }).populate(
            {
                path:"orders",
                populate:{path:"address"}
            }
        ).lean()
        if(!activeAssignment){
            return NextResponse.json(
                {active:false},
                {status:200}

            )
        }
        return NextResponse.json(
            {active:true,assignment:activeAssignment},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json({message:`Current Order Error:${error}`},{status:500})
    }
}