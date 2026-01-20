import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData()
    const name = formData.get("name")
    const category = formData.get("category")
    const price = formData.get("price")
    const image = formData.get("image") as Blob | null
    const unit = formData.get("unit")

    // this variable if for sending data in response as a URL that url will uploading on mongoose and it will come from cloudinary
    let imageUrl;
    if(image){
        imageUrl = await uploadOnCloudinary(image);
    }
    if (!imageUrl) {
        return NextResponse.json({ message: "Failed to upload image" }, { status: 400 });
    }
    const grocery = await Grocery.create({
        name,
        category,
        price,
        image: imageUrl,
        unit,
    })
    return NextResponse.json(grocery, {status: 201})
    
  } catch (err: any) {
    console.error("Error in Add Grocery API:", err); // Log the full error to the terminal
    return NextResponse.json(
        {msg: "Error in Adding Grocery", error: err.message }, // Send understandable error message
        {status: 500} 
    )
  }
}
