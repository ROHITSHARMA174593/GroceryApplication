import dbConnect from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        await dbConnect();
        const orders = await Order.find({}).populate("user").sort({createdAt:-1});
        return NextResponse.json({orders}, {status:200})
    } catch (error) {
        return NextResponse.json({message:`Error in get-orders api ${error}`}, {status:500})
    }

}