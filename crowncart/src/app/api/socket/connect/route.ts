import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await dbConnect();

        const {userId, socketId} = await req.json();
        console.log(`Socket connect API called. UserId: ${userId}, SocketId: ${socketId}`);
        const user = await User.findByIdAndUpdate(userId, {
            socketId,
            isOnline:true
        },{new:true})
        console.log("User updated result:", user);
        if(!user){
            return NextResponse.json({success:false, message:"User not found"}, {status:404})
        }
        return NextResponse.json({success:true},{status:200})
    } catch (err) {
        return NextResponse.json({success:false}, {status:500})
    }
}