"use client";

import { RootState } from "@/redux/store";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "@/redux/cartslice";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const router = useRouter();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const subTotal = cartData.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = subTotal > 499 ? 0 : 40;
  const total = subTotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-[#00a63a] font-bold mb-8 hover:underline"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <div className="flex items-center justify-center gap-3 mb-10">
          <ShoppingCart size={32} className="text-[#00a63a]" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            Your Shopping Cart
          </h1>
        </div>

        {cartData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <ShoppingCart size={64} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-2xl font-bold text-gray-400">
              Your cart is empty
            </h2>
            <Link
              href="/home"
              className="mt-6 inline-block bg-[#00a63a] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="flex-1 space-y-4">
              {cartData.map((item) => (
                <motion.div
                  key={item._id?.toString()}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
                >
                  {/* Image */}
                  <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {item.unit} kg
                      {/* Assuming unit is number, adding 'kg' for display as per example */}
                    </p>
                    <p className="font-bold text-[#00a63a] mt-1">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                      <button
                        onClick={() => dispatch(decrementQuantity(item._id!))}
                        className="p-1 rounded-md bg-white text-gray-600 shadow-sm hover:text-green-600 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-800 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(incrementQuantity(item._id!))}
                        className="p-1 rounded-md bg-white text-gray-600 shadow-sm hover:text-green-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item._id!))}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-96 shrink-0">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>
                        {deliveryFee === 0 ? (
                            <span className="text-green-600 font-bold">Free</span>
                        ) : (
                            `₹${deliveryFee.toFixed(2)}`
                        )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-extrabold text-gray-800">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                onClick={() => router.push("/user/checkout")}                
                className="w-full bg-[#00a63a] hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95 mb-4">
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full text-red-500 font-semibold text-sm hover:text-red-700 hover:underline transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;