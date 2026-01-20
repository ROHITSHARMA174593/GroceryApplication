import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await dbConnect();
        const session = await auth();
        console.log("Fetching orders for user:", session?.user?.id);
        const orders = await Order.find({user: session?.user?.id}).sort({createdAt: -1}).populate("user")
        if(!orders){
            return NextResponse.json({message:"No Orders Found"},{status:404})
        }
        return NextResponse.json(orders, {status:200})
    } catch (error) {
        return NextResponse.json({message:"Error in Fetching Orders : (/api/user/my-orders)"},{status:500})
        
    }
}