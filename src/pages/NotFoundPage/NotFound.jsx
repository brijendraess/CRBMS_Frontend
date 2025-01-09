import React from "react";
import "./NotFound.css"; // Save the CSS code in this file

const NotFound = () => {
  return (
    <div className="flex-container">
      <div className="text-center">
        <h1>
          <span className="fade-in" id="digit1">
            4
          </span>
          <span className="fade-in" id="digit2">
            0
          </span>
          <span className="fade-in" id="digit3">
            4
          </span>
        </h1>
        <h3 className="fade-in">Oops! PAGE NOT FOUND</h3>
        <p className="fade-in">
          You’re either misspelling the URL or the page you are looking for
          might have been removed had its name changed or is temporarily
          unavailable.
        </p>
        <button
          type="button"
          name="button"
          onClick={() => (window.location.href = "/")}
        >
          Return To Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
