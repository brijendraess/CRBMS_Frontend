import React, { useEffect, useState } from "react";
import "./DetailRoomPage.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  styled,
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
  KeyboardBackspaceOutlinedIcon,
  LocationOnOutlinedIcon,
} from "../../components/Common/Buttons/CustomIcon";
import { getMeetingTimePercentage, timeDifference } from "../../utils/utils";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import Loader from "../../components/Common/Loader/Loader";
import { PaperWrapper } from "../../Style";
import PopupModals from "../../components/Common/Modals/Popup/PopupModals";
import MeetingForm from "../MeetingPage/MeetingForm";
import PageHeader from "../../components/Common/PageHeader/PageHeader";
import CustomButton from "../../components/Common/Buttons/CustomButton";
import NewPopUpModal from "../../components/Common/Modals/Popup/NewPopUpModal";

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


  const handleBackButton = () => {
    navigate(-1)
  }
  return (
    <PaperWrapper sx={{ display: "flex", gap: "5px", flexDirection: "column" }}>
      <PageHeader heading={room.name} >
        <CustomButton
          onClick={handleBackButton}
          iconStyles
          fontSize={"medium"}
          background={"var(--linear-gradient-main)"}
          Icon={KeyboardBackspaceOutlinedIcon}
          nameOfTheClass="go-to-committee-type"
          title="Back to Rooms"
        />
      </PageHeader>
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
              {room.RoomAmenityQuantities?.filter((item) => item.status === true)?.length > 0 && <Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"16px"}
                  fontWeight="700"
                >
                  Amenities:
                </Typography>
                {room.RoomAmenityQuantities &&
                  room.RoomAmenityQuantities?.filter((item) => item.status === true)?.map((amenity) => (
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
              {room?.RoomFoodBeverages?.filter((item) => item.status === true)?.length > 0 && <Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"16px"}
                  fontWeight="700"
                >
                  Food Beverages:
                </Typography>
                {room.RoomFoodBeverages &&
                  room.RoomFoodBeverages?.filter((item) => item.status === true)?.map((food) => (
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
                "& .super-app-theme--header": {
                  backgroundColor: `var(--linear-gradient-main)`,
                  color: "#fff",
                  fontWeight: "bold",
                },
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
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#e0f7fa",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
      <NewPopUpModal
        isOpen={isBookNowOpen}
        setIsOpen={setIsBookNowOpen}
        title={"Add New Meeting"}
        modalBody={<MeetingForm room={room} />}
      />
    </PaperWrapper>
  );
};

export default DetailRoomPage;
