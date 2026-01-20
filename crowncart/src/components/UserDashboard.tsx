import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import dbConnect from '@/lib/db'
import Grocery from '@/models/grocery.model'
import GroceryCard from './GroceryCard'

const UserDashboard = async() => {
  await dbConnect();
  const groceriesData = await Grocery.find({}).lean();
  
  const groceries = groceriesData.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  }));

  return (
    <>
    <HeroSection />
    <CategorySlider />
    <div className='w-[90%] md:w-[80%] mx-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
    {
      groceries.map((item: any) => (
        <GroceryCard key={item._id} item={item}/>
      ))
    }
    </div>
    </>
  )
}

export default UserDashboard