"use client";
import { useRouter } from 'next/navigation';
import React from 'react'

const UnAuthorized = () => {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-300'>
      <h1 className='text-4xl font-bold text-red-500'>Access Denied</h1>
      <p className='text-lg text-gray-600'>You do not have permission to access this page</p>
      <button className='bg-red-500 text-white px-4 py-2 rounded-md mt-4' onClick={() => router.push("/")}>Go Back</button>
    </div>
  )
}

export default UnAuthorized;