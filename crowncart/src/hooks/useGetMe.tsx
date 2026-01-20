"use client"

import { AppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/userslice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function useGetMe() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        const getMe = async () => {
        try{
            const res = await axios.get("/api/me")
            // console.log(res.data)
            dispatch(setUserData(res.data.user))
        }
        catch(err){
            console.log(err)
        }
    }
        getMe();
    },[])
}

export default useGetMe