import { Suspense, useEffect, useRef, useState } from 'react';
import { redirect, useLoaderData } from "react-router-dom";
import { fetchProfile } from "./api";
import ImageComponent from "./ImageComponent";

import SwiperClass from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// Interface definitions
interface User {
    avatar: string;
    buyer_id: string;
    email: string;
    name: string;
    phone: string;
    roles: string[];

}

interface Data {
    user: User | null;
    token: string | null;
    data : object[];
    // Add other fields as necessary
}

// Loader function
export const DashboardLoader = async () => {
    const userString = localStorage.getItem("user");
    const user: Data | null = userString ? (JSON.parse(userString) as Data) : null;
    console.log({ user });

    if (user) {
        const response = await fetchProfile();
        console.log({ response });
        return response;
    } else {
        throw redirect("/");
    }
};

// Dashboard component
export const Dashboard = () => {
    const state = useLoaderData() as Data;
    const [user, setUser] = useState<User | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(1);

    const paginationList = state.data.length - slidesPerView + 1;

    useEffect(() => {
        const userString = localStorage.getItem("user");
        const user: Data | null = userString ? (JSON.parse(userString) as Data) : null;

        if (user?.user) {
            setUser(user.user);
        }

        const updateSlidesPerView = () => {
            if (window.matchMedia("(min-width: 1280px)").matches) {
                setSlidesPerView(3);
            } else if (window.matchMedia("(min-width: 768px)").matches) {
                setSlidesPerView(2);
            } else {
                setSlidesPerView(1);
            }
        };

        updateSlidesPerView();

        window.addEventListener('resize', updateSlidesPerView);

        return () => window.removeEventListener('resize', updateSlidesPerView);
    }, []);

    console.log({ state });
    console.log({ user });

    const swiperRef = useRef< SwiperClass | null>(null);

    const gotoSlide = (index: number) => {
        swiperRef.current?.slideTo(index);
    };

    const nextSlide = () => {
        swiperRef.current?.slideTo(activeIndex + 1);
    };

    const prevSlide = () => {
        swiperRef.current?.slideTo(activeIndex - 1);
    };

    const swiperNavStyle = "text-blue-500 text-5xl animate-pulse md:text-7xl cursor-pointer";
    console.log({activeIndex})
    return (
        <div className="w-screen h-screen p-16">
            <h1>SVG Sprite Sheet Example</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

                {user && (
                    <div className="flex flex-col items-center mb-6 *:p-2">
                        <img className="w-28 h-28 rounded-full" src={user.avatar} alt={`${user.name}'s avatar`} />
                        <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-600">Buyer ID: {user.buyer_id}</p>
                        <p className="text-gray-600">Phone: {user.phone}</p>
                        <p className="text-gray-600">Roles: {user.roles.join(', ')}</p>
                    </div>
                )}
                <div className="relative w-full">
                <Swiper
                    ref={swiperRef}
                    spaceBetween={30}
                    slidesPerView={slidesPerView}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    className='py-4 px-2'
                >
                    {state.data.map((item: User, index: number) => (
                        <SwiperSlide key={item.buyer_id || index}>
                            <ImageComponent key={index} id={item.avatar} alt="Red Circle" />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {activeIndex > 0 && (
                    <div onClick={prevSlide} className='absolute top-1/2 lg:top-1/2 translate-y-1/4 md:-translate-y-[92px] z-50 opacity-100 -left-8 md:-left-16'>
                        <FaAngleLeft className={swiperNavStyle} />
                    </div>
                )}

                {activeIndex < paginationList - 1 && (
                    <div onClick={nextSlide} className='absolute ttop-1/2 lg:top-1/2 translate-y-1/4 md:-translate-y-[92px] z-50 opacity-100 -right-8 md:-right-16 '>
                        <FaAngleRight className={swiperNavStyle} />
                    </div>
                )}

                <div className="flex items-center gap-2 p-10 md:gap-4 justify-center">
                    {Array.from({ length: paginationList }, (_, index) => (
                        <div
                            key={index}
                            onClick={() => gotoSlide(index)}
                            className={`w-3 h-3 cursor-pointer rounded-xl transition-all ${index === activeIndex ? "bg-[#1B40B3] w-[40px]" : "bg-[#D9D9D9]"}`}
                        />
                    ))}
                </div>
                </div>
            </Suspense>
        </div>
    );
};
