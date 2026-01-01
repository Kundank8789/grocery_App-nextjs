import connectdb from "@/lib/db";
import Order from "@/models/order.model";
import { NextResponse,  NextRequest } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{orderId:string}}){
    try {
        await connectdb()
        const orderId=await params
        const order=await Order.findById(orderId).populate
        (" assignedDeliveryBoy")
        if(!order){
            return NextResponse.json({message:"Order not found"},{status:404})
        }
        return NextResponse.json(order,{status:200})
    } catch (error) {
        return NextResponse.json({message:`get order by id error ${error}`},{status:500})
    }
}