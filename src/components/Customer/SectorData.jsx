import React, { useEffect, useState } from "react";
import { dashboardStats } from "../../services/dashboard/DashboardService";
import { addRider } from "../../services/riders/riderService";
import { values } from "lodash";
import { object } from "prop-types";

const SectorData = () => {
  const [data, setData] = useState({
    "Total Orders": 0,
    "Total Packets": 0,
    "Total Riders": 0,
    "Total Sectors": 0,
    "Total Pincodes": 0,
    "Total Customers": 0,
  });

  useEffect(() => {
    const handlesectoritem = async () => {
      try {
        const response = await dashboardStats();
        console.log(response.data);

        setData({
          "Total Orders": response.data.total_orders,
          "Total Packets": response.data.total_packets,
          "Total Riders": response.data.total_agaents,
          "Total Sectors": response.data.total_sectors,
          "Total Pincodes": response.data.total_pincodes,
          "Total Customers": response.data.unique_customer_count,
        });
      } catch (error) {
        console.log("Error:", error);
      }
    };
    handlesectoritem();
  }, []);

  const colors = [
    "#0000FF",
    "#8A2BE2",
    "#FFB6C1",
    "#FF0000",
    "#FF0000",
    "#8A2BE2",
  ];

  //   const sectorItems = [
  //     { label: "Total Orders", value: data.addOrders },
  //     { label: "Total Riders", value: data.addRiders },
  //     { label: "Total Packets", value: data.addPackets },
  //     { label: "Total Sectors", value: data.addSectors },
  //     { label: "Total Pincodes", value: data.addPincodes },
  //     { label: "Total Customers", value: data.addCustomers },
  //   ];

  const sectorItems = Object.entries(data).map(([orderkey, ordervalue]) => ({
    label: orderkey,
    value: ordervalue,
  }));

  return (
    <div className="flex justify-between mt-12">
      <div className="w-[45%] space-y-7">
        <div className="grid grid-cols-5 gap-4">
          {sectorItems && sectorItems.length > 0 ? (
            sectorItems.map(({ value, label }, index) => (
              <div
                key={index}
                className="rounded-lg text-center text-white px-1 py-5"
                style={{
                  backgroundColor: colors[index],
                }}
              >
                <div className="font-small">{value}</div>
                <div className="font-small">{label}</div>
              </div>
            ))
          ) : (
            <div>No sector</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectorData;
