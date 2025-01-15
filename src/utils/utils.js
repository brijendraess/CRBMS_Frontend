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
  const date1 = new Date(`1970-01-01T${time1}`); // Ensure seconds and UTC
  let date2 = new Date(`1970-01-01T${time2}`);

  if (date2 < date1) {
    // Handle case where time2 is past midnight
    date2.setDate(date2.getDate() + 1);
  }

  const diffMs = date2 - date1; // Difference in milliseconds
  const diffHours = diffMs / (1000 * 60 * 60); // Convert to decimal hours

  return `${diffHours.toFixed(1)} hrs`; // Format to 1 decimal place
};


<<<<<<< HEAD
=======

>>>>>>> ccb43e432cbecdbe83b96072f0b66450e3777fec
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

const validateImage = (file) => {
  // Allowed image types
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  // Max file size (2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return "Only JPEG, PNG, GIF, and WEBP images are allowed.";
  }

  // Check file size
  if (file.size > maxSize) {
    return "Image must be smaller than 2MB.";
  }

  return null;
};

function getMeetingTimePercentage(startTime, endTime) {
  const now = new Date(); // Current time

  // Convert start and end times to Date objects
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) {
    // Meeting hasn't started yet
    return 0;
  } else if (now > end) {
    // Meeting has already ended
    return 100;
  } else {
    // Calculate the percentage
    const timeElapsed = now - start;
    const totalDuration = end - start;
    const percentageSpent = (timeElapsed / totalDuration) * 100;
    return percentageSpent.toFixed(2); // Return as a formatted percentage
  }
}

<<<<<<< HEAD
export {
  checkFileExists,
  getFormattedDate,
  timeDifference,
=======
const userRoleStringManipulation=(
  addData=false,
  editData=false,
  deleteData=false,
  viewData=false,
  changeStatusData=false
)=>{

  let arrData=[];
  if(addData){
    arrData.push('add')
  }
  if(editData){
    arrData.push('edit')
  }
  if(deleteData){
    arrData.push('delete')
  }
  if(viewData){
    arrData.push('view')
  }
  if(changeStatusData){
    arrData.push('changeStatus')
  }
  if(arrData.length>0){
    return arrData.join(",");
  }else{
    return "";
  }

}

const userRoleStringMeetingManipulation=(editData=false,viewData=false,postponeData=false,cancelData=false,approvalData=false)=>{

  let arrData=[];
 
  if(editData){
    arrData.push('edit')
  }
  if(viewData){
    arrData.push('view')
  }
  if(postponeData){
    arrData.push('postpone')
  }
  
  if(cancelData){
    arrData.push('cancel')
  }
  if(approvalData){
    arrData.push('approval')
  }
  if(arrData.length>0){
    return arrData.join(",");
  }else{
    return "";
  }

}

const userRoleStringRoomManipulation=(
  addData=false,
  editData=false,
  deleteData=false,
  viewData=false,
  galleryData=false,
  amenitiesData=false,
  foodBeverageData=false,
  barcodeData=false,
  sanitizationData=false
)=>{

  let arrData=[];
  if(addData){
    arrData.push('add')
  }
  if(editData){
    arrData.push('edit')
  }
  if(deleteData){
    arrData.push('delete')
  }
  if(viewData){
    arrData.push('view')
  }
  if(galleryData){
    arrData.push('gallery')
  }
  if(amenitiesData){
    arrData.push('amenities')
  }
  if(foodBeverageData){
    arrData.push('foodbeverage')
  }
  if(barcodeData){
    arrData.push('barcode')
  }
  if(sanitizationData){
    arrData.push('sanitization')
  }
  if(arrData.length>0){
    return arrData.join(",");
  }else{
    return "";
  }

}

export { checkFileExists, 
  getFormattedDate, 
  timeDifference, 
>>>>>>> ccb43e432cbecdbe83b96072f0b66450e3777fec
  fetchUsers,
  fetchActiveCommittee,
  validateImage,
  getMeetingTimePercentage,
<<<<<<< HEAD
};
=======
userRoleStringManipulation,
userRoleStringMeetingManipulation,
userRoleStringRoomManipulation };
>>>>>>> ccb43e432cbecdbe83b96072f0b66450e3777fec
