import dbConnect from "@/lib/db";
import { DeliveryAssignment } from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, {params}:{params:{orderId:string}}){
    try {
        await dbConnect();
        const { orderId } = params;
        const { status } = await req.json();
        const order = await Order.findById(orderId).populate("user");
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        order.status=status;
        let availableDeliveryBoysPayload:any = [];

        if(status==="out of delivery" && !order.assignment){    
            const {latitude, longitude} = order.address;
            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location:{
                    $near:{
                        $geometry:{
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 5000 
                    }
                }
            })     
            
            const nearByBoysIds = nearByDeliveryBoys.map((boy:any) => boy._id)
            const busyDeliveryBoys = await DeliveryAssignment.find({
                assignedTo:{$in:nearByBoysIds}, 
                status:{$nin: ['broadcasted', 'completed']} 
            }).distinct("assignedTo")

            const busyIdSet = new Set(busyDeliveryBoys.map(b => String(b)))
            const availableDeliveryBoys  = nearByDeliveryBoys.filter((boy:any) => {
                return !busyIdSet.has(String(boy._id))
            })

            const candidates = availableDeliveryBoys.map((b:any)=>b._id)
            
            if(candidates.length == 0){
                await order.save() // Save status update even if no delivery boy is found
                return NextResponse.json(
                    {message : "Order status updated, but no delivery boys available nearby"},
                    {status:200}
                )
            }
    
            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                broadcastedTo: candidates,
                status: 'broadcasted'
            })
    
            order.assignment = deliveryAssignment._id
    
            availableDeliveryBoysPayload = availableDeliveryBoys.map((b:any) => ({
                userId: b._id,
                name: b.name,
                mobile: b.mobile,
                longitude : b.location.coordinates[0],
                latitude : b.location.coordinates[1],
            }))
            await deliveryAssignment.populate("order")
        }

        await order.save();
        await order.populate("user")
        return NextResponse.json({success:true, order, availableDeliveryBoysPayload}, {status:200})

    } catch (err:any) {
        console.log("Error updating order status:", err);
        return NextResponse.json({message: `Error updating order status: ${err.message}`}, {status:500})
    }
}