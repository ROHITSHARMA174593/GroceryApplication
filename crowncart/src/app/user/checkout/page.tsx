"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building,
  CreditCard,
  Home,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import image from "next/image";
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
      Loading Map...
    </div>
  ),
});

const Checkout = () => {
  const router = useRouter();
  // Redux store se current use ki detail le aate hai and direct hi input fields me bhar dete hai
  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData } = useSelector((state: RootState) => state.cart);

  const subTotal = cartData.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = subTotal > 499 ? 0 : 40;
  const finalTotal = subTotal + deliveryFee;

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  // Map Implementation
  const [position, setPosition] = useState<[number, number]>([28.6139, 77.209]); // Default to Delhi
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod ,setPaymentMethod] = useState<"cod" | "online">("cod")


  // Simplified Persistence
  useEffect(() => {
    const savedPos = localStorage.getItem("checkout_pos");
    const savedAddr = localStorage.getItem("checkout_addr");
    if (savedPos) setPosition(JSON.parse(savedPos));
    if (savedAddr) setAddress(JSON.parse(savedAddr));
  }, []);

  useEffect(() => {
    localStorage.setItem("checkout_pos", JSON.stringify(position));
    localStorage.setItem("checkout_addr", JSON.stringify(address));
  }, [position, address]);

  // Sync Redux userData
  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData.name || prev.fullName,
        mobile: userData.mobile || prev.mobile,
      }));
    }
  }, [userData]);
  useEffect(() => {
    const hasSavedPos = localStorage.getItem("checkout_pos");
    if (navigator.geolocation && !hasSavedPos) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // console.log(position)
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.log("Location Error : ", err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  // Fetching Address From Free API
  // ?  https://nominatim.org/release-docs/latest/api/Reverse/
  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
        );
        console.log("API Data : ", res.data);
        const addressData = res.data.address;
        setAddress((prev) => ({
          ...prev,
          city: addressData.city || addressData.town || addressData.village || addressData.suburb || "",
          state: addressData.state || "",
          pincode: addressData.postcode || "",
          fullAddress: res.data.display_name || "",
        }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchAddress();
  }, [position]);

  const handleFindMyLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setIsLocating(false);
        },
        (err) => {
          console.log("Location Error : ", err);
          setIsLocating(false);
          alert("Could not get your location. Please check if location permissions are enabled in your browser settings (Brave Shields might be blocking it).");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSearchQuery = async () => {
    if (!searchQuery.trim()) return;
    const { OpenStreetMapProvider } = await import("leaflet-geosearch");
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if (results && results.length > 0) {
      const { x, y } = results[0]; // x: lon, y: lat
      setPosition([y, x]);
    }
  };

  //todo : Handle Payment APIs
  const handleCOD = async () => {
    try {
      const res = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((item) => {
          return {
                    grocery: item._id,
                    name: item.name,
                    price: item.price,
                    unit: item.unit,
                    image: item.image,
                    quantity: item.quantity
                  }
        }),
        paymentMethod,
        totalAmount: finalTotal,
        address:{
          fullName: address.fullName,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          mobile: address.mobile,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1]
        }
      })
      // console.log("Order Created : \n",res.data)
      router.push("/user/order-success")
    } catch (err) {
      console.log(err)  
    }
  }
  const handleOnlinePayment = async () => {
    try {
      const res = await axios.post("/api/user/payment", {
        userId: userData?._id,
        items: cartData.map((item) => {
          return {
                    grocery: item._id,
                    name: item.name,
                    price: item.price,
                    unit: item.unit,
                    image: item.image,
                    quantity: item.quantity
                  }
        }),
        paymentMethod,
        totalAmount: finalTotal,
        address:{
          fullName: address.fullName,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          mobile: address.mobile,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1]
        }
      })
      window.location.href = res.data.url; // iss api me hume ek URL mil rha hai u can see in API("/api/user/payment") to uss url ko hum open karenge using window object
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
        onClick={() => router.back()}
      >
        <ArrowLeft size={20} />
        Back to Cart
      </motion.button>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-4 text-green-700"
      >
        Checkout
      </motion.h1>

      {/* Implement the Map and Address Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>
          <div className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
                className="pl-10 w-full border border-gray-200 rounded-lg p-2"
              />
            </div>
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) =>
                  setAddress({ ...address, mobile: e.target.value })
                }
                className="pl-10 w-full border border-gray-200 rounded-lg p-2"
              />
            </div>
            <div className="relative">
              <Home
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullAddress}
                placeholder="Full Address"
                onChange={(e) =>
                  setAddress({ ...address, fullAddress: e.target.value })
                }
                className="pl-10 w-full border border-gray-200 rounded-lg p-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.city}
                  placeholder="City"
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="pl-10 w-full border border-gray-200 rounded-lg p-2"
                />
              </div>
              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.state}
                  placeholder="State"
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="pl-10 w-full border border-gray-200 rounded-lg p-2"
                />
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.pincode}
                  placeholder="Pincode"
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  className="pl-10 w-full border border-gray-200 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Search City or Area ... "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchQuery();
                  }
                }}
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-green-500"
              />
              <button onClick={handleSearchQuery} className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium">
                Search
              </button>
            </div>

            {/* Map Implementation on UI */}
            <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              {position && (
                <MapView position={position} setPosition={setPosition} />
              )}
              
              {/* Current Location Button */}
              <button
                onClick={handleFindMyLocation}
                disabled={isLocating}
                className={`absolute bottom-4 right-4 z-1000 bg-white text-green-700 px-4 py-2 rounded-full shadow-lg border border-green-100 flex items-center gap-2 transition-all font-semibold text-sm ${isLocating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-50'}`}
              >
                <LocateFixed size={16} className={`${isLocating ? 'animate-spin' : 'fill-green-700'}`} />
                {isLocating ? "Locating..." : "Current Location"}
              </button>
            </div>
          </div>
        </motion.div>


        <motion.div
          initial={{opacity:0, x:20}}
          animate={{opacity:1, x:0}}
          transition={{duration:0.5}} 
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-green-600" />
            Payment Method
          </h2>
          <div className="space-y-4 mb-6">
            <button 
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === "online" ? "border-green-600 bg-green-50 shadow-sm" : "hover:bg-gray-50"}`}
            >
              <CreditCard size={18} /> <span className="text-green-600">Pay Online (Stripe)</span>
            </button>

            <button 
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all 
                ${paymentMethod === "cod"
                   ? "border-green-600 bg-green-50 shadow-sm" 
                   : "hover:bg-gray-50"}`}
            >
              <Truck size={18} className="text-green-600" /> <span>Cash on Delivery (COD)</span>
            </button>
          </div>

          {/* Payment Details */}
          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span>SubTotal:</span>
              <span className="font-bold">₹{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-bold">Free</span>
                ) : (
                  `₹${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between border-t border-dashed pt-3 mt-2 font-bold text-lg text-gray-900">
              <span>Final Total:</span>
              <span className="text-green-600">₹{finalTotal.toFixed(2)}</span>
            </div>

            <motion.button
              whileTap={{scale:0.93}} 
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-all font-semibold"
              onClick={() => {
                if(paymentMethod === "cod"){
                  handleCOD();
                }else{
                  handleOnlinePayment();
                }
              }}
            >
              {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
