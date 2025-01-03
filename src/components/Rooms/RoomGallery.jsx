import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { Button, Grid2, Typography, Paper } from "@mui/material";
import { useEffect } from "react";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import DeleteModal from "../Common/Modals/Delete/DeleteModal";
import { useDropzone } from "react-dropzone";
import { DeleteOutlineOutlinedIcon } from "../Common/CustomButton/CustomIcon";

export default function RoomGallery({ room }) {
  const [files, setFiles] = useState([]);
  const [roomGallery, setRoomGallery] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchRoomsGalleryData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `api/v1/rooms/single-room-gallery/${room?.id}`
      );
      setRoomGallery(response.data.data?.roomGallery);
      dispatch(hideLoading());
    } catch (error) {
      toast.error("Something Went Wrong");
      console.error("Error fetching room data:", error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    fetchRoomsGalleryData();
  }, [refreshPage]);

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  const handleDeleteGallery = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `/api/v1/rooms/delete-room-gallery/${deleteId}`
      );
      if (response.status === 200) {
        toast.success("Room deleted successfully");
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      dispatch(hideLoading());
      setRefreshPage(Math.random());
      handleDeleteClose();
    }
  };

  const handleDeleteClick = (id) => {
    setIsDeleteOpen(true);
    setDeleteId(id);
  };

  const onDrop = (acceptedFiles) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);

    const newPreviews = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setPreviewUrls((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
      formData.append("roomId", room.id);
      formData.append("userId", user.id);
      formData.append("status", true);
    }

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "api/v1/rooms/add-room-gallery",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(response.data.message);
      setRefreshPage(Math.random());
      setPreviewUrls([]);
      dispatch(hideLoading());
    } catch (error) {
      console.error("Upload error:", error);
      dispatch(hideLoading());
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Paper
          {...getRootProps()}
          sx={{
            border: "2px dashed #ccc",
            padding: 2,
            textAlign: "center",
            cursor: "pointer",
            marginBottom: 2,
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the files here...</Typography>
          ) : (
            <Typography>Drag & drop images here, or click to select</Typography>
          )}
        </Paper>

        <Grid2 container spacing={2}>
          {previewUrls.map((file, index) => (
            <Grid2 item key={index} xs={4} sm={3} md={2}>
              <Box
                component="img"
                src={file.preview}
                alt="Preview"
                sx={{
                  width: "100%",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Grid2>
          ))}
        </Grid2>

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ marginTop: 2 }}
          disabled={images.length === 0}
        >
          Upload Images
        </Button>
      </Box>

      <ImageList
        sx={{
          // width: {
          //   xs: 300,
          //   sm: 400,
          //   md: 500,
          //   lg: 500,
          //   xl: 500,
          // },
          height: 200,
          marginTop: "10px",
          paddingRight: "10px",
        }}
      >
        {roomGallery.map((item) => (
          <ImageListItem key={item.imageName}>
            <img
              srcSet={`${import.meta.env.VITE_API_URL}/room-gallery/${item.imageName}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${import.meta.env.VITE_API_URL}/room-gallery/${item.imageName}?w=248&fit=crop&auto=format`}
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
                  <DeleteOutlineOutlinedIcon
                    color="error"
                    onClick={() => handleDeleteClick(item.id)}
                    style={{ cursor: "pointer" }}
                  />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
      <DeleteModal
        open={isDeleteOpen}
        onClose={handleDeleteClose}
        onDeleteConfirm={handleDeleteGallery}
        button={"Delete"}
        title="Gallery Image"
      />
    </>
  );
}
