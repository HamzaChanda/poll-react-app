import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

function QRCodeDisplay({ url }) {
  return <QRCodeSVG value={url} size={128} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} />;
}

export default QRCodeDisplay;