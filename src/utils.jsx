import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export const Header = ({ text, className = "" }) => (
  <div className={`flex justify-between items-center ${className}`}>
    <div className='text-3xl font-semibold '>{text}</div>
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

export const customAlphNumericSort = (a, b) => {
  if (!a || !b) {
    return;
  }
  // Extract alphabetic and numeric parts from strings
  const alphaA = a.replace(/[^a-zA-Z]/g, "");
  const numA = parseInt(a.replace(/\D/g, ""), 10);
  const alphaB = b.replace(/[^a-zA-Z]/g, "");
  const numB = parseInt(b.replace(/\D/g, ""), 10);

  // Compare alphabetic parts first
  if (alphaA < alphaB) return -1;
  if (alphaA > alphaB) return 1;

  // If alphabetic parts are equal, compare numeric parts
  return numA - numB;
};

export const IconGreen = ({ icon }) => (
  <div className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-200'>
    <div className='w-4 h-4 flex items-center justify-center rounded-full bg-[#27AE60]'>
      <div className='p-3 text-white'>{icon}</div>
    </div>
  </div>
);

export const transactionName = (record) => {
  if (!record) return "";
  const type = record?.type;
  const isCreditTransaction = type === "CREDIT" || type === "REFUND";
  const isCreditType = type === "CREDIT";

  return !isCreditTransaction
    ? `Paid for Order ID: ${record?.order_id}`
    : isCreditType
    ? `Recharged wallet with ${record?.transaction_amount}`
    : `Refund for Order ID:  ${record?.order_id}`;
};
