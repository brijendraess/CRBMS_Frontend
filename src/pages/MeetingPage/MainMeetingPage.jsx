import React from "react";
import MeetingAdmin from "./MeetingAdmin";
import MeetingFormPage from "./MeetingUser";

const MainMeetingPage = () => {
  const isAdmin = true;
  return (
    <div fluid className="right-content container w-100">
      {isAdmin ? (
        <MeetingAdmin isAdmin={isAdmin} />
      ) : (
        <MeetingFormPage isAdmin={isAdmin} />
      )}
    </div>
  );
};

export default MainMeetingPage;
