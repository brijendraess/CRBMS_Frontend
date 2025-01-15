import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import default styles
import "./JoyrideCarousel.css";

// Import all images
import Trial from "../../assets/Trial.png";
import barcode from "../../assets/JoyrideCarousel/barcode.png";
import deleteButton from "../../assets/JoyrideCarousel/deleteButton.png";
import editButton from "../../assets/JoyrideCarousel/editButton.png";
import fullscreen from "../../assets/JoyrideCarousel/fullscreen.png";
import hamburger from "../../assets/JoyrideCarousel/hamburger.png";
import hide from "../../assets/JoyrideCarousel/hide.png";
import members from "../../assets/JoyrideCarousel/members.png";
import myAccount from "../../assets/JoyrideCarousel/myAccount.png";
import newUser from "../../assets/JoyrideCarousel/newUser.png";
import notification from "../../assets/JoyrideCarousel/notification.png";
import roomAmenities from "../../assets/JoyrideCarousel/roomAmenities.png";
import roomDelete from "../../assets/JoyrideCarousel/roomDelete.png";
import roomEdit from "../../assets/JoyrideCarousel/roomEdit.png";
import roomFilter from "../../assets/JoyrideCarousel/roomFilter.png";
import roomFood from "../../assets/JoyrideCarousel/roomFood.png";
import roomGallery from "../../assets/JoyrideCarousel/roomGallery.png";
import roomView from "../../assets/JoyrideCarousel/roomView.png";
import sanitation from "../../assets/JoyrideCarousel/sanitation.png";
import switchButton from "../../assets/JoyrideCarousel/switchButton.png";
import viewButton from "../../assets/JoyrideCarousel/viewButton.png";

const JoyrideResponsiveCarousel = () => {
  // Create an array of images and their descriptions
  const slides = [
    { src: hamburger, legend: "🍔 Hamburger Menu" },
    { src: notification, legend: "🔔 Notifications" },
    { src: fullscreen, legend: "🖥️ Fullscreen Button" },
    { src: myAccount, legend: "👤 My Account" },
    { src: newUser, legend: "➕ Add New User" },
    { src: hide, legend: "🙈 Hide Users" },
    { src: editButton, legend: "✏️ Edit Button" },
    { src: viewButton, legend: "🔍 View Button" },
    { src: deleteButton, legend: "🗑️ Delete Button" },
    { src: switchButton, legend: "🔄 Toggle Switch" },
    { src: members, legend: "👥 Committee Members" },
    { src: roomFilter, legend: "🔍 Room Filter" },
    { src: sanitation, legend: "🧼 Sanitation Toggle" },
    { src: roomView, legend: "👀 View Room Details" },
    { src: roomGallery, legend: "🖼️ Room Gallery" },
    { src: roomAmenities, legend: "🛠️ Room Amenities" },
    { src: roomFood, legend: "🍴 Room Food Options" },
    { src: barcode, legend: "📷 Barcode" },
    { src: roomEdit, legend: "✏️ Edit Room" },
    { src: roomDelete, legend: "🗑️ Delete Room" },
  ];

  return (
    <div style={{ width: "100%", margin: "0 auto", height: "100%" }}>
      <Carousel
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={3000}
        transitionTime={0}
        emulateTouch
        showArrows
        showIndicators={false}
      >
        {slides.map((slide, index) => (
          <div key={index}>
            <img
              src={slide.src}
              alt={`Slide ${index + 1}`}
              style={{
                borderRadius: "",
              }}
            />

            <p className="legend">{slide.legend}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default JoyrideResponsiveCarousel;
