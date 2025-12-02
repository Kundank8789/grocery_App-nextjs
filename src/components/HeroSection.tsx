'use client'
import { Leaf, Smartphone, Truck } from 'lucide-react'
import { AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react';
import Image from 'next/image';

function HeroSection() {
    const slides=[
        {
            id:1,
            icon: <Leaf className='w-20 h-20 sm:w-28 sm:h-28 text-green-400  drop-shadow-lg'/>,
            title: "Fresh and Healthy Groceries Delivered to Your Doorstep 🥦",
            subtitle: "Shop with Confidence and Enjoy a Fresh and Healthy Grocery Experience",
            btnText: "Shop Now",
            bg:"https://images.unsplash.com/photo-1590671911659-3ce95e8b91c5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id:2,
            icon: <Truck className='w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg'/>,
            title: "Fast and Reliable Delivery to Your Doorstep 🚚",
            subtitle: "Experience Fast and Reliable Delivery to Your Doorstep",
            btnText: "Order Now",
            bg:"https://images.unsplash.com/photo-1727890193720-c1f19c60e966?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%22"
        },
        {
            id:3,
            icon: <Smartphone className='w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg'/>,
            title: "Convenience at Your Fingertips 📱",
            subtitle: "Shop with Ease and Convenience at Your Fingertips",
            btnText: "Shop Now",
            bg:"https://plus.unsplash.com/premium_photo-1670354067826-8418f6010572?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
    ]
    const [currentSlide, setCurrentSlide]=useState(0);
useEffect(() => {
    const timer=setInterval(()=>{
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    },4000)
    return ()=>clearInterval(timer);
},[])
    

  return (
    <div className='relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl'>
        <AnimatePresence mode='wait'>
             <motion.div 
             key={currentSlide}
             initial={{opacity:0}}
             animate={{opacity:1}}
             transition={{duration:0.8}}
             exit={{opacity:0}}
             className='absolute inset-0'
             >

                <Image
                src={slides[currentSlide]?.bg}
                fill
                alt='slide'
                priority
                className='object-cover'
                />
                <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'/>

             </motion.div>
            </AnimatePresence>

            <div className='absolute inset-0 flex items-center justify-center text-center text-white px-6'>
                <motion.div
                initial={{y:30, opacity:0}}
                animate={{y:0,opacity:1}}
                transition={{duration:0.6}}
                exit={{opacity:0}}
                className='flex flex-col items-center justify-center gap-6 max-w-3xl'
                >
                    <div className='bg-white/10 backdrop-blur-md p-6 rounded-full  shadow-lg'>{slides[currentSlide].icon}</div>
                </motion.div>

            </div>
    </div>
  )
}

export default HeroSection