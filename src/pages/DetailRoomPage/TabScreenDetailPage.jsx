import React, { useEffect, useState } from "react";
import "./DetailRoomPage.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  styled,
  LinearProgress,
  Typography,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "../../components/Carousel/Carousel";
import { GroupsIcon, LocationOnOutlinedIcon } from "../../components/Common/Buttons/CustomIcon";
import { timeDifference } from "../../utils/utils";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import Loader from "../../components/Common/Loader/Loader";
import { PaperWrapper } from "../../Style";

const BoxWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  height: "50%",
  lineHeight: "60px",
  padding: "0 10px 0 10px",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    height: "100%",
  },
}));

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "start",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  overflowY: "auto",
  overflowX: "hidden",
  height: "100%",
  textAlign: "left",
  alignItems: "center",
}));

const columns = [
  {
    field: "subject",
    headerName: "Subject",
    width: 250,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "startTime",
    headerName: "Start Time",
    width: 100,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "endTime",
    headerName: "End Time",
    width: 100,
    headerClassName: "super-app-theme--header",
  },

  {
    field: "organizerName",
    headerName: "Organizer",
    width: 200,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "status",
    headerName: "Status",
    width: 206,
    renderCell: (params) => renderProgressBar(params),
    headerClassName: "super-app-theme--header",
  },
];

const renderProgressBar = (params) => {
  const status = params.value;
  let progress = 0;

  if (status === "Completed") progress = 100;
  else if (status === "In Progress") progress = 33;
  else if (status === "scheduled") progress = 0;

  let color = "success";
  if (progress >= 33 && progress <= 66) color = "info";
  if (progress > 66) color = "error";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Center the progress bar horizontally
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative", // Needed for placing text inside the bar
          width: "90%", // Occupies 90% of the cell width
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          color={color}
          sx={{
            height: 20, // Increased thickness
            borderRadius: 6, // Rounded edges
          }}
        />
        <Typography
          sx={{
            position: "absolute", // Position the text inside the bar
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center the text within the bar
            color: "white", // Ensure text is visible
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          {`${progress}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const TabScreenDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [meeting, setMeeting] = useState([]);
  const [refreshPage, setRefreshPage] = useState("");
  const [urlData, setUrlData] = React.useState("Not Found");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const fetchData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/v1/rooms/${id}`);
      setRoom(response.data.data.room[0]);
      console.log(response.data.data.room[0]);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
    }
  };

  const getAllMeeting = () => {
    const meeting = room?.Meetings.map((meeting) => {
      const timeDiff = timeDifference(meeting?.startTime, meeting?.endTime);

      return {
        id: meeting.id,
        subject: meeting.subject,
        agenda: meeting.agenda,
        private: meeting.isPrivate,
        notes: meeting.notes,
        startTime: meeting.startTime,
        endTime: meeting.endTime, // 45 minutes duration
        duration: timeDiff,
        organizerName: meeting.User.fullname,
        status: meeting.status,
      };
    });
    setMeeting(meeting);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  setTimeout(() => {
    setRefreshPage(Math.random());
  }, 10000);

  useEffect(() => {
    getAllMeeting();
    setUrlData(`${import.meta.env.VITE_APPLICATION_URL}/rooms/${room?.id}`);
  }, [id, room]);
  if (!room) {
    return <Loader />;
  }

  return (
    <PaperWrapper
      sx={{
        display: "flex",
        gap: "5px",
        flexDirection: "column",
        height: "100vh",
        marginTop: "0",
      }}
    >
      <Typography
        variant="h5"
        component="h5"
        textAlign="center"
        fontWeight={"500"}
      >
        {room.name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "5px",
          flexDirection: {
            xs: "column-reverse",
            sm: "column-reverse",
            md: "row",
          },
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            height: "100%",
            width: {
              xs: "100%",
              sm: "100%",
              md: "40%",
            },
          }}
        >
          <Box style={{ width: "100%", height: "50%" }}>
            <Carousel
              height={"50vh"}
              roomImagesForCarousel={room?.RoomGalleries}
            />
          </Box>
          <BoxWrapper style={{ width: "100%", height: "50%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body"
                fontWeight="500"
                fontSize="13px"
                gap={1}
                display={"flex"}
                alignItems={"center"}
              >
                <LocationOnOutlinedIcon fontSize="medium" />
                {room?.Location?.locationName}
              </Typography>

              <Typography
                variant="body"
                fontSize={"13px"}
                fontWeight={"500"}
                gap={1}
                display={"flex"}
                alignItems={"center"}
              >
                <GroupsIcon fontSize="medium" />
                {room.capacity} people
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
              }}
            >
              {room.RoomAmenityQuantities?.filter((item)=>item.status===true)?.length>0 &&<Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"16px"}
                  fontWeight="700"
                >
                  Amenities:
                </Typography>
                {room.RoomAmenityQuantities &&
                  room.RoomAmenityQuantities?.filter((item)=>item.status===true)?.map((amenity) => (
                    <Typography key={amenity.RoomAmenity.id} fontSize={"14px"}>
                      <b>|</b> {amenity.RoomAmenity.name} <b>|</b>
                    </Typography>
                  ))}
              </Wrapper>}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
              }}
            >
              {room?.RoomFoodBeverages?.filter((item)=>item.status===true)?.length>0 &&<Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"16px"}
                  fontWeight="700"
                >
                  Food Beverages:
                </Typography>
                {room.RoomFoodBeverages &&
                  room.RoomFoodBeverages?.filter((item)=>item.status===true)?.map((food) => (
                    <Typography key={food.FoodBeverage.id} fontSize={"14px"}>
                      <b>|</b> {food.FoodBeverage.foodBeverageName} <b>|</b>
                    </Typography>
                  ))}
              </Wrapper>}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
              }}
            >
              <Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"16px"}
                  fontWeight="700"
                >
                  Description:
                </Typography>
                <Typography fontSize={"14px"}>{room.description}</Typography>
              </Wrapper>
            </Box>
          </BoxWrapper>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            height: "92vh",
            width: "60%",
          }}
        >
          <Box sx={{ width: "100%", height: "92vh" }}>
            <DataGrid
              rows={meeting}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[]}
              sx={{
                "& .MuiDataGrid-footerContainer": {
                  display: "none",
                },
                // Header styles
                "& .super-app-theme--header": {
                  backgroundColor: "#0043ff75",
                  color: "#fff",
                  fontWeight: "bold",
                },

                // Row styles
                "& .MuiDataGrid-row": {
                  "&:nth-of-type(odd)": {
                    backgroundColor: "rgba(93, 220, 205, 0.05)",
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: "#fff",
                  },
                  color: "#333",
                  fontSize: "14px",
                },

                // Hover effect for rows
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#e0f7fa",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </PaperWrapper>
  );
};

export default TabScreenDetailPage;
