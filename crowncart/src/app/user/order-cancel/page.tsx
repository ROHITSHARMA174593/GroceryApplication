"use client";

import React from "react";
import { motion } from "motion/react";
import { XCircle, RefreshCcw, Home, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OrderCancel = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100 relative overflow-hidden"
      >
         {/* Decorative Background Element */}
         <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-red-400 to-red-600" />

        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20, 
            delay: 0.2 
          }}
          className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6"
        >
          <XCircle size={48} className="text-red-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Order Cancelled
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-8 leading-relaxed"
        >
          Your payment was not processed or you cancelled the transaction. No funds have been deducted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push("/user/checkout")}
            className="w-full bg-red-600 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg hover:bg-red-700 hover:shadow-red-200 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>

          <div className="grid grid-cols-2 gap-3">
             <Link href="/user/cart" className="w-full">
                <button className="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 border border-gray-100">
                    <ShoppingBag size={18} />
                    Cart
                </button>
             </Link>
             <Link href="/" className="w-full">
                <button className="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 border border-gray-100">
                    <Home size={18} />
                    Home
                </button>
             </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderCancel;
