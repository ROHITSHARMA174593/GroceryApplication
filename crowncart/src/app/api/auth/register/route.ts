import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try{
        await dbConnect();
        const {name, email, password, mobile} = await request.json();
        const existUser = await User.findOne({email});
        if(existUser){
            return new NextResponse(JSON.stringify({error:"User already exists"}), {status:400})
        }
        if(password.length < 6){
            return new NextResponse(JSON.stringify({error:"Password must be at least 6 characters long"}), {status:400})
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // Attempt to drop the problematic mobile index if it exists (Fix for E11000 null error)
        try {
           await User.collection.dropIndex('mobile_1'); 
        } catch (e) {
            // Index might not exist, ignore
        }

        const user = await User.create({name, email, password:hashedPassword, mobile});
        return new NextResponse(JSON.stringify({message:"User registered successfully"}), {status:201})

    }catch(err){
        console.error("Registration Error Handler:", err);
        return NextResponse.json(
            {msg: "Register Error", error: err instanceof Error ? err.message : "Internal Server Error"},
            {status:500}
        )
    }
    
    
}

// name, email, password is coming from frontend 