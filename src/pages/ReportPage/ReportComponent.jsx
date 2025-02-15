import React, { useEffect, useState } from "react";
import "./ReportPage.css";
import InfoCard from "../../components/InfoCard/InfoCard";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { motion } from "framer-motion";
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
        foods: 0,
        rooms: 0,
        committee: 0,
        locations: 0,
        services: 0,
        allMeeting: 0,
    });

    const [latest, setLatest] = useState({
        users: "",
        amenities: "",
        foods: "",
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
            console.log("ASewdfsghaXZ", results);

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
                foods:
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

    useEffect(() => {
        fetchCounts();
    }, []);

    // Variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3, // Reduce delay for faster animations
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="report-component"
        >
            <Grid container spacing={1.5} display={'flex'} className="report-component" >
                {[
                    {
                        title: "Users",
                        count: counts.users,
                        latest: latest.users,
                        color: ["#1da256", "#48d483"],
                        className: "user-report-card",
                        Icon: PersonIcon,
                        backSideHeading: "Recently Registered User"
                    },
                    {
                        title: "Meetings",
                        count: counts.allMeeting,
                        latest: latest.allMeeting,
                        color: ["#ff9800", "#ffc107"], // Changed from green to an orange gradient
                        className: "meeting-report-card",
                        Icon: AvTimerIcon,
                        backSideHeading: "Recently Booked Meeting"
                    },
                    {
                        title: "Amenities",
                        count: counts.amenities,
                        latest: latest.amenities,
                        color: ["#2c78e5", "#60aff5"],
                        className: "amenity-report-card",
                        Icon: WifiOutlinedIcon,
                        backSideHeading: "Recently Added Amenity"
                    },
                    {
                        title: "Food & Beverages",
                        count: counts.foods,
                        latest: latest.foods,
                        color: ["#e1950e", "#f3cd29"],
                        className: "food-report-card",
                        Icon: RestaurantOutlinedIcon,
                        backSideHeading: "Recently Added Food & Beverages"
                    },
                    {
                        title: "Committee",
                        count: counts.committee,
                        latest: latest.committee,
                        color: ["#2dd2a6", "#88f2d5"],
                        className: "committee-report-card",
                        options: ["Active", "Inactive"],
                        Icon: GroupsOutlinedIcon,
                        backSideHeading: "Recently Added Committee"
                    },
                    {
                        title: "Rooms",
                        count: counts.rooms,
                        latest: latest.rooms,
                        color: ["#c012e2", "#eb64fe"],
                        className: "room-report-card",
                        Icon: MeetingRoomOutlinedIcon,
                        backSideHeading: "Recently Added Room"
                    },
                    {
                        title: "Locations",
                        count: counts.locations,
                        latest: latest.locations,
                        color: ["#00acc1", "#26c6da"], // Changed from purple to a cyan gradient
                        className: "locations-report-card",
                        Icon: LocationOnOutlinedIcon,
                        backSideHeading: "Recently Added Location"
                    },
                    {
                        title: "Services",
                        count: counts.services,
                        latest: latest.services,
                        color: ["#d32f2f", "#ef5350"], // Changed from purple to a red gradient
                        className: "services-report-card", // Updated class name for clarity
                        Icon: DesignServicesOutlinedIcon,
                        backSideHeading: "Recently Added Service"
                    }
                ].map((card, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <motion.div
                            variants={itemVariants}
                            whileInView={() => {
                                return "visible";
                            }}
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <InfoCard
                                color={card.color}
                                title={card.title}
                                count={card.count}
                                latest={card.latest}
                                // options={card.options || []}
                                show={card.options ? true : false}
                                nameOfTheClass={card.className}
                                // onOptionSelect={card.title === "Meetings" ? setSelectedOption : undefined}
                                subHeading={card.title === "Meetings" ? selectedOption : undefined}
                                Icon={card.Icon}
                                backSideHeading={card.backSideHeading}
                            />
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </motion.div>
    );
};

export default ReportComponent;
