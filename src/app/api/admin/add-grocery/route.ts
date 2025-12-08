import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectdb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectdb();
        const session=await auth();
        if(session?.user?.role!=='admin'){
            return NextResponse.json(
                {message:"you are not admin"},
                {status:401}
            )
        }
        const formData=await req.formData();
        const name=formData.get('name') as string;
        const price=formData.get('price') as string;
        const category=formData.get('category') as string;
        const unit=formData.get('unit') as string;
        const file=formData.get('image') as Blob | null;
        let imageUrl
        if(file){
            imageUrl=await uploadOnCloudinary(file);
        }
        const grocery=await Grocery.create({name,price,category,image:imageUrl||'',unit

        })
        return NextResponse.json(
            grocery,
            {status:201}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`add grocery error: ${error}`},
            {status:500}
        )
    }

}