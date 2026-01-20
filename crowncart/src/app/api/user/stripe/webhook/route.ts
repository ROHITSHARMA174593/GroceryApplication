import dbConnect from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    const signature = req.headers.get("stripe-signature")
    const rowBody = await req.text();
    let event;
    try {
        event = await stripe.webhooks.constructEventAsync(
            rowBody, 
            signature!,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.log("Signature Verification Failed",err)
    }

    if(event?.type === "checkout.session.completed"){
        const session = event.data.object
        await dbConnect();
        await Order.findByIdAndUpdate(session?.metadata?.orderId,{
            isPaid:true
        })
    }

    return NextResponse.json({received:true},{status:200})
}
