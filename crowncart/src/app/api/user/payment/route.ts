import dbConnect from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ! ka mtlb ki ye aayegi hi no chance ki nahi aayegi

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();
    if (!userId || !items || !paymentMethod || !totalAmount || !address) {
      return new NextResponse(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "CrownCart Order Payment",
            },
            unit_amount: totalAmount * 100, // kyuki ye value ko paiso me leta hai usko convert karne ke liye (mtlb jo value uper totalAmount me hai vo user ko show karne ke liye to directly use ho sakti hai lekin jab stripe payment method me use karte hai to use rup. me convert karna hota hai)
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: newOrder._id.toString(),
      },
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
    }); 
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    return NextResponse.json({message: "Order Payment Error...",err}, {status: 500})
  }
}
