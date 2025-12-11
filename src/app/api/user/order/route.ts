import connectdb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectdb();
        const {userId,items,paymentMethod,totalAmount,address}=await req.json();
        if(!userId || !items || !paymentMethod || !totalAmount || !address){
            return NextResponse.json(
                { message:"All fields are required"},
                {status:400}
            )
        }
        const user=await User.findById(userId);
        if(!user){
            return NextResponse.json(
                {message:"User not found"},
                {status:404}
                )
        
        }
        const newOrder=await Order.create({
            user:user._id,
            items,
            paymentMethod,
            totalAmount,
            address
        })
        return NextResponse.json(
            newOrder,
            {status:201}
        )

    } catch (error) {
        return NextResponse.json(
            {message:`place order failed. Error: ${error}`},
            {status:500}
        )
    }
}