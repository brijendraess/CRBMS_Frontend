import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { useState } from "react";
import { Box, Avatar, IconButton } from "@mui/material";
import { DeleteOutlineOutlined as DeleteIcon } from "@mui/icons-material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useSelector } from "react-redux";
import axios from "axios";

export default function RoomGallery({ room }) {
  console.log(room);
  const [files, setFiles] = useState([]);

  const { user } = useSelector((state) => state.user);
  console.log(user);
  const handleFileChange = (event) => {
    setFiles(event.target.files); // Store the selected files
    handleUpload();
  };

  const handleUpload = async () => {
    const formData = new FormData();
    // Append each file to the FormData object
    Array.from(files).forEach((file) => {
      formData.append("images", file);
      formData.append("roomId", room.id);
      formData.append("userId", user.id);
      formData.append("status", true);
    });

    const response = await axios.post(
      "api/v1/rooms/add-room-gallery",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Response:", response.data);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={2}
        mb={2}
        sx={{ backgroundColor: "#bdbdbd", width: "50%", margin: "auto" }}
        overflow={"hidden"}
      >
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="room-image-upload"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="room-image-upload">
          <IconButton component="span">
            <PhotoCameraIcon fontSize="medium" />
          </IconButton>
        </label>
      </Box>

      <ImageList
        sx={{
          width: 500,
          height: 400,
          marginTop: "10px",
          paddingRight: "20px", 
        }}
      >
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=248&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              // title={item.title}
              // subtitle={item.author}
              actionIcon={
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-label={`info about ${item.title}`}
                >
                  <DeleteIcon
                    color="error"
                    onClick={() => handleOpen(params.id)}
                    style={{ cursor: "pointer" }}
                  />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    author: "@bkristastucchio",
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    author: "@rollelflex_graphy726",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "@helloimnik",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    author: "@nolanissac",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "@hjrc33",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    author: "@tjdragotta",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "@katie_wasserman",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    author: "@silverdalex",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    author: "@shelleypauls",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    author: "@peterlaster",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    author: "@southside_customs",
    cols: 2,
  },
];
