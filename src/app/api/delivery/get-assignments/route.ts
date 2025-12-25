import { auth } from "@/auth";
import connectdb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectdb()
        const session=await auth()
        const assignments=await DeliveryAssignment.find({
            brodcastTo:session?.user?.id,
            status:"brodcasted"
        }).populate("orders")
        return NextResponse.json(
            assignments,
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`Internal Server Error:${error}`},
            {status:500}
        )
    }
}