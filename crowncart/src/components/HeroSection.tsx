"use client"

import { Leaf, Smartphone, Truck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const HeroSection = () => {

    // const user = useSelector((state:RootState) => state.user);
    //todo : Now we can access the data anywhere in this application using redux-toolkit || it make easy development when u want to store data in current time

    const slides = [
        {
            id:1,
            icon: <Leaf className='w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg' />,
            title: "Fresh Organic Groceries",
            subtitle: "Farm-fresh fruits, vegetables, and daily essentials delivered to you. ",
            btnText: "Shop Now",
            bg: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
        },
        {
            id:2,
            icon: <Truck className='w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg' />,
            title: "Fast & Reliable Delivery",
            subtitle: "We ensure your groceries reach your doorstep in no time",
            btnText: "Order Now",
            bg: "https://plus.unsplash.com/premium_photo-1661766131927-5026561fd0cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        },
        {
            id:3,
            icon: <Smartphone className='w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg' />,
            title: "Shop AnyTime",
            subtitle: "Easy and seamless online grocery shopping experience",
            btnText: "Get Started",
            bg: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ]

    const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [])
  return (
    <>
        <div className='relative w-[98%] mx-auto mt-4 h-[80vh] rounded-3xl overflow-hidden shadow-2xl bg-gray-900'>
            <AnimatePresence mode='wait'>
                <motion.div
                    key={slides[currentSlide].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className='absolute inset-0'
                >
                    <img
                        src={slides[currentSlide].bg} 
                        alt={slides[currentSlide].title}
                        className="w-full h-full object-cover"
                    />
                    <div className='absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white p-4'>
                        <motion.div
                             initial={{ y: -50, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             transition={{ duration: 0.7, delay: 0.2 }}
                             className="flex flex-col items-center gap-4"
                        >
                            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm mb-2">
                                {slides[currentSlide].icon}
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold">{slides[currentSlide].title}</h2>
                            <p className="text-lg md:text-xl max-w-2xl">{slides[currentSlide].subtitle}</p>
                            <button className="bg-[#00a63a] hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg">
                                {slides[currentSlide].btnText}
                            </button>
                        </motion.div>
                    </div>
                    
                </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${
                            currentSlide === index 
                                ? "w-8 bg-[#00a63a] shadow-lg shadow-emerald-900/20" 
                                : "w-3 bg-white/50 hover:bg-white hover:scale-110"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    </>  
  )
}
export default HeroSection