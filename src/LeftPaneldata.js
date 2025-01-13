import {
  MeetingRoomOutlinedIcon,
  Diversity2Icon,
  ChairIcon,
  CalendarMonthOutlinedIcon,
  BarChartOutlinedIcon,
  PersonOutlineOutlinedIcon,
  LocationOnOutlinedIcon,
  HistoryOutlinedIcon,
  FoodBankOutlinedIcon,
  SettingsApplicationsOutlinedIcon,
} from "./components/Common/CustomButton/CustomIcon";

const getSideBarMenuContent = async (user) => {
  let sideBarData = [];
  try {
    
    if (user.UserType.calendarModule&& user.UserType.calendarModule.split(",").includes("view")) {
      sideBarData.push({
        id: 1,
        name: "Home",
        icon: CalendarMonthOutlinedIcon,
        path: "/meeting-calendar",
      });
    }
    if (user.UserType.userModule&&user.UserType.userModule.split(",").includes("view")) {
      sideBarData.push( {
        id: 2,
        name: "Users",
        icon: PersonOutlineOutlinedIcon,
        path: "/members",
      });
    }
    if (user.UserType.committeeModule&&user.UserType.committeeModule.split(",").includes("view") && user.UserType.isAdmin==='admin') {
      sideBarData.push({
        id: 3,
        name: "Committee",
        icon: Diversity2Icon,
        path: "/committee",
      });
    }

     if (user.UserType.committeeModule&&user.UserType.committeeModule.split(",").includes("view") && user.UserType.isAdmin !=='admin') {
      sideBarData.push({
        id: 3,
        name: "My Committee",
        icon: Diversity2Icon,
        path: "/my-committee",
      });
    }

    if (user.UserType.amenitiesModule&&user.UserType.amenitiesModule.split(",").includes("view")) {
      sideBarData.push({
        id: 4,
        name: "Amenities",
        icon: ChairIcon,
        path: "/amenities",
      });
    }
    if (user.UserType.roomModule&&user.UserType.roomModule.split(",").includes("view") && user.UserType.isAdmin==='admin') {
      sideBarData.push({
        id: 5,
        name: "Rooms",
        icon: MeetingRoomOutlinedIcon,
        path: "/rooms",
      });
    }

    if (user.UserType.roomModule&&user.UserType.roomModule.split(",").includes("view") && user.UserType.isAdmin!=='admin') {
      sideBarData.push({
        id: 2,
        name: "Book A Room",
        icon: MeetingRoomOutlinedIcon,
        path: "/rooms",
      });
    }

    if (user.UserType.locationModule&&user.UserType.locationModule.split(",").includes("view")) {
      sideBarData.push({
        id: 6,
        name: "Location",
        icon: LocationOnOutlinedIcon,
        path: "/location",
      });
    }
    if (user.UserType.foodBeverageModule&&user.UserType.foodBeverageModule.split(",").includes("view")) {
      sideBarData.push( {
        id: 10,
        name: "Food & Beverages",
        icon: FoodBankOutlinedIcon,
        path: "/food-beverages",
      });
    }
    if (user.UserType.userRoleModule&&user.UserType.userRoleModule.split(",").includes("view")) {
      sideBarData.push( {
        id: 10,
        name: "User Role",
        icon: SettingsApplicationsOutlinedIcon,
        path: "/user-role",
      });
    }
    if (user.UserType.reportModule&&user.UserType.reportModule.split(",").includes("view")) {
      sideBarData.push({
        id: 8,
        name: "Report & Analytics",
        icon: BarChartOutlinedIcon,
        path: "/reports",
      });
    }
    if (user.UserType.meetingLogsModule&&user.UserType.meetingLogsModule.split(",").includes("view")) {
      sideBarData.push({
        id: 7,
        name: "Meeting Logs",
        icon: HistoryOutlinedIcon,
        path: "/logs",
      });
    }
    return sideBarData;
  } catch (error) {
    console.error("Error fetching sidebar menu content:", error.message);
    return {
      menuItems: [],
      message: "Failed to fetch menu content",
    };
  }
};

export { getSideBarMenuContent };



