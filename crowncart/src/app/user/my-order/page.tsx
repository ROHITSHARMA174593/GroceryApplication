"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { 
  Package, 
  MapPin, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Truck,
  ArrowLeft,
  ShoppingBag
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OrderItem {
    grocery: string;
    name: string;
    price: string;
    unit: string;
    image: string;
    quantity: number;
    _id: string;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: "cod" | "online";
    isPaid: boolean;
    status: "pending" | "out of delivery" | "delivered";
    address: {
        fullAddress: string;
        fullName: string;
        state:string;
        city:string;
        pincode:string;
        mobile?: string;
    };
    createdAt: string;
}

const MyOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Expanded state for each order card
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/user/my-orders");
        console.log(res.data)
        // The API returns the array directly now
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
     return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gray-50/50'>
             <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
             />
        </div>
     )
  }

  return (
    <div className='bg-linear-to-b from-white to-gray-100 min-h-screen w-full'>
        <div className='max-w-3xl mx-auto px-4 pt-4 md:pt-10 pb-20'>
            
            <div className="flex items-center gap-4 mb-8">
                 <button 
                    onClick={() => router.push("/")}
                    className="bg-white p-2 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                 >
                    <ArrowLeft size={20} className="text-gray-600"/>
                 </button>
                 <h1 className='text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
                    <ShoppingBag className="text-green-600 fill-green-50" />
                    My Orders
                 </h1>
            </div>

            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Package size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                        <button 
                            onClick={() => router.push("/")}
                            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden"
                        >
                            {/* Card Header with Green Accent Top */}
                            <div className="h-1.5 w-full bg-linear-to-r from-green-400 to-green-600"></div>
                            
                            <div className="p-5 md:p-6">
                                {/* Order Info Row */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-800">
                                                Order <span className="text-green-600">#{order._id.toUpperCase()}</span>
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                            <Clock size={14} />
                                            {new Date(order.createdAt).toLocaleString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit', hour12: true
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                                            order.isPaid 
                                            ? "bg-red-50 text-red-600 border-red-100" // Matching the image reference (Unpaid style, but logic is isPaid)
                                            // Wait, logic should be: if isPaid is true -> Paid (Green). If false -> Unpaid (Red).
                                            // The image showed "Unpaid" in Red. 
                                            : "bg-red-50 text-red-600 border-red-100" 
                                        }`}>
                                            {/* Note: I'm keeping logic correct vs image visual. If isPaid is true, it should show Paid. */}
                                            {order.isPaid ? (
                                                 <span className="bg-green-50 text-green-700 border-green-200 px-3 py-1 rounded-full border">Paid</span>
                                            ) : (
                                                 <span className="bg-red-50 text-red-600 border-red-200 px-3 py-1 rounded-full border">Unpaid</span>
                                            )}
                                        </span>
                                        
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                            order.status === "delivered" 
                                                ? "bg-green-50 text-green-700 border-green-200" 
                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid md:grid-cols-1 gap-4 mb-4">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <CreditCard size={18} className="text-green-600" />
                                        </div>
                                        <span className="font-medium">
                                            {order.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                                        <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                                            <MapPin size={18} className="text-green-600" />
                                        </div>
                                        <span className="font-medium line-clamp-2 mt-1">
                                            {order.address.fullAddress}, {order.address.city}, {order.address.state} - {order.address.pincode}
                                        </span>
                                    </div>
                                </div>

                                {/* Items Toggle Header */}
                                <button 
                                    onClick={() => toggleOrder(order._id)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-dashed border-gray-200"
                                >
                                    <span className="flex items-center gap-2 text-sm font-bold text-gray-700 group-hover:text-green-700 transition-colors">
                                        <Package size={18} className="text-green-600" />
                                        {expandedOrders[order._id] ? "Hide Order Items" : `View ${order.items.length} Items`}
                                    </span>
                                    {expandedOrders[order._id] 
                                        ? <ChevronUp size={18} className="text-gray-400 group-hover:text-green-600" /> 
                                        : <ChevronDown size={18} className="text-gray-400 group-hover:text-green-600" />
                                    }
                                </button>

                                {/* Expanded Items */}
                                <AnimatePresence>
                                    {expandedOrders[order._id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-2 space-y-3">
                                                {order.items.map((item) => (
                                                    <div key={item._id} className="flex items-center gap-4 p-3 bg-white border border-gray-50 rounded-xl hover:border-green-100 transition-colors">
                                                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                                            <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{item.quantity} x {item.unit}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="font-bold text-gray-800 text-sm">₹{Number(item.price) * item.quantity}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                                    <Truck size={14} />
                                    Delivery: {order.status}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Total:</span>
                                    <span className="text-lg font-extrabold text-gray-800">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    </div>
  )
}

export default MyOrders