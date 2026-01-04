import connectdb from "@/lib/db";
import { sendEmail } from "@/lib/mailer";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectdb()
        const {orderId}= await req.json()
        const order = await Order.findById(orderId).populate("user")
        if(!order){
            return NextResponse.json({message:"Order not found"},{status:404})
        }
        const otp=Math.floor(1000+Math.random()*9000).toString()
        order.deliveryOtp=otp
        await order.save()
        await sendEmail(order.user.email,
            "Your Delivery Otp",
            `<h2>Your Delivery Otp is ${otp}</h2>`
        )
        return NextResponse.json({message:"Otp sent successfully"},{status:200})
    } catch (error) {
        return NextResponse.json({message:`send otp Error:${error}`},{status:500})
    }
    
}