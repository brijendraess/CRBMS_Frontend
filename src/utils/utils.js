const checkFileExists = async (filePath) => {
    try {
      const response = await fetch(filePath, { method: "HEAD" }); // Only fetch the headers
      return response.ok; // True if the file exists, false otherwise
    } catch (error) {
      console.error("Error checking file:", error);
      return false; // Handle errors like network issues
    }
  };



  export {checkFileExists}