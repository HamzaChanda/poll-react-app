import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from "../api/axios";
function QRCodeDisplay({ url }) {
  return <QRCodeSVG value={url} size={128} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} />;
}
const fetchPolls = async () => {
  try {
    const res = await api.get("/polls");
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};
export default QRCodeDisplay;