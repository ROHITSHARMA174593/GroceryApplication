"use client";
import { IGrocery } from "@/models/grocery.model";
import { Plus, ShoppingCart, Minus } from "lucide-react";
import React from "react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart, decrementQuantity, incrementQuantity } from "@/redux/cartslice";

const GroceryCard = ({ item }: { item: IGrocery }) => {
  const realPrice = (item.price * 20) / 100;

  const dispatch = useDispatch<AppDispatch>()

  // todo : Jab user already kisi product ko addtocart kar rakha ho to vo dubaara usi same product ko addtocart na kar sake balki vo counter se uski value ko increase and decrease kar sake
  const {cartData} = useSelector((state:RootState)=>state.cart) 
  const cartItemExitance = cartData.find(i => i._id === item._id) // item params me aa rha hai 

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-green-50 overflow-hidden group transition-all duration-300 relative"
      whileHover={{ y: -5 }}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full bg-linear-to-b from-green-50/50 to-white p-4 flex items-center justify-center overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
        />
        {/* Quick Add Button (Visible on Hover) */}
        <button className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md text-green-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-600 hover:text-white">
          <ShoppingCart size={18} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category Tag */}
        <span className="inline-block px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2">
          {item.category}
        </span>

        {/* Title */}
        <div className="flex flex-row items-center justify-between">
          <div>
            <h3
            className="font-bold text-gray-800 text-lg leading-tight mb-1 line-clamp-1"
            title={item.name}
          >
            {item.name}
          </h3>
           {/* Unit */}
        <p className="text-sm text-gray-400 font-medium mb-3">{item.unit} kg</p>

          </div>
            <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              ₹{item.price + realPrice}
            </span>
            <span className="text-xl font-extrabold text-[#00a63a]">
              ₹{item.price}
            </span>
          </div>

        </div>

       


        {/* Action Button */}
        {
          !cartItemExitance ? (
            <div className="mt-4 flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-[93%] cursor-pointer flex items-center justify-center gap-2 bg-[#00a63a] hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-100 transition-all hover:shadow-lg"
                onClick={() => dispatch(addToCart({...item, quantity: 1}))}
              >
                <Plus size={18} strokeWidth={3} />
                Add to Cart
              </motion.button>
            </div>
          ) : (
            <div className="mt-4 flex justify-center">
                <div className="w-[93%] flex items-center justify-between bg-green-50 rounded-xl px-4 py-1.5 shadow-sm border border-green-100">
                     <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => dispatch(decrementQuantity(item._id!))}
                        className="p-1 rounded-lg bg-white text-green-700 shadow-sm hover:shadow-md transition-all active:scale-95 text-lg" // Added text-lg
                     >
                        <Minus size={18} strokeWidth={3} />
                    </motion.button>
                    
                    <span className="font-bold text-lg text-gray-800">{cartItemExitance.quantity}</span>
                    
                    <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => dispatch(incrementQuantity(item._id!))}
                        className="p-1 rounded-lg bg-[#00a63a] text-white shadow-sm hover:shadow-md transition-all active:scale-95 text-lg" // Added text-lg
                    >
                         <Plus size={18} strokeWidth={3} />
                    </motion.button>
                </div>
            </div>
          )
        }
      </div>
    </motion.div>
  );
};

export default GroceryCard;
