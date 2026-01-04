import connectdb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectdb()
        const {orderId,otp}=await req.json()
        if(!orderId || !otp){
            return NextResponse.json({message:"Missing orderId or otp"},{status:400})
        }
        const order=await Order.findById(orderId)
        if(!order){
            return NextResponse.json(
                {message:"Order not found"},
                {status:404}
            )
        }
        if(order.deliveryOtp!==otp){
            return NextResponse.json(
                {message:"Invalid otp"},
                {status:400}
            )
        }
        order.status="delivery"
        order.deliveryOtpVerification=true
        order.deliveredAt=new Date()
        await order.save()

        await DeliveryAssignment.updateOne(
            {order:orderId},
            {$set:{assignedTo:null,status:"completed"}}
        )
        return NextResponse.json({message:"Otp verified successfully"},{status:200})
    } catch (error) {
        return NextResponse.json({message:`verify otp Error:${error}`},{status:500})
    }
    
}