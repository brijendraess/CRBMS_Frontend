// icons
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ChairIcon from "@mui/icons-material/Chair";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import FoodBankOutlinedIcon from '@mui/icons-material/FoodBankOutlined';

export const adminSideBarData = [
  {
    id: 1,
    name: "Home",
    icon: CalendarMonthOutlinedIcon,
    path: "/meeting-calendar",
  },
  {
    id: 2,
    name: "Users",
    icon: PersonOutlineOutlinedIcon,
    path: "/members",
  },
  {
    id: 3,
    name: "Committee",
    icon: Diversity2Icon,
    path: "/committee",
  },
  {
    id: 4,
    name: "Amenities",
    icon: ChairIcon,
    path: "/amenities",
  },
  {
    id: 5,
    name: "Rooms",
    icon: MeetingRoomOutlinedIcon,
    path: "/rooms",
  },
  {
    id: 6,
    name: "Location",
    icon: LocationOnOutlinedIcon,
    path: "/location",
  },
  {
    id: 10,
    name: "Food & Beverages",
    icon: FoodBankOutlinedIcon,
    path: "/food-beverages",
  },
  
  {
    id: 8,
    name: "Report & Analytics",
    icon: BarChartOutlinedIcon,
    path: "/reports",
  },
];

export const userSideBarData = [
  {
    id: 1,
    name: "My Meeting", //MY Meetings
    icon: CalendarMonthOutlinedIcon,
    path: "/meeting-calendar",
  },
  {
    id: 2,
    name: "Book A Room",
    icon: MeetingRoomOutlinedIcon,
    path: "/rooms",
  },
  {
    id: 3,
    name: "My Committee",
    icon: Diversity2Icon,
    path: "/my-committee",
  },
  {
    id: 7,
    name: "Meeting Logs",
    icon: HistoryOutlinedIcon,
    path: "/logs",
  },
];

export const meetings = [
  {
    id: 1,
    title: "Project Kickoff",
    startTime: "09:00:00",
    endTime: "09:45:00", // 45 minutes duration
    duration: "45 minutes",
    organizerName: "John Doe",
    status: "Completed",
  },
  {
    id: 2,
    title: "Team Sync",
    startTime: "10:00:00", // 15 min gap after previous meeting
    endTime: "10:30:00", // 30 minutes duration
    duration: "30 minutes",
    organizerName: "Jane Smith",
    status: "Completed",
  },
  {
    id: 3,
    title: "Client Demo",
    startTime: "10:45:00", // 15 min gap
    endTime: "11:15:00", // 30 minutes duration
    duration: "30 minutes",
    organizerName: "Alice Johnson",
    status: "In Progress",
  },
  {
    id: 4,
    title: "Sprint Planning",
    startTime: "11:30:00", // 15 min gap
    endTime: "12:30:00", // 1 hour duration
    duration: "1 hour",
    organizerName: "Bob Lee",
    status: "Scheduled",
  },
  {
    id: 5,
    title: "All Hands Meeting",
    startTime: "12:45:00", // 15 min gap
    endTime: "13:30:00", // 45 minutes duration
    duration: "45 minutes",
    organizerName: "Cathy Brown",
    status: "Scheduled",
  },
];

export const notifications = [
  {
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    name: "Mahmudul",
    action: "requested",
    item: "Conference Room Hall 12",
    time: "Few seconds ago",
  },
  {
    avatar:
      "https://images.pexels.com/photos/16002545/pexels-photo-16002545/free-photo-of-very-happy-blonde-woman.jpeg",
    name: "Mahmudul",
    action: "cancelled meeting in",
    item: "Conference Room Hall 18",
    time: "1 hour ago",
  },
  {
    avatar:
      "https://images.pexels.com/photos/4584579/pexels-photo-4584579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    name: "Mahmudul",
    action: "started meeting in",
    item: "Conference Hall 15",
    time: "3 hours ago",
  },
];
