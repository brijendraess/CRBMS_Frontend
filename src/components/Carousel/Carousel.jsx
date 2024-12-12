// Carousel.js
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';

const Carousel = () => {
  return (
    <div className="carousel-container">
      <Swiper
        spaceBetween={50} // Space between slides
        slidesPerView={1} // Number of slides visible at once
        navigation // Enable navigation arrows
        pagination={{ clickable: true }} // Enable pagination dots
        loop // Infinite loop of slides
      >
        <SwiperSlide>
          <img src="https://via.placeholder.com/600x400" alt="Slide 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://via.placeholder.com/600x400" alt="Slide 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://via.placeholder.com/600x400" alt="Slide 3" />
        </SwiperSlide>
        {/* Add more slides as needed */}
      </Swiper>
    </div>
  );
};

export default Carousel;
