import connectdb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        await connectdb()
        const orders=await Order.find({}).populate("user").sort({createdAt:-1})
        return NextResponse.json(orders,{status:200})
    } catch (error) {
        return NextResponse.json({message:`Internal Server Error:${error}`},{status:500})
    }
}