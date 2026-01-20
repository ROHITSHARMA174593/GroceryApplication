"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, Plus, Check } from "lucide-react";
import axios from "axios";

const AddGrocery = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    unit: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = [
    "Fruit & Vegitables",
    "Bakery",
    "Dairy",
    "Snacks",
    "Spices & Masalas",
    "Personal Care",
    "Drinks",
    "Baby & Pet Care",
    "Rice, Atta & Grains",
    "Biscuits & Cookies",
    "Chocolates & Biscuits",
    "Sweets"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!image) {
      setError("Please select an image");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("unit", formData.unit);
    data.append("image", image);

    try {
      const res = await axios.post("/api/admin/addgrocery", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setFormData({ name: "", category: "", price: "", unit: "" });
      setImage(null);
      setTimeout(() => {
          setSuccess(false);
          onClose(); // Close modal after success
      }, 2000);
      console.log(res)
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add grocery");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#00a63a] p-4 flex justify-between items-center text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus className="bg-white/20 p-1 rounded-lg" size={28}/> Add New Grocery
            </h2>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2"><Check size={16}/> Successfully Added!</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00a63a]/20 focus:border-[#00a63a] outline-none transition-all"
                  placeholder="e.g. Fresh Apples"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00a63a]/20 focus:border-[#00a63a] outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00a63a]/20 focus:border-[#00a63a] outline-none transition-all"
                      placeholder="e.g. 120"
                    />
                  </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Unit (g/kg/pcs)</label>
                 {/* Assuming unit checks logic, but user defined unit as number in schema. keeping as number input for now */}
                <input
                  type="number"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                   min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00a63a]/20 focus:border-[#00a63a] outline-none transition-all"
                  placeholder="e.g. 1 (kg/pc)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="image/*"
                         onChange={handleImageChange}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                        {image ? (
                             <div className="text-[#00a63a] font-semibold flex items-center gap-2">
                                <Check size={20}/> {image.name}
                             </div>
                        ) : (
                            <>
                                <Upload size={24} />
                                <span className="text-sm">Click to upload image</span>
                            </>
                        )}
                    </div>
                </div>
              </div>


              <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00a63a] hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20}/> Add Product</>}
                  </button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddGrocery;
