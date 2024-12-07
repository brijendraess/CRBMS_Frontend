import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const DetailRoom = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      showLoading();
      const response = await axios.get(`/api/v1/rooms/:${id}`);
      setRoom(response.data.data.room);
      // console.log(response.data.data.rom);
      hideLoading();
    } catch (error) {
      setError("Failed to fetch room data.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("asda");
  }, [id]); // Add id to dependency array to refetch if it changes

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {room ? (
        <>
          <h2>{room.name}</h2>
          <img src={`/public/${room.roomImagePath}`} alt={room.name} />
          <p>Location: {room.location}</p>
          <p>Capacity: {room.capacity}</p>
          <p>Amenities: {room.amenities.join(", ")}</p>
          {/* Render other room details as needed */}
        </>
      ) : (
        <p>Loading room details...</p>
      )}
    </div>
  );
};

export default DetailRoom;
