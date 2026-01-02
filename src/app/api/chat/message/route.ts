import connectdb from "@/lib/db";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectdb()
        const {roomId}=await req.json()
        const room = await Order.findById(roomId)
        if(!room){
            return NextResponse.json({message:"Room not found"},{status:404})
        }
        const message=await Message.find({roomId:room._id})
        return NextResponse.json(message,{status:200})
    } catch (error) {
        return NextResponse.json({ message: ` save message Error ${error}` }, { status: 500 });
    }
}