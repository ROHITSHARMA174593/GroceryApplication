"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MapPin,
  Phone,
  User,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Truck,
} from "lucide-react";
import { format } from "date-fns";
import { IOrder } from "@/models/order.model";

const ManageOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/admin/get-orders");
        setOrders(res.data.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "out of delivery":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00a63a]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <Package className="text-[#00a63a]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
            <p className="text-gray-500 text-sm">
              View and manage customer orders
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Package className="text-[#00a63a]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        Order #{order._id.toString().toUpperCase().slice(-6)} {/* only starting ke 6 */}
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {format(
                          new Date(order.createdAt!),
                          "dd/MM/yyyy, HH:mm:ss"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                      className="w-full md:w-40 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                      defaultValue={order.status}
                    >
                      <option value="pending">PENDING</option>
                      <option value="out of delivery">OUT FOR DELIVERY</option>
                      <option value="delivered">DELIVERED</option>
                    </select>
                  </div>
                </div>

                {/* Customer & Payment Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          {order.address.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(order.user as any)?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="text-gray-400 mt-1" />
                      <p className="text-sm text-gray-600">
                        {order.address.phone}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gray-400 mt-1" />
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {order.address.fullAddress}, {order.address.city},{" "}
                        {order.address.state}, {order.address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-gray-400" />
                      <p className="text-sm text-gray-600 capitalize">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-md ${
                          order.isPaid
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {order.isPaid ? "PAID" : "UNPAID"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expandable Items Section */}
                <div className="border-t border-gray-100 pt-4">
                  <button
                    onClick={() => toggleExpand(order._id.toString())}
                    className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-[#00a63a] transition-colors group"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Package size={16} />
                      View {order.items.length} Items
                    </span>
                    {expandedOrderId === order._id.toString() ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedOrderId === order._id.toString() && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} {item.unit} x ₹{item.price}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-gray-800">
                                ₹{Number(item.price) * item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Truck size={16} />
                  <span>
                    Delivery:{" "}
                    <span
                      className={`font-medium ${
                        order.status === "delivered"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  Total:{" "}
                  <span className="text-[#00a63a]">₹{order.totalAmount}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Package className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-800">
                No Orders Found
              </h3>
              <p className="text-gray-500">
                When customers place orders, they will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
