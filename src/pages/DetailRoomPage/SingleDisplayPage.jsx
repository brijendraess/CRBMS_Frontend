import {
  Box,
  LinearProgress,
  Paper,
  styled,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import flag2 from "../../assets/kenyaFlag.jpg";
import flag from "../../assets/flag.png";
import Carousel from "../../components/Carousel/Carousel";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import Loader from "../../components/Common/Loader/Loader";
import {
  GroupsIcon,
  LocationOnOutlinedIcon,
  FullscreenExitOutlinedIcon,
  FullscreenOutlined,
  DesignServicesOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import { getMeetingTimePercentage, timeDifference } from "../../utils/utils";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { createTheme } from "@mui/material/styles";

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
    width: 200,
    flex: 1,
    headerClassName: "super-app-theme--header",
    renderCell: (params) => (
      <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
        {params.value}
      </div>
    ),
  },
  {
    field: "startTime",
    headerName: "Start",
    width: 90,
    headerClassName: "super-app-theme--header",

  },
  {
    field: "endTime",
    headerName: "End",
    width: 90,
    headerClassName: "super-app-theme--header",
  },

  {
    field: "organizerName",
    headerName: "Organizer",
    width: 150,
    headerClassName: "super-app-theme--header",
    renderCell: (params) => (
      <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
        {params.value}
      </div>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
    renderCell: (params) => calculateTimeDifference(params),
    headerClassName: "super-app-theme--header",
  },
];

const calculateTimeDifference = (params) => {
  const meeting = params.row;
  if (meeting.status === "cancelled" || meeting.status === "completed") {
    return <>
      <b>{meeting.status}</b>
    </>
  }

  const now = new Date();

  // Function to convert AM/PM time to 24-hour format
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };

  const startTime24 = convertTo24HourFormat(meeting.startTime);
  const endTime24 = convertTo24HourFormat(meeting.endTime);

  const startDateTime = new Date(`${meeting.meetingDate}T${startTime24}`);
  const endDateTime = new Date(`${meeting.meetingDate}T${endTime24}`);

  const formatTime = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours} hr ${remainingMinutes} min`
        : `${hours} hr`;
    }
    return `${minutes} min`;
  };

  if (now < startDateTime) {
    const minutesUntilStart = Math.round((startDateTime - now) / (1000 * 60));
    return `Starts in ${formatTime(minutesUntilStart)}.`;
  } else if (now >= startDateTime && now <= endDateTime) {
    const minutesRemaining = Math.round((endDateTime - now) / (1000 * 60));
    return `Meeting ongoing, ${formatTime(minutesRemaining)} remaining.`;
  } else {
    return "Meeting approval time expired";
  }
}
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  lineHeight: "60px",
  background: "rgba(251, 251, 251, 0)",
  backdropFilter: "blur(2px)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.33)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "4px",
  overflow: "hidden",
  color: "#fff",
}));

const SingleDisplayPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [meeting, setMeeting] = useState([]);
  const [refreshPage, setRefreshPage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    const elem = document.documentElement;

    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
    setIsFullScreen(!isFullScreen); // Toggle State
  };
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

  const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const getAllMeeting = () => {
    const todayDate = new Date().toISOString().split('T')[0];

    const meeting = room?.Meetings?.filter((meeting) => meeting.meetingDate === todayDate && meeting.status === "scheduled").map((meeting) => {
      const timeDiff = timeDifference(meeting?.startTime, meeting?.endTime);
      return {
        id: meeting.id,
        subject: meeting.subject,
        agenda: meeting.agenda,
        private: meeting.isPrivate,
        notes: meeting.notes,
        startTime: formatTimeTo12Hour(meeting.startTime),  // Convert time here
        meetingDate: meeting.meetingDate,
        endTime: formatTimeTo12Hour(meeting.endTime),  // Convert time here
        duration: timeDiff,
        organizerName: meeting.User?.fullname,
        status: meeting.status,
      };
    });

    setMeeting(meeting);
    console.log(meeting)
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  setTimeout(() => {
    setRefreshPage(Math.random());
  }, 10000);

  useEffect(() => {
    getAllMeeting();
  }, [id, room, refreshPage]);
  if (!room) {
    return <Loader />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        flexDirection: "column",
        backgroundImage: `
        linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
        url(${flag2})
      `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "10px",
        gap: "10px",
        borderBottom: "10px solid transparent",
        borderTop: "10px solid transparent",
        borderImage:
          "linear-gradient(to right, #006400, #ffffff, #ff0000, rgb(158, 24, 24)) 1",
      }}
    >
      <Item
        style={{
          display: "flex",
          height: "8vh",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        elevation={24}
      >
        <Box
          width="75px"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={flag}
            alt=""
            style={{
              width: "75px",
              height: "50px",
            }}
          />
        </Box>
        <Typography
          variant="h4"
          component="h4"
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            backgroundClip: "text",
            display: "inline-block",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transform: "scale(0.8)",
            transformOrigin: "center",
            color: "transparent",
            backgroundImage:
              "linear-gradient(to right, #006400, #ffffff, #ff0000,rgb(158, 24, 24))",
            WebkitBackgroundClip: "text",
            // textShadow: `
            //   2px 2px 0 green,
            //   4px 4px 0 rgba(191, 191, 191, 0.5),
            //   6px 6px 0 rgba(88, 88, 88, 0.3)
            // `,
          }}
        >
          {room.name}
        </Typography>

        <Button style={{ color: "white" }} onClick={handleFullScreen}>
          <Tooltip title="Full Screen">
            {isFullScreen ? (
              <FullscreenExitOutlinedIcon />
            ) : (
              <FullscreenOutlined />
            )}
          </Tooltip>
        </Button>
      </Item>
      <Box
        style={{
          display: "flex",
          height: "92vh",
          width: "100%",
          gap: "10px",
        }}
      >
        <Box
          style={{
            width: "40%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Item style={{ width: "100%", height: "50%" }}>
            <Carousel roomImagesForCarousel={room?.RoomGalleries} />
          </Item>
          <Item style={{ width: "100%", height: "50%", padding: "10px" }}>
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
                fontSize="14px"
                gap={1}
                display={"flex"}
                alignItems={"center"}
              >
                <LocationOnOutlinedIcon fontSize="medium" />
                {room?.Location?.locationName}
              </Typography>

              <Typography
                variant="body"
                fontSize={"14px"}
                fontWeight={"500"}
                gap={1}
                display={"flex"}
                alignItems={"center"}
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
              {room.RoomAmenityQuantities?.filter((item) => item.status === true)?.length > 0 && <Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"17px"}
                  fontWeight="700"
                >
                  Amenities:
                </Typography>
                {room.RoomAmenityQuantities &&
                  room.RoomAmenityQuantities?.filter((item) => item.status === true)?.map((amenity) => (
                    <Typography key={amenity.RoomAmenity.id} fontSize={"15px"}>
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
              {room?.RoomFoodBeverages?.filter((item) => item.status === true)?.length > 0 && <Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"17px"}
                  fontWeight="700"
                >
                  Food Beverages:
                </Typography>
                {room.RoomFoodBeverages &&
                  room.RoomFoodBeverages?.filter((item) => item.status === true)?.map((food) => (
                    <Typography key={food.FoodBeverage.id} fontSize={"15px"}>
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
                  fontSize={"17px"}
                  fontWeight="700"
                >
                  Description:
                </Typography>
                <Typography fontSize={"15px"}>{room.description}</Typography>
              </Wrapper>
            </Box>
          </Item>
        </Box>
        <Item
          style={{
            width: "60%",
            height: "100%",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={meeting}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[]}
              rowHeight={80}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.26)",
                backdropFilter: "blur(5px)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",

                "& .MuiDataGrid-cell": {
                  whiteSpace: "normal !important", // Enable text wrapping
                  wordBreak: "break-word", // Break long words
                  lineHeight: "1.2", // Adjust line height for readability
                  display: "flex",
                  alignItems: "center",
                },
                "& .super-app-theme--header": {
                  backgroundColor: `var(--linear-gradient-main)`,
                  color: "#fff",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-footerContainer": {
                  display: "none", // Hides footer
                },

                // Row styles
                "& .MuiDataGrid-row": {
                  maxHeight: "unset !important",
                  "&:nth-of-type(odd)": {
                    backgroundColor: "rgba(93, 220, 205, 0.15)",
                  },
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "15px",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(0, 150, 136, 0.2)",
                },
              }}
            />
          </Box>
        </Item>
      </Box>
    </div>
  );
};

export default SingleDisplayPage;
