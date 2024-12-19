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


const timeDifference=(time1,time2)=>{
  const date1 = new Date(`1970-01-01T${time1}`); // Convert time1 to a Date object
      const date2 = new Date(`1970-01-01T${time2}`); // Convert time2 to a Date object
      const diffMs = Math.abs(date2 - date1); // Difference in milliseconds
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      return `${diffHours}h ${diffMinutes}min`;
}



  export {checkFileExists,getFormattedDate,timeDifference}