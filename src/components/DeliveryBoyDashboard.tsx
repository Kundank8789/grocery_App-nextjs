'use client'
import { getSocket } from '@/lib/socket'
import { IDeliveryAssignment } from '@/models/deliveryAssignment.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


function DeliveryBoyDashboard() {
    const [assignments,setAssignments]=useState<any[]>([])
    const {userData}=useSelector((state:RootState)=>state.user)
    const [activeOrder,setActiveOrder]=useState<any>(null)
    const [userLocation,setUserLocation]=useState<any>(null)
      const fetchAssignments=async()=>{
            try {
                const result=await axios.get('/api/delivery/get-assignments')
            setAssignments(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        
   
    useEffect(():any => {
        const socket=getSocket()
        socket.on("new-assignment",(deliveryAssignment)=>{
            setAssignments((prev)=>[deliveryAssignment,...prev])
        })
        return ()=>socket.off("new-assignment")
    },[])

    const handleAccept=async(id:string)=>{
        try {
            const result=await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCurrentOrders=async()=>{
        try {
            const result=await axios.get('/api/delivery/current-order')
            if(result.data.active){
                setActiveOrder(result.data.assignment)
                setUserLocation({
                    latitude:result.data.assignment.order.address.latitude,
                    longitude:result.data.assignment.order.address.longitude
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

     useEffect(() => {
        fetchCurrentOrders()
      fetchAssignments()
    }, [userData])

    if(activeOrder && userLocation){
        return(
            <div className='p-4 pt-[120px] min-h-screen bg-gray-50'>
                <div className='max-w-3xl mx-auto'>
                    <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
                    <p className='text-gray-600 text-sm mb-4'>order#{activeOrder.order._id.slice(-6)}</p>
                    <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>

                    </div>
                </div>
            </div>
        )
    }


  return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
        <div className='max-w-3xl mx-auto'>
            <h2 className='text-2xl font-bold mt-[120px] mb-[30px]'>Delivery Assignments</h2>
            {assignments.map(a=>(
                <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
                    <p><b>Order Id</b>#{a?.order._id.slice(-6)}</p>
                    <p className='text-gray-600'>{a.order.address.fullAddress}</p>
                    <div>
                        <button className='flex-1 bg-green-600 text-white py-2 rounded-lg' onClick={()=>handleAccept(a._id)}>Accept</button>
                        <button className='flex-1 bg-red-600 text-white py-2 rounded-lg'>Reject</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default DeliveryBoyDashboard