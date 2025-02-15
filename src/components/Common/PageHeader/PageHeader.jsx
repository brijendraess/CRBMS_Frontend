import { Box, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../Buttons/CustomButton";
import { useSelector } from "react-redux";

const PageHeader = ({
  heading,
  icon,
  func,
  children,
  title,
  nameOfTheClass,
  statusIcon,
  headingFontColor,
}) => {
  const { user } = useSelector((state) => state.user);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "50px",
        marginBottom: "10px",
      }}
      className="page-header"
    >
      <Typography
        variant="h1"
        component="h1"
        sx={{
          marginRight: "20px",
          fontSize: 'var(--heading-font-size)',
          fontWeight: 500,
          lineHeight: 1.5,
          color: headingFontColor ? headingFontColor : "#2E2E2E",
        }}
      >
        {heading || "Page Header"}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        {children}
        {func && statusIcon && (
          <CustomButton
            nameOfTheClass={nameOfTheClass}
            onClick={() => func(true)}
            title={"Add New " + heading}
            placement={"left"}
            Icon={icon}
            fontSize={"medium"}
            background={"var(--linear-gradient-main)"}
          />
        )}
      </Box>
      {/* )} */}
    </Box>
  );
};

export default PageHeader;
