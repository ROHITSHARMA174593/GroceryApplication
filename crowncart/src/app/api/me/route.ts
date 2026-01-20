import { auth } from "@/auth";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const session = await auth();
        if(!session || !session.user){
            return NextResponse.json({error:"Unauthorized User"}, {status:401})
        }
        const user = await User.findOne({email:session.user.email}).select("-password"); //this line return complete user except password
        if(!user){
            return NextResponse.json({error:"User not found"}, {status:404})
        }
        return NextResponse.json({user},{status: 200});
    } catch (err) {
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }

}