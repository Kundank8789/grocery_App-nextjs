import { NextRequest, NextResponse} from "next/server";
import connectdb from "@/lib/db";
import { auth } from "@/auth";
import User from "@/models/user.model";


export async function POST(req:NextRequest) {
    try {
        await connectdb();
        const{role,mobile}=await req.json();
        const session=await auth();
        const user=await User.findOneAndUpdate({email:session?.user?.email},{
            role, mobile
            },{new:true});
            if(!user){
                return NextResponse.json(
                    {message:"User not found"},
                    {status:404}
                )
        }
        return NextResponse.json(
            {message:"User role and mobile updated successfully"},
            {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {message:`edit role mobile error: ${error}`},
            {status:500}
        )
    }
}