import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper styles
import "swiper/css/pagination"; // Import pagination styles
import "swiper/css/effect-fade"; // Import fade effect styles
import { Autoplay, Pagination, EffectCards } from "swiper/modules";
import "./Carousel.css";

const Carousel = ({ roomImagesForCarousel }) => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty("--progress", 1 - progress);
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      loop={true}
      speed={1000} // Transition duration (in ms)
      autoplay={{
        delay: 3000, // Delay between slides
        disableOnInteraction: false,
      }}
      onAutoplayTimeLeft={onAutoplayTimeLeft}
      effect={"cards"}
      cardsEffect={{
        slideShadows: true, // Adds a shadow effect to cards
        perSlideRotate: 5, // Angle of rotation (reduce for smoothness)
        perSlideOffset: 20, // Offset between slides (reduce for smoothness)
      }}
      modules={[Autoplay, Pagination, EffectCards]}
      style={{
        width: "100%",
        height: "400px",
      }}
    >
      {roomImagesForCarousel.map((item, index) => (
        <SwiperSlide key={index}>
          <img
            src={
              item.imageName
                ? `${import.meta.env.VITE_API_URL}/room-gallery/${item.imageName}`
                : "https://via.placeholder.com/600x400"
            }
            alt={`Slide ${index + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </SwiperSlide>
      ))}
      {/* Progress Indicator */}
      <div className="autoplay-progress">
        <svg viewBox="0 0 48 48" ref={progressCircle}>
          <circle cx="24" cy="24" r="20"></circle>
        </svg>
        <span ref={progressContent}></span>
      </div>
    </Swiper>
  );
};

export default Carousel;
