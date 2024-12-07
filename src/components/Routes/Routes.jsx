// src/routes/index.js
import HomePage from "../../pages/HomePage/HomePage";
import RoomsPage from "../../pages/RoomsPage/RoomsPage";
import MembersPage from "../../pages/MembersPage/MembersPage";
import DetailRoomPage from "../../pages/DetailRoomPage/DetailRoomPage";
import UserLogin from "../../pages/Login/UserLogin";
import RoomLogin from "../../pages/Login/RoomLogin";
import VerifyEmail from "../../pages/Login/VerifyEmail";
import ForgotPassword from "../../pages/Login/ForgotPassword";
import ResetPassword from "../../pages/Login/ResetPassword";
import MainMeetingPage from "../../pages/MeetingPage/MainMeetingPage";
import CalenderPage from "../../pages/CalenderPage/CalenderPage";
import AmenitiesAdd from "../../pages/AmenitiesPage/AmenitiesAdd";
import AmenitiesList from "../../pages/AmenitiesPage/AmenitiesList";
import AddMemberForm from "../../pages/MembersPage/AddMemberForm";
import AddRoomForm from "../../pages/RoomsPage/AddRoomForm";
import UpdateMemberForm from "../../pages/MembersPage/UpdateMemberForm";
import CommitteeManagementMUI from "../../pages/CommitteePage/CommitteePage";
import AddCommitteeForm from "../../pages/CommitteePage/AddCommitteeForm";
import CommitteeMemberList from "../../pages/CommitteePage/CommitteeMemberList";
import ViewMember from "../../pages/MembersPage/ViewMember";
import MyCommitteePage from "../../pages/CommitteePage/MyCommitteePage";
import MeetingForm from "../../pages/MeetingPage/MeetingForm";
import TodaysMeetings from "../../pages/SinglePage/TodaysMeetings";

export const publicRoutes = [
  { path: "/login", Component: UserLogin },
  { path: "/room-login", Component: RoomLogin },
  { path: "/verify-email", Component: VerifyEmail },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/reset-password/:token", Component: ResetPassword },
];

export const adminRoutes = [
  { path: "/home", Component: HomePage },
  { path: "/rooms", Component: RoomsPage },
  { path: "/members", Component: MembersPage },
  { path: "/meetings", Component: MainMeetingPage },
  { path: "/meeting-calendar", Component: CalenderPage },
  { path: "/add-amenity", Component: AmenitiesAdd },
  { path: "/amenities", Component: AmenitiesList },
  { path: "/add-member", Component: AddMemberForm },
  { path: "/add-room", Component: AddRoomForm },
  { path: "/edit/:id", Component: UpdateMemberForm },
  { path: "/committee", Component: CommitteeManagementMUI },
  { path: "/add-committee", Component: AddCommitteeForm },
  { path: "/view-committee/:committeeId", Component: CommitteeMemberList },
  { path: "/view/:id", Component: ViewMember },
  { path: "/book-meeting/:id", Component: MeetingForm },
];

export const userRoutes = [
  { path: "/home", Component: RoomsPage },
  { path: "/rooms/:id", Component: DetailRoomPage },
  { path: "/meetings/today", Component: TodaysMeetings },
];
