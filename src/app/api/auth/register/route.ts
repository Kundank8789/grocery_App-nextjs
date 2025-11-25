import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import connectdb from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest){
    try {
        await connectdb();
        const{name,email,password}=await req.json();
        const exitUser=await User.findOne({email});
        if(exitUser){
            return NextResponse.json({message:"User already exists"},{status:400});
        }
        if(password.length<6){
            return NextResponse.json({message:"Password must be at least 6 characters"},{status:400});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({name,email,password:hashedPassword})
        return NextResponse.json({message:"User registered successfully",user},{status:201});
    } catch (error) {
        return NextResponse.json({message:`Internal Server Error: ${error}`},{status:500});
    }
}
