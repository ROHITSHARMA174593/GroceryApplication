"use client"

import { Apple, Baby, Candy, ChevronLeft, Cookie, Flame, Heart, Home, Milk, Pizza, Wheat } from 'lucide-react'
import { GiChocolateBar } from 'react-icons/gi'
import {motion} from "motion/react"
import { useEffect, useRef, useState } from 'react'

const CategorySlider = () => {
    // Auto Scroll Effect removed in favor of infinite CSS/Framer animation


    const categories = [
        {name:"Fruits & Vegitables", icon:Apple, color: "bg-green-100"},
        {name:"Bakery", icon:Pizza, color: "bg-yellow-100"},
        {name:"Dairy",icon:Milk, color: "bg-blue-100"},
        {name:"Snacks",icon: Cookie, color: "bg-red-100"},
        {name:"Spices & Masalas", icon:Flame,color: "bg-orange-100"},
        {name:"Personal Care", icon:Heart, color: "bg-pink-100"},
        {name:"House Essentials", icon:Home, color: "bg-green-100"},
        {name:"Baby & Pet Care", icon:Baby, color: "bg-yellow-100"},
        {name:"Rice, Atta & Grains", icon:Wheat, color: "bg-blue-100"},
        {name:"Biscuits & Cookies", icon:Cookie, color: "bg-red-100"},
        {name:"Chocolates & Biscuits", icon:GiChocolateBar, color: "bg-orange-100"},
        {name:"Sweets", icon:Candy, color: "bg-pink-100"}
    ]
    
    // Duplicate categories for seamless loop
    const duplicatedCategories = [...categories, ...categories];
  return (
    <motion.div
     className='w-[90%] md:w-[80%] mx-auto mt-10 relative'
     initial={{opacity:0, y:50}}
     whileInView={{opacity:1, y:0}}
     transition={{duration:0.5}}
     viewport={{once:false, amount:0.5}}
     >
        <h2 className='text-2xl font-bold md:text-3xl text-green-700 mb-6 text-center'>🛒 Shop By Category</h2>
        <div className='flex overflow-hidden w-full mask-gradient'>
             <motion.div 
              className='flex gap-6 px-4 pb-8'
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                ease: "linear",
                duration: 20, 
                repeat: Infinity 
              }}
              
            >
                {
                    duplicatedCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            className={`shrink-0 flex flex-col items-center justify-center gap-3 p-6 min-w-[140px] md:min-w-[160px] h-40 rounded-3xl shadow-sm hover:shadow-lg cursor-pointer transition-shadow ${category.color}`}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="bg-white/60 p-3 rounded-full backdrop-blur-sm">
                                <category.icon size={32} className="text-gray-700" />
                            </div>
                            <p className='text-sm font-bold text-gray-800 text-center'>{category.name}</p>
                        </motion.div>
                    ))
                }
            </motion.div>
        </div>
    </motion.div>
  )
}

export default CategorySlider;