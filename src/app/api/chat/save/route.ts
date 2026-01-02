import connectdb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectdb()
        const { senderId,text,roomId,time } = await req.json()
        const room = await Order.findById(roomId )
        if (!room) {
            return NextResponse.json({message:"Room not found"},{status:404})
        
        }
        const message = await room.messages.create({ senderId, text, roomId, time })
        return NextResponse.json(message, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `create room Error ${error}` }, { status: 500 });
    }
}