import QRCode from "react-qr-code";
import React from "react";
import { Box, Button } from "@mui/material";
import "./BarCode.css"
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

function BarCode({ urlData }) {

  const handlePrint = () => {
    window.print();
  };

  return (
    <PopContent>
      <div id="print-area">
        <QRCode
          size={256}
          style={{ height: "350px", maxWidth: "100%", width: "100%" }}
          value={urlData}
          viewBox={`0 0 256 256`}
        />
      </div>
      <Box mt={2} display="flex" justifyContent="flex-end" id="print-button">
        <FormButton type="button" func={handlePrint} btnName={'Print'} />

      </Box>
    </PopContent>
  );
}

export default BarCode;