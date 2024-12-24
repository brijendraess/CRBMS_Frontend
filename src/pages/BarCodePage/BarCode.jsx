import QRCode from "react-qr-code";
import React from "react";

function BarCode({urlData}) {
  return (
    <>
  <QRCode
    size={256}
    style={{ height: "150px", maxWidth: "100%", width: "100%" }}
    value={urlData}
    viewBox={`0 0 256 256`}
  />
    </>
  );
}

export default BarCode;