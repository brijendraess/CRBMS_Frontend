import React, { useState } from "react";
import { AccountCircleRoundedIcon } from "../Buttons/CustomIcon";
import { Tooltip } from "@mui/material";

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

  return (
    <>
      <Tooltip
        placement="right"
        title={
          <img
            src={imageUrl}
            alt="Large preview"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        }
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              padding: 0,
              borderRadius: "8px",
            },
          },
        }}
      >
        {imageExists === null && <p>Checking image...</p>}
        {imageExists && (
          <img
            src={imageUrl}
            alt="avatar"
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          />
        )}
        {imageExists === false && (
          <AccountCircleRoundedIcon
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          />
        )}
      </Tooltip>
    </>
  );
};

export default CheckAndShowImage;
