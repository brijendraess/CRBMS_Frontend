import React from "react";
import "./SearchBox.css";

import SearchIcon from '@mui/icons-material/Search';



const SearchBox = () => {
  return (
    <div className="searchBox position-relative d-flex align-items-center">
        <SearchIcon className="ms-1" />
      <input type="text" placeholder="Search Here ..." />
    </div>
  );
};

export default SearchBox;
