import React from "react";

const DashboardDetail = () => {
  return (
    <div>
      <div className="w-1/2">
        <div className="flex justify-evenly">
          <div className="border-2 w-1/4 rounded-lg bg-red-500 text-center text-white px-2 py-5">
            <div className="text-2xl">24</div>
            <div className="text-sm">orders</div>
          </div>
          <div className="border-2 rounded-lg w-1/4 bg-red-500 text-center text-white p-2">
            <div className="text-lg">24</div>
            <div className="text-sm">orders</div>
          </div>
          <div className="border-2 rounded-lg w-1/4 bg-red-500 text-center text-white p-2">
            <div className="text-lg">24</div>
            <div className="text-sm">orders</div>
          </div>
        </div>
        <div></div>
      </div>
      <div></div>
    </div>
  );
};

export default DashboardDetail;
