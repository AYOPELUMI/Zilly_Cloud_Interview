import { Suspense, useEffect, useRef, useState } from 'react';
import { redirect, useLoaderData } from "react-router-dom";
import { fetchProfile } from "./api";
import ImageComponent from "./ImageComponent";

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';


import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";


interface User{
    avatar: string,
    buyer_id: string,
    email : string,
    name: string,
    phone: string
}
interface data {
    user: User | null;
    token: string | null;
    // Add other fields as necessary
  }
export const DashboardLoader =async () =>{
    const userString = localStorage.getItem("user");

const user: data | null = userString ? (JSON.parse(userString) as data) : null;
    console.log({user})
  
    if(user){
      const response = await fetchProfile()
  
      console.log({response})
      return response
    } 
    else{
        throw redirect("/");
    }
}


export const Dashboard = () => {
    const  state  = useLoaderData();
    const [user, setUser] = useState<data>({})
    const [activeIndex, setActiveIndex] = useState(0)
    const [slidesPerView, setSlidesPerView] = useState(1)

    const paginationList = state.data.length - slidesPerView + 1

    useEffect(() =>{
        const userString = localStorage.getItem("user");

        const user: data | null = userString ? (JSON.parse(userString) as data) : null;
            console.log({user})
          
        if(user?.user){
    setUser(user.user)
        }

        const updateSlidesPerView = () => {
            if (window.matchMedia("(min-width: 1280px)").matches) {
                setSlidesPerView(3)
            } else if (window.matchMedia("(min-width: 768px)").matches) {
                setSlidesPerView(2)
            } else {
                setSlidesPerView(1)
            }
        }

        updateSlidesPerView()

        window.addEventListener('resize', updateSlidesPerView())

        return () => window.removeEventListener('resize', updateSlidesPerView)

    },[])


    console.log({state})
    console.log({user})

    const swiperRef = useRef()

    const gotoSlide = (index) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index)
        }
    }

    const nextSlide = (index) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index + 1)
        }
    }
    const prevSlide = (index) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index - 1)
        }
    }

    const swiperNavStyle = "text-blue-500 text-5xl  animate-pulse md:text-7xl cursor-pointer"

    return (
        <div className="w-screen h-screen">
        <h1>SVG Sprite Sheet Example</h1>
        <Suspense fallback={<div>Loading...</div>}>

        <div>
            <img className="w-28 h-28 rounded-full " src={user.avatar} />
        </div>
          <Swiper
                ref={swiperRef}
                spaceBetween={30}
                slidesPerView={slidesPerView}
                onSlideChange={(swiper) => { setActiveIndex(swiper.activeIndex) }}
                onSwiper={(swiper) => swiperRef.current = swiper}
                className='py-4 px-2 '
            >          

                {
                    state.data.map((item, index) =>(
                        <SwiperSlide key={index}>
                            <ImageComponent key={index} id={item.avatar} alt="Red Circle" />
                        </SwiperSlide> ))
                }
              </Swiper>


            {
                activeIndex > 0 && <div onClick={() => { prevSlide(activeIndex) }} className='absolute top-1/2 z-50 opacity-30 -left-4  md:-left-16'>
                    <FaAngleLeft className={swiperNavStyle} />
                </div>
            }

            {
                (activeIndex < paginationList - 1) && <div onClick={() => { nextSlide(activeIndex) }} className='absolute top-1/2 z-50  opacity-30 -right-4 md:-right-10 lg:-right-16'>
                    <FaAngleRight className={swiperNavStyle} />
                </div>
            }
                        <div className="flex  items-center  gap-2 p-10 md:gap-4 justify-center">
                {
                    Array.from({ length: paginationList }, (_, index) => (
                        <div onClick={() => { gotoSlide(index) }} key={index} className={`w-3 cursor-pointer inline-block transition-[10s_ease-in-out] h-3 rounded-xl  ${index === activeIndex ? "bg-[#1B40B3] w-[40px]" : "bg-[#D9D9D9]"}`}></div>
                    ))
                }

            </div>

        </Suspense>
      </div>
    )
}

