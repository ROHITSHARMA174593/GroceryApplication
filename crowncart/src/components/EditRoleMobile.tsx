"use client";
import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { User, Shield, Truck, ChevronRight, Loader2, UserCog, Bike } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

const EditRoleMobile = () => {
  const [selectedRole, setSelectedRole] = useState("user");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const {update} = useSession();
 
  const router = useRouter();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const roles = [
    { id: "admin", label: "Admin", icon: Shield, delay: 0.1 },
    { id: "user", label: "User", icon: User, delay: 0.2 },
    { id: "delivery", label: "Delivery Boy", icon: Truck, delay: 0.3 },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSubmit = async () => {
    if (mobile.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/user/edit-role-mobile", { role: selectedRole, mobile });
      window.location.reload(); 
      await update({role: selectedRole});
      router.push("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } }
  };

  return (
    <div 
        className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden perspective-1000"
        style={{ perspective: 1000 }}
    >
        {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#00a63a]/5 rounded-full blur-[100px]" 
        />
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="z-10 w-full max-w-4xl flex flex-col items-center p-10 rounded-3xl"
      >
        <motion.h1 
            variants={itemVariants} 
            style={{ transform: "translateZ(50px)" }}
            className="text-3xl md:text-5xl font-extrabold text-[#00a63a] mb-8 md:mb-12 tracking-tight text-center"
        >
          Select Your Role
        </motion.h1>

        {/* Role Cards */}
        <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full mb-8 md:mb-12 px-4 md:px-0"
            style={{ transform: "translateZ(30px)" }}
        >
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <motion.button
                key={role.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03, z: 20 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 shadow-sm
                  ${isSelected 
                    ? "border-[#00a63a] bg-[#00a63a]/5 text-[#00a63a] shadow-md shadow-emerald-100" 
                    : "border-gray-100 bg-white text-gray-500 hover:border-emerald-200 hover:bg-gray-50 hover:shadow-lg hover:shadow-emerald-50"
                  }
                `}
              >
                <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${isSelected ? "bg-[#00a63a]/10" : "bg-gray-100"}`}>
                    <Icon size={32} className={`${isSelected ? "text-[#00a63a]" : "text-gray-400"}`} />
                </div>
                <span className={`font-bold text-lg ${isSelected ? "text-gray-900" : "text-gray-500"}`}>
                  {role.label}
                </span>
                <p className="text-xs text-gray-400 mt-2 font-medium">Access as {role.label}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Mobile Input */}
        <motion.div variants={itemVariants} style={{ transform: "translateZ(20px)" }} className="w-full max-w-sm mb-10 text-center px-4">
            <label className="block text-gray-700 font-bold mb-3 text-lg">Enter Your Mobile No.</label>
            <div className="relative">
                <input 
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} // Only numbers
                    placeholder="98765 43210"
                    maxLength={10}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-xl text-gray-800 font-bold focus:outline-none focus:ring-4 focus:ring-[#00a63a]/10 focus:border-[#00a63a] transition-all placeholder:text-gray-300 shadow-inner"
                />
                {mobile.length === 10 && (
                     <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00a63a]"
                     >
                        <Shield size={20} className="fill-current" />
                     </motion.div>
                )}
            </div>
            {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-3 font-semibold bg-red-50 py-1 px-3 rounded-full inline-block">
                    {error}
                </motion.p>
            )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
            variants={itemVariants}
            style={{ transform: "translateZ(40px)" }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(0, 166, 58, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading}
            className="group flex items-center gap-3 px-12 py-4 bg-linear-to-r from-[#00a63a] to-emerald-600 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
                <><Loader2 className="animate-spin" size={24} /> Processing...</>
            ) : (
                <>
                    Are You Ready 
                    <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                        <ChevronRight size={20} />
                    </div>
                </>
            )}
        </motion.button>

      </motion.div>
    </div>
  );
};

export default EditRoleMobile;