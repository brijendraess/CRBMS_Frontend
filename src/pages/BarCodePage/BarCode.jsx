import QRCode from "react-qr-code";
import React from "react";
import { Box, Button } from "@mui/material";
import "./BarCode.css"

function BarCode({urlData}) {

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
    <div id="print-area">
  <QRCode
    size={256}
    style={{ height: "350px", maxWidth: "100%", width: "100%" }}
    value={urlData}
    viewBox={`0 0 256 256`}
  />
  </div>
  <Box mt={2} display="flex" justifyContent="flex-end" id="print-button">
        <Button type="button" onClick={handlePrint} variant="contained" color="primary">
          Print
        </Button>
      </Box>
    </>
  );
}

export default BarCode;