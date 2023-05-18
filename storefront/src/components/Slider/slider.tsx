import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Slider1 from '../../assets/slider/slide-01.jpg'
import Slider2 from '../../assets/slider/slide-02.jpg'
import Slider3 from '../../assets/slider/slide-03.jpg'
import Slider4 from '../../assets/slider/slide-04.jpg'

import "./slider.scss";
import { Link } from "react-router-dom";

const PaginationImage = () => {
  return (
    <div>adsasdasd</div>
  )
}

const Slider = () => {
  const dataSlider = [
    { id: '1', src: Slider1 },
    { id: '2', src: Slider2 },
    { id: '3', src: Slider3 },
    { id: '4', src: Slider4 },
  ]

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay]}
        autoplay
        effect="fade"
        spaceBetween={50}
        slidesPerView={1}
        navigation
        // pagination={{
        //   clickable: true,
        //   renderBullet: (index, className) => {
        //     console.log('index', index)
        //     // return '<span class="' + className + '">' + (index + 1) + '</span>';
        //     return `<div style="width: 100px; border: 1px solid;" class=${className}>
        //       <img src=${Slider1} alt/>
        //       </div>
        //       `
        //   }
        // }}
      // onSlideChange={() => console.log('slide change')}
      // onSwiper={(swiper) => console.log(swiper)}
      >
        {
          dataSlider && dataSlider.map((item, index) => {
            return (
              <SwiperSlide className="relative" key={index}>
                <img src={item.src} alt="" />
                <div className="flex flex-col absolute top-1/2 z-20 left-[10%] translate-y-[-50%]">
                  <p className="text-xs lg:text-lg">Women Collection 2018</p>
                  <p className="lg:text-6xl md:text-5xl lg:py-7 md:py-5 text-2xl py-2">New Season</p>
                  <Link to="/" className="text-white lg:max-w-[180px] max-w-[100px] lg:text-lg text-xs justify-center items-center text-center bg-primary lg:px-6 lg:py-3 py-2 rounded-3xl">Shop Now</Link>
                </div>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
    </>
  );
};

export default Slider;