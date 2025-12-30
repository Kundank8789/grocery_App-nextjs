import { auth } from "@/auth";
import connectdb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        await connectdb();
        const session = await auth( )
        const orders=await Order.find({user:session?.user?.id}).populate("user assignedDeliveryBoy").sort({createdAt:-1})
        if(!orders){
            return NextResponse.json({message:"No orders found"},{status:404})
        }
        return NextResponse.json(orders,{status:200})
    } catch (error) {
        return NextResponse.json({message:`Internal Server Error:${error}`},{status:500})
    }
}