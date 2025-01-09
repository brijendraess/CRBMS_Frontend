import { Box, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../CustomButton/CustomButton";
import { useSelector } from "react-redux";

const PageHeader = ({ heading, icon, func, children, title }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "50px",
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        sx={{
          marginRight: "20px",
          fontSize: {
            xs: "18px",
            sm: "20px",
            md: "22px",
            lg: "24px",
            xl: "26px",
          },
          fontWeight: 500,
          lineHeight: 1.5,
          color: "#2E2E2E",
        }}
      >
        {heading || "Page Header"}
      </Typography>

      {user?.isAdmin && (
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          {children}
          {func && (
            <CustomButton
              onClick={() => func(true)}
              title={title || "Add"}
              placement={"left"}
              Icon={icon}
              fontSize={"medium"}
              background={"rgba(3, 176, 48, 0.68)"}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
