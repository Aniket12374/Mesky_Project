import React from "react";

const DashboardDetail = () => {
  return (
    <div>
      <div className="w-[45%] space-y-7">
        <div className="grid grid-cols-3 gap-12">
          <div className="rounded-lg bg-[#DF4584] text-center text-white px-1 py-5">
            <div className="text-3xl font-medium">24</div>
            <div className="text-sm">Orders</div>
          </div>
          <div className="rounded-lg bg-[#F9A603] text-center text-white px-1 py-5">
            <div className="text-3xl font-medium">68</div>
            <div className="text-sm">Packets</div>
          </div>
          <div className="rounded-lg bg-[#65CBF3] text-center text-white px-1 py-5">
            <div className="text-3xl font-medium">4</div>
            <div className="text-sm">Riders</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-12">
          <div className="rounded-lg bg-[#FC8172] text-center text-white px-1 py-5">
            <div className="text-3xl font-medium">24</div>
            <div className="text-sm">Pincodes</div>
          </div>
          <div className="rounded-lg bg-[#AA00FF] text-center text-white px-1 py-5">
            <div className="text-3xl font-medium">68</div>
            <div className="text-sm">Sectors</div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default DashboardDetail;
