import axios from "axios";

const checkFileExists = async (filePath) => {
  try {
    const response = await fetch(filePath, { method: "HEAD" }); // Only fetch the headers
    return response.ok; // True if the file exists, false otherwise
  } catch (error) {
    console.error("Error checking file:", error);
    return false; // Handle errors like network issues
  }
};

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero
  const day = String(today.getDate()).padStart(2, "0"); // Add leading zero
  return `${year}-${month}-${day}`;
};

const timeDifference = (time1, time2) => {
  const date1 = new Date(`1970-01-01T${time1}`); // Convert time1 to a Date object
  const date2 = new Date(`1970-01-01T${time2}`); // Convert time2 to a Date object
  const diffMs = Math.abs(date2 - date1); // Difference in milliseconds
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  return `${diffHours}h ${diffMinutes}min`;
};

const fetchUsers = async (toast, setEmailsList) => {
  try {
    const response = await axios.get("/api/v1/user/users");
    const emails = response.data.data.users.rows.map((user) => ({
      email: user.email,
      id: user.id,
      name: user.fullname,
    }));
    setEmailsList(emails);
  } catch (error) {
    toast.error("Failed to load users");
    console.error("Error fetching users:", error);
  }
};

const fetchActiveCommittee = async (toast, setCommitteeList) => {
  try {
    const response = await axios.get("/api/v1/committee/active-committee");
    const emails = response.data.data.committees.map((committee) => ({
      name: committee.name,
      id: committee.id,
    }));
    setCommitteeList(emails);
  } catch (error) {
    toast.error("Failed to load committee");
    console.error("Error fetching committee:", error);
  }
};

export { checkFileExists, getFormattedDate, timeDifference, fetchUsers,fetchActiveCommittee };
