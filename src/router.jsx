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
import SingleDisplayPage from "./pages/DetailRoomPage/SingleDisplayPage";
import NotFound from "./pages/NotFoundPage/NotFound";
import UserTypeSettings from "./pages/UserType/UserTypeSettings";
import ServicesPage from "./pages/Services/ServicesPage";
import StockPage from "./pages/StockPage/StockPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AddUserTypeSettings from "./pages/UserType/AddUserTypeSettings";
import EditUserTypeSettings from "./pages/UserType/EditUserTypeSettings";
import CommitteeTypePage from "./pages/CommitteeType/CommitteeTypePage";
import PendingAmenitiesPage from "./pages/StockPage/PendingAmenitiesPage";
import PendingFoodBeveragePage from "./pages/StockPage/PendingFoodBeveragePage";

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
        <Route path="/" element={<DashboardPage />} />
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/pending-amenities" element={<PendingAmenitiesPage />} />
        <Route path="/pending-food-beverage" element={<PendingFoodBeveragePage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/meetings" element={<MainMeetingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-committee" element={<MyCommitteePage />} />
        <Route path="/add-amenity" element={<AmenitiesAdd />} />
        <Route path="/amenities" element={<AmenitiesList />} />
        <Route path="/add-member" element={<AddMemberForm />} />
        <Route path="/add-room" element={<AddRoomForm />} />
        <Route path="/edit/:id" element={<UpdateMemberForm />} />
        <Route path="/committee" element={<CommitteeManagementMUI />} />
        <Route path="/committee-type" element={<CommitteeTypePage />} />
        <Route path="/add-committee" element={<AddCommitteeForm />} />
        <Route path="/book-meeting/:id" element={<MeetingForm />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/food-beverages" element={<FoodBeveragePage />} />
        <Route path="/user-role" element={<UserTypeSettings />} />
        <Route path="/logs" element={<MeetingLogs />} />
        <Route
          path="/view-committee/:committeeId"
          element={<CommitteeMemberList />}
        />
        <Route path="/view/:id" element={<ViewMember />} />
        <Route path="/notification-all" element={<Notification />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route
          path="/user-role/add-new-role"
          element={<AddUserTypeSettings />}
        />
        <Route
          path="/user-role/edit-role/:id"
          element={<EditUserTypeSettings />}
        />
        <Route path="/rooms/:id" element={<DetailRoomPage />} />
        <Route path="/stocks" element={<StockPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
