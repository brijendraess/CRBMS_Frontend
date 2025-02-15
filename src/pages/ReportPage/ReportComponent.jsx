import React, { useEffect, useState } from "react";
import "./ReportPage.css";
import InfoCard from "../../components/InfoCard/InfoCard";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import { GroupsOutlinedIcon, Groups2OutlinedIcon, DesignServicesOutlinedIcon } from "../../components/Common/Buttons/CustomIcon";
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import PersonIcon from '@mui/icons-material/Person';

const ReportComponent = () => {
    const [counts, setCounts] = useState({
        users: 0,
        amenities: 0,
        food: 0,
        rooms: 0,
        committee: 0,
        locations: 0,
        services: 0,
        allMeeting: 0,
    });

    const [latest, setLatest] = useState({
        users: "",
        amenities: "",
        food: "",
        rooms: "",
        committee: "",
        locations: "",
        services: "",
        allMeeting: "",
    });

    const [meetingCount, setMeetingCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState("Today");
    const dispatch = useDispatch();

    const fetchCounts = async () => {
        try {
            dispatch(showLoading());
            const results = await Promise.allSettled([
                axios.get("/api/v1/report/user-count"),
                axios.get("/api/v1/report/amenity-count"),
                axios.get("/api/v1/report/food-count"),
                axios.get("/api/v1/report/room-count"),
                axios.get("/api/v1/report/committee-count"),
                axios.get("/api/v1/report/location-count"),
                axios.get("/api/v1/report/service-count"),
                axios.get("/api/v1/report/all-meeting-count"),
            ]);
            const [
                userData,
                amenityData,
                foodData,
                roomData,
                committeeData,
                locationData,
                serviceData,
                allMeetingData
            ] = results;

            setLatest({
                users:
                    userData.status === "fulfilled"
                        ? userData.value.data.data.latestUser.fullname
                        || ""
                        : "",
                amenities:
                    amenityData.status === "fulfilled"
                        ? amenityData.value.data.data.latestAmenity.name || ""
                        : "",
                food:
                    foodData.status === "fulfilled"
                        ? foodData.value.data.data.latestFoodBeverage.foodBeverageName
                        || ""
                        : "",
                rooms:
                    roomData.status === "fulfilled"
                        ? roomData.value.data.data.latestRoom.name || ""
                        : "",
                committee:
                    committeeData.status === "fulfilled"
                        ? committeeData.value.data.data.latestCommittee.name || ""
                        : "",
                locations:
                    locationData.status === "fulfilled"
                        ? locationData.value.data.data.latestLocation.locationName || ""
                        : "",
                services:
                    serviceData.status === "fulfilled"
                        ? serviceData.value.data.data.latestServices.servicesName || ""
                        : "",
                allMeeting:
                    allMeetingData.status === "fulfilled"
                        ? allMeetingData.value.data.data.latestMeeting.subject || ""
                        : "",
            })
            setCounts({
                users:
                    userData.status === "fulfilled"
                        ? userData.value.data.data.count || 0
                        : 0,
                amenities:
                    amenityData.status === "fulfilled"
                        ? amenityData.value.data.data.count || 0
                        : 0,
                foods:
                    foodData.status === "fulfilled"
                        ? foodData.value.data.data.count || 0
                        : 0,
                rooms:
                    roomData.status === "fulfilled"
                        ? roomData.value.data.data.count || 0
                        : 0,
                committee:
                    committeeData.status === "fulfilled"
                        ? committeeData.value.data.data.count || 0
                        : "",
                locations:
                    locationData.status === "fulfilled"
                        ? locationData.value.data.data.count || 0
                        : "",
                services:
                    serviceData.status === "fulfilled"
                        ? serviceData.value.data.data.count || 0
                        : "",
                allMeeting:
                    allMeetingData.status === "fulfilled"
                        ? allMeetingData.value.data.data.count || 0
                        : "",

            });
            dispatch(hideLoading());
        } catch (error) {
            dispatch(hideLoading());
            console.error("Unexpected error fetching counts:", error);
        }
    };

    const handleOptionSelect = async (option) => {
        setSelectedOption(option);
        try {
            let queryParam = "";
            switch (option) {
                case "Today":
                    queryParam = "?filter=Today";
                    break;
                case "This Week":
                    queryParam = "?filter=This Week";
                    break;
                case "This Month":
                    queryParam = "?filter=This Month";
                    break;
                default:
                    queryParam = "?filter=Today";
            }

            const response = await axios.get(
                `/api/v1/report/meeting-count${queryParam}`
            );
            setMeetingCount(response?.data?.data?.meetingCount || 0);
        } catch (error) {
            console.error("Error fetching meeting count:", error);
        }
    };
    useEffect(() => {
        fetchCounts();
        handleOptionSelect(selectedOption);
    }, []);

    const todayDate = new Date()
    console.log(todayDate)
    return (
        <Grid container spacing={1.5} display={'flex'} className="report-component" >
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoCard
                    color={["#1da256", "#48d483"]}
                    title="Users"
                    count={counts.users}
                    latest={latest.users}
                    show={false}
                    options={[]}
                    nameOfTheClass={"user-report-card"}
                    backSideHeading="Recently Registerd User"
                    Icon={PersonIcon}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoCard
                    color={["#1da256", "#48d483"]}
                    title="Meetings"
                    count={counts.allMeeting}
                    latest={latest.allMeeting}
                    show={false}
                    options={[]}
                    nameOfTheClass={"user-report-card"}
                    backSideHeading="Recent Meeting"
                    Icon={AvTimerIcon}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoCard
                    color={["#2c78e5", "#60aff5"]}
                    title="Amenities"
                    count={counts.amenities}
                    latest={latest.amenities}
                    show={false}
                    options={[]}
                    nameOfTheClass={"amenity-report-card"}
                    backSideHeading="Recently Added Amenity"
                    Icon={WifiOutlinedIcon}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                <InfoCard
                    color={["#2c78e5", "#60aff5"]}
                    title="Food & Beverages"
                    count={counts.food}
                    latest={latest.food}
                    show={false}
                    options={[]}
                    nameOfTheClass={"food-report-card"}
                    backSideHeading="Recently Added Beverage"
                    Icon={RestaurantOutlinedIcon}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                <InfoCard
                    color={["#2dd2a6", "#88f2d5"]}
                    title="Committee"
                    options={["Active", "Inactive"]}
                    count={counts.committee}
                    show={false}
                    nameOfTheClass={"committee-report-card"}
                    latest={latest.committee}
                    backSideHeading="Recently Registerd Committee"
                    Icon={GroupsOutlinedIcon}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                <InfoCard
                    color={["#c012e2", "#eb64fe"]}
                    title="Rooms"
                    count={counts.rooms}
                    latest={latest.rooms}
                    options={[]}
                    show={false}
                    nameOfTheClass={"room-report-card"}
                    backSideHeading="Recently Added Room"
                    Icon={MeetingRoomOutlinedIcon}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoCard
                    color={["#c012e2", "#eb64fe"]}
                    title="Locations"
                    count={counts.locations}
                    latest={latest.locations}
                    options={[]}
                    show={false}
                    nameOfTheClass={"room-report-card"}
                    backSideHeading="Recently Added Location"
                    Icon={LocationOnOutlinedIcon}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoCard
                    color={["#c012e2", "#eb64fe"]}
                    title="Services"
                    count={counts.services}
                    latest={latest.services}
                    options={[]}
                    show={false}
                    nameOfTheClass={"room-report-card"}
                    backSideHeading="Recently Added Service"
                    Icon={DesignServicesOutlinedIcon}
                />
            </Grid>
        </Grid>
    );
};

export default ReportComponent;
