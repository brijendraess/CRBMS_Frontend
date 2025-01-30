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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "../../components/Carousel/Carousel";
import {
  DesignServicesOutlinedIcon,
  GroupsIcon,
  LocationOnOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import { getMeetingTimePercentage, timeDifference } from "../../utils/utils";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import Loader from "../../components/Common/Loader/Loader";
import { PaperWrapper } from "../../Style";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import MeetingForm from "../MeetingPage/MeetingForm";

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

const theme = createTheme({
  palette: {
    progress: {
      color10: "#FF0000", // Red
      color20: "#FF3300",
      color30: "#FF6600",
      color40: "#FF9900",
      color50: "#FFCC00",
      color60: "#FFFF00",
      color70: "#CCFF00", // Yellow
      color80: "#99FF00",
      color90: "#66FF00",
      color100: "#33FF00", // Green
    },
  },
});

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
  const status = params.row.status;
  const meetingStartTime = `${params.row.meetingDate}T${params.row.startTime}Z`; // ISO 8601 format
  const meetingEndTime = `${params.row.meetingDate}T${params.row.endTime}Z`;
  const percentage = getMeetingTimePercentage(meetingStartTime, meetingEndTime);
  let progress = 0;

  if (status === "Completed") progress = percentage;
  else if (status === "start") progress = percentage;
  else if (status === "scheduled") progress = 0;

  const getCustomColor = (percentage) => {
    if (percentage >= 0 && percentage <= 10)
      return theme.palette.progress.color10;
    if (percentage >= 11 && percentage <= 20)
      return theme.palette.progress.color20;
    if (percentage >= 21 && percentage <= 30)
      return theme.palette.progress.color30;
    if (percentage >= 31 && percentage <= 40)
      return theme.palette.progress.color40;
    if (percentage >= 41 && percentage <= 50)
      return theme.palette.progress.color50;

    if (percentage >= 51 && percentage <= 60)
      return theme.palette.progress.color60;
    if (percentage >= 61 && percentage <= 70)
      return theme.palette.progress.color70;
    if (percentage >= 71 && percentage <= 80)
      return theme.palette.progress.color80;
    if (percentage >= 81 && percentage <= 90)
      return theme.palette.progress.color90;
    if (percentage >= 91 && percentage <= 100)
      return theme.palette.progress.color100;
  };

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
          sx={{
            height: 20, // Increased thickness
            borderRadius: 6, // Rounded edges
            "& .MuiLinearProgress-bar": {
              backgroundColor: getCustomColor(percentage),
            },
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

const DetailRoomPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [meeting, setMeeting] = useState([]);
  const [refreshPage, setRefreshPage] = useState("");
  const [isBookNowOpen, setIsBookNowOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const fetchData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/v1/rooms/${id}`);
      setRoom(response.data.data.room[0]);
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
        meetingDate: meeting.meetingDate,
        endTime: meeting.endTime, // 45 minutes duration
        duration: timeDiff,
        organizerName: meeting.User?.fullname,
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
  }, [id, refreshPage]);
  if (!room) {
    return <Loader />;
  }

  const handleBookNowClick = () => {
    setIsBookNowOpen(true);
  };
  console.log(room);
  return (
    <PaperWrapper sx={{ display: "flex", gap: "5px", flexDirection: "column" }}>
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
          gap: {
            xs: "20px",
            sm: "20px",
            md: "10px",
          },
          flexDirection: {
            xs: "column-reverse",
            sm: "column-reverse",
            md: "row",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            height: "80vh",
            width: {
              xs: "100%",
              sm: "100%",
              md: "40%",
            },
          }}
        >
          <Carousel
            height={"300px"}
            roomImagesForCarousel={room?.RoomGalleries}
          />
          <BoxWrapper style={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "50px",
                padding: "5px",
              }}
            >
              <Typography
                variant="body"
                fontWeight="500"
                fontSize="13px"
                gap={1}
                display={"flex"}
                alignItems={"center"}
                lineHeight={1}
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
                lineHeight={1}
              >
                <GroupsIcon fontSize="medium" />
                {room.capacity} people
              </Typography>
              <Typography
                variant="body"
                fontSize={"13px"}
                fontWeight={"500"}
                gap={1}
                display={"flex"}
                alignItems={"center"}
                lineHeight={1}
              >
                <DesignServicesOutlinedIcon fontSize="medium" />
                {room?.Service?.servicesName}
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
              <Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"16px"}
                  fontWeight="700"
                >
                  Amenities:
                </Typography>
                {room.RoomAmenityQuantities &&
                  room.RoomAmenityQuantities.map((amenity) => (
                    <Typography key={amenity.RoomAmenity.id} fontSize={"14px"}>
                      <b>|</b> {amenity.RoomAmenity.name} <b>|</b>
                    </Typography>
                  ))}
              </Wrapper>
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
                  Food Beverages:
                </Typography>
                {room.RoomFoodBeverages &&
                  room.RoomFoodBeverages.map((food) => (
                    <Typography key={food.FoodBeverage.id} fontSize={"14px"}>
                      <b>|</b> {food.FoodBeverage.foodBeverageName} <b>|</b>
                    </Typography>
                  ))}
              </Wrapper>
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
                <Box
                  sx={{ overflow: "scroll", width: "100%", height: "150px" }}
                >
                  <Typography fontSize={"14px"}>{room.description}</Typography>
                </Box>
              </Wrapper>
            </Box>
          </BoxWrapper>
          {!user?.UserType?.isAdmin === "admin" && (
            <Box>
              <Button onClick={handleBookNowClick} variant="contained">
                Book Now
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            height: "80vh",
            width: {
              xs: "100%",
              sm: "100%",
              md: "60%",
            },
          }}
        >
          <Box sx={{ width: "100%", height: "80vh" }}>
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
                  backgroundColor: `var(--linear-gradient-main)`,
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
      <PopupModals
        isOpen={isBookNowOpen}
        setIsOpen={setIsBookNowOpen}
        title={"Add New Meeting"}
        modalBody={<MeetingForm room={room} />}
      />
    </PaperWrapper>
  );
};

export default DetailRoomPage;
