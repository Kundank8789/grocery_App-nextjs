import connectdb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectdb()
        const {userId,location}=await req.json()
        if(!userId || !location){
            return NextResponse.json(
                {message:"missing userId or location"},
                {status:400}

            )
        }
        const user =await User.findByIdAndUpdate(userId,{location})
        if(!user){
            return NextResponse.json(
                {message:"User not found"},
                {status:404}
            )
        }
        return NextResponse.json(
            {message:"Location updated successfully"},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`Internal Server Error:${error}`},
            {status:500}
        )
    }
}