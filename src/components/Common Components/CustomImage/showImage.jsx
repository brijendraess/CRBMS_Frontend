import React, { useState } from "react";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";


const CheckAndShowImage = ({ imageUrl }) => {
  const [imageExists, setImageExists] = useState(null); // null: not checked, true: exists, false: doesn't exist

  const checkImage = (url) => {
    const img = new Image();
    img.src = url;
    img.onload = () => setImageExists(true); // If the image loads successfully
    img.onerror = () => setImageExists(false); // If the image fails to load
  };

  // Check the image when the component mounts or imageUrl changes
  React.useEffect(() => {
    if (imageUrl) {
      checkImage(imageUrl);
    }
  }, [imageUrl]);
  console.log(imageExists)

  return (
    <>
      {imageExists === null && <p>Checking image...</p>}
      {imageExists && <img
              src={`${import.meta.env.VITE_API_URL}/${imageUrl}`}
              alt="avatar"
              style={{ width: "35px", height: "35px", borderRadius: "50%" }}
            />}
      {imageExists === false && <AccountCircleRoundedIcon
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          />}
    </>
  );
};

export default CheckAndShowImage;
