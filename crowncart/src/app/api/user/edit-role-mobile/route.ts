import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        await dbConnect();
        const {role, mobile} = await req.json();
        console.log("Edit Role Mobile Request:", {role, mobile});

        const session = await auth();
        console.log("Session in API:", session?.user?.email);

        if(!session?.user?.email){
             return NextResponse.json({message:"UNAUTHORIZED"}, {status:401});
        }

        const user = await User.findOneAndUpdate(
            {email: session.user.email},
            {role, mobile}, 
            {new: true} // Return the updated document
        );
        
        console.log("Updated User:", user);

        if(!user){
            return NextResponse.json({message:"User not found"}, {status:404});
        }
        return NextResponse.json({message:"User updated successfully", user}, {status:200});
    } catch (error: any) {
        console.error("Error in Edit Role Mobile API:", error);
        if (error.code === 11000) {
            return NextResponse.json({ message: "Mobile number already in use" }, { status: 400 });
        }
        return NextResponse.json({ message: "Error in Edit Role and Mobile (Internal Server Error)", error: error }, { status: 500 });
    }
}