import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export const Header = ({ text, count, className = "" }) => (
  <div className={`flex justify-between items-center ${className}`}>
    <div className="text-3xl font-semibold ">{text}</div>
    {count && <div className="text-xl font-semibold px-4">{count+ 3+'/'+5}</div>}
  </div>
);

export const Loader = ({ size, className = "" }) => {
  const antIcon = (
    <LoadingOutlined style={{ fontSize: size ? size : 24 }} spin />
  );
  return <Spin indicator={antIcon} className={className} />;
};

export const Formlabel = ({ label, className = "" }) => (
  <div className={`${className} ml-3 text-[#A8A8A8]`}>{label}</div>
);

export const linkTpe = (link) => {
  let media = link.toLowerCase();
  const type =
    media.includes("jpg") || media.includes("jpeg") || media.includes("png")
      ? "image"
      : "video";
  return type;
};

export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
