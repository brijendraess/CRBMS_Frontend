import { Route, Routes } from "react-router-dom";
import RoomsPage from "./pages/RoomsPage/RoomsPage";
import MembersPage from "./pages/MembersPage/MembersPage";
import DetailRoomPage from "./pages/DetailRoomPage/DetailRoomPage";
import UserLogin from "./pages/Login/UserLogin";
import RoomLogin from "./pages/Login/RoomLogin";
import VerifyEmail from "./pages/Login/VerifyEmail";
import PublicRoutes from "./components/Routes/PublicRoutes";
import ProtectedRoutes from "./components/Routes/ProtectedRoutes";
import MainMeetingPage from "./pages/MeetingPage/MainMeetingPage";
import CalenderPage from "./pages/CalenderPage/CalenderPage";
import AmenitiesAdd from "./pages/AmenitiesPage/AmenitiesAdd";
import AmenitiesList from "./pages/AmenitiesPage/AmenitiesList";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import AddMemberForm from "./pages/MembersPage/AddMemberForm";
import AddRoomForm from "./pages/RoomsPage/AddRoomForm";
import UpdateMemberForm from "./pages/MembersPage/UpdateMemberForm";
import CommitteeManagementMUI from "./pages/CommitteePage/CommitteePage";
import AddCommitteeForm from "./pages/CommitteePage/AddCommitteeForm";
import CommitteeMemberList from "./pages/CommitteePage/CommitteeMemberList";
import ViewMember from "./pages/MembersPage/ViewMember";
import MyCommitteePage from "./pages/CommitteePage/MyCommitteePage";
import MeetingForm from "./pages/MeetingPage/MeetingForm";
import TodaysMeetings from "./pages/SinglePage/TodaysMeetings";
import Layout from "./components/Layout/Layout";
import LocationPage from "./pages/LocationPage/LocationPage";
import MeetingLogs from "./pages/MeetingLogs/MeetingLogs";
import ReportPage from "./pages/ReportPage/ReportPage";
import FoodBeveragePage from "./pages/FoodBeverages/FoodBeveragesPage";
import Notification from "./pages/Notification/NotificationPage";
import Outlook from "./pages/Outlook/Outlook";
import TabScreenDetailPage from "./pages/DetailRoomPage/TabScreenDetailPage";
import SingleDisplayPage from "./pages/DetailRoomPage/SingleDisplayPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/meetings/today" element={<TodaysMeetings />} />
      <Route path="/room-tab/:id" element={<SingleDisplayPage />} />
      <Route
        path="/login"
        element={
          <PublicRoutes>
            <UserLogin />
          </PublicRoutes>
        }
      />
      <Route
        path="/room-login"
        element={
          <PublicRoutes>
            <RoomLogin />
          </PublicRoutes>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoutes>
            <VerifyEmail />
          </PublicRoutes>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoutes>
            <ForgotPassword />
          </PublicRoutes>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoutes>
            <ResetPassword />
          </PublicRoutes>
        }
      />
      <Route
        element={
          <ProtectedRoutes>
            <Layout />
          </ProtectedRoutes>
        }
      >
        {/* To-Do Admin Condition */}
        <Route path="/home" element={<CalenderPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/meetings" element={<MainMeetingPage />} />
        <Route path="/meeting-calendar" element={<CalenderPage />} />
        <Route path="/my-committee" element={<MyCommitteePage />} />
        <Route path="/add-amenity" element={<AmenitiesAdd />} />
        <Route path="/amenities" element={<AmenitiesList />} />
        <Route path="/add-member" element={<AddMemberForm />} />
        <Route path="/add-room" element={<AddRoomForm />} />
        <Route path="/edit/:id" element={<UpdateMemberForm />} />
        <Route path="/committee" element={<CommitteeManagementMUI />} />
        <Route path="/add-committee" element={<AddCommitteeForm />} />
        <Route path="/book-meeting/:id" element={<MeetingForm />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/food-beverages" element={<FoodBeveragePage />} />
        <Route path="/logs" element={<MeetingLogs />} />
        <Route
          path="/view-committee/:committeeId"
          element={<CommitteeMemberList />}
        />
        <Route path="/callback" element={<Outlook />} />
        <Route path="/view/:id" element={<ViewMember />} />
        <Route path="/notification-all" element={<Notification />} />
        <Route path="/outlook" element={<Notification />} />
        <Route path="/rooms/:id" element={<DetailRoomPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
