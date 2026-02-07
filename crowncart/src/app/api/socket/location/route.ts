import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { userId, latitude, longitude } = await req.json();

        if (!userId || latitude === undefined || longitude === undefined) {
             return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(userId, {
            location: {
                type: "Point",
                coordinates: [longitude, latitude] // GeoJSON expects [longitude, latitude]
            }
        }, { new: true });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (err: any) {
        console.error("Error updating location:", err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
