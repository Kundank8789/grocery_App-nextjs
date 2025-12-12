import connectdb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    const sig = req.headers.get("Stripe-Signature")
    const rawBody = await req.text();
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        console.log("Webhook signature verification failed.", error);
    }

    if(event?.type==="checkout.session.completed"){
        const session=event.data.object
        await connectdb();
        await Order.findByIdAndUpdate(session?.metadata?.orderId,{
            isPaid:true
        })
    }

    return NextResponse.json({recived:true},{status:200})
}