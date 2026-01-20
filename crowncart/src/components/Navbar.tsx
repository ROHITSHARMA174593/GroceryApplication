"use client";
import React, { useState } from "react";
import { Search, ShoppingCart, User, LogOut, ChevronDown, Plus, Menu, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import Link from "next/link";
import mongoose from "mongoose";
import { GrOrderedList } from "react-icons/gr";
import AddGrocery from "./AddGrocery";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role?: "user" | "admin" | "deliveryBoy";
  image?: string;
}

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddGroceryOpen, setIsAddGroceryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cardData = useSelector((state:RootState)=>state.cart.cartData);
  const user = useSelector((state:RootState) => state.user.userData);

  return (
    <>
    <nav className="sticky top-0 z-50 bg-green-50/95 backdrop-blur-md border-b border-green-200 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* ... (Logo) ... */}
          <Link href="/home" className="flex items-center gap-2 group">
            <div className="p-2 bg-[#00a63a] rounded-xl group-hover:bg-emerald-600 transition-colors">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              CrownCart
            </span>
          </Link>


          {/* Middle: Check for Admin Role */}
          {user?.role === "admin" ? (
             <>
                 {/* Desktop Add Grocery Button */}
                 <div className="hidden md:flex flex-1 justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAddGroceryOpen(true)}
                        className="flex items-center gap-2 bg-white border-2 border-[#00a63a] text-[#00a63a] px-4 py-2 rounded-full font-bold shadow-sm hover:bg-green-50 transition-all"
                    >
                        <Plus size={18} />
                        Add Grocery
                    </motion.button>

                    <Link href="/home">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-white border-2 border-[#00a63a] text-[#00a63a] px-4 py-2 rounded-full font-bold shadow-sm hover:bg-green-50 transition-all"
                        >
                            <ShoppingBag size={18} />
                            view Grocery
                        </motion.button>
                    </Link>

                    <Link href="/admin/manage-orders">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-[#00a63a] hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-emerald-200 transition-all"
                        >
                            <GrOrderedList size={18} />
                            Manage Orders
                        </motion.button>
                    </Link>
                 </div>
             </>
          ) : (
            // ... (Search Bar) ...
             <div className="hidden md:flex flex-1 max-w-lg mx-8">
               <div className="relative w-full group">
                 <input
                   type="text"
                   placeholder="Search for products..."
                   className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#00a63a] focus:ring-4 focus:ring-green-50 transition-all outline-none"
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a63a] transition-colors" size={20} />
               </div>
             </div>
          )}


          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            
            {/* Cart Button (Hidden for Admin) */}
            {user?.role !== "admin" && (
                <Link href={"/user/cart"}>
                  <motion.button 
                  
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                  <ShoppingCart size={22} />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-white">
                    {cardData.length}
                  </span>
                </motion.button>
                </Link>
            )}


             {/* Admin Mobile Menu Toggle */}
             {user?.role === "admin" && (
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden p-2 text-gray-600 hover:text-[#00a63a] transition-colors"
                >
                    <Menu size={28} />
                </button>
             )}


            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-green-50 transition-all border border-transparent hover:border-green-200"
              >
                  {/* Avatar / Initial */}
                  {user?.name ? (
                        <p className="w-9 h-9 rounded-full bg-[#00a63a] text-white flex items-center justify-center font-bold text-lg shadow-sm">{user.name.slice(0, 1).toUpperCase()}</p>
                  ) : (
                      <div className="w-9 h-9 rounded-full bg-[#00a63a] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
                      </div>
                  )}

                  {/* Name & Role */}
                  <div className="hidden md:flex flex-col items-start mr-2">
                    <p className="text-sm font-bold text-gray-800 leading-tight">
                        {user?.name || "Guest User"}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide leading-tight">
                        {user?.role || "Visitor"}
                    </p>
                  </div>
                  
                  <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
                        {user?.role === 'admin' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full border border-green-200 uppercase tracking-wider">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    

                    <Link href="/user/my-order" className="block">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-green-50 flex items-center gap-2 transition-colors">
                            <ShoppingBag size={16} className="text-green-600" />
                            My Orders
                        </button>
                    </Link>

                    <button 
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    {/* Admin Mobile Side Drawer */}
    <AnimatePresence>
        {isMobileMenuOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
                />
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white z-60 shadow-2xl md:hidden p-6"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-800">Admin Menu</h2>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                            <LogOut size={24} className="rotate-180"/> 
                        </button>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsAddGroceryOpen(true);
                            }}
                            className="w-full flex items-center gap-3 bg-[#00a63a] text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all"
                        >
                            <Plus size={20} />
                            Add Grocery
                        </button>

                        <Link href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-full flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                <ShoppingBag size={20} />
                                View Grocery
                            </button>
                        </Link>

                        <Link href="/admin/manage-orders" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-full flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                <GrOrderedList size={20} />
                                Manage Orders
                            </button>
                        </Link>

                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="w-full flex items-center gap-3 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold hover:bg-red-100 transition-all"
                        >
                            <LogOut size={20} />
                            Log Out
                        </button>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>

    <AddGrocery isOpen={isAddGroceryOpen} onClose={() => setIsAddGroceryOpen(false)} />
    </>
  );
};

export default Navbar;