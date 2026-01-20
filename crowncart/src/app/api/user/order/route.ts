import dbConnect from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, res:NextResponse){
    try {
        await dbConnect();
        const {userId, items, paymentMethod, totalAmount, address} = await req.json();
        const user = await User.findById(userId)
        if(!user){
            return NextResponse.json({message:"User not found"}, {status:404})
        }
        if(!items || !userId || !paymentMethod || !totalAmount || !address){
            return NextResponse.json({message:"All fields are required"}, {status:400})
        }

        // Create Order
        const newOrder = await Order.create({
            user:userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })
        return NextResponse.json({message:"Order created successfully", newOrder}, {status:201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Failed to create order"}, {status:500})
    }

}