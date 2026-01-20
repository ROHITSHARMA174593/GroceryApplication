"use client";

import React from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Package } from "lucide-react";

const OrcerSuccess = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-linear-to-b from-green-50 to-white">
      <motion.div
       className="relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
            type:"spring",
            stiffness:100,
            damping:10,
            duration:0.5
        }}
      >
        <CheckCircle className="text-green-600 w-24 h-24 md:w-28 md:h-28"/>
        <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0, scale:0.6 }}
            animate={{ opacity: [0.3, 0, 0.3], scale:[1,0.6,1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
            <div className="w-full h-full rounded-full bg-green-700 blur-2xl">

            </div>
        </motion.div>
      </motion.div>
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-green-700 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Order Placed Successfully
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-600 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Thank you for your order! We will notify you once your order is ready.
        You can track its progress in your{" "}
        <span
          className="text-green-700 font-bold cursor-pointer hover:underline hover:text-green-500 transition-all "
          onClick={() => router.push("/user/cart")}
        >
          My Order
        </span>
         -- Section
      </motion.p>
      
        <motion.div
            initial={{ opacity: 1, y: 40 }}
            animate={{ opacity: 1, y: [0,-10,0] }}
            transition={{ delay:1, duration:2, repeat:Infinity, ease:"easeInOut" }}
            className="mt-10"
        >
            <Package className="w-16 h-16 md:w-20 md:h-20 text-green-500" />
        </motion.div>

        <motion.button
        className="bg-green-700 text-white px-6 py-2 rounded-full mt-6 flex items-center justify-center gap-2 mx-auto"
        whileHover={{scale:1.2}}
        whileTap={{scale: 0.93}}
        onClick={() => router.push("/user/my-order")}
      >
        Go to My Orders Page <ArrowRight />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, }}
        animate={{ opacity: [0.2,0.6,0.2], }}
        transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >

        <div className="absolute top-20 left-[10%] w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute top-30 left-[32%] w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-24 left-[50%] w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute top-30 left-[70%] w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 left-[90%] w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>

      </motion.div>
    </div>
  );
};

export default OrcerSuccess;
