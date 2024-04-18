import { useState, useEffect } from "react";
import { dashboardStats } from "../../services/dashboard/DashboardService";
import { Select } from "antd";

const DashboardDetail = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once

  const selectStyle = {
    width: "60%",
    fontWeight: "bold",
    color: "black",
  };

  return (
    <div className="flex justify-between mt-12">
      <div className="w-[45%] space-y-7">
        <div className="grid grid-cols-3 gap-12">
          {stats && (
            <>
              <div className="rounded-lg bg-[#DF4584] text-center text-white px-1 py-5">
                <div className="text-3xl font-medium">{stats.total_orders}</div>
                <div className="text-sm">Orders</div>
              </div>
              <div className="rounded-lg bg-[#F9A603] text-center text-white px-1 py-5">
                <div className="text-3xl font-medium">
                  {stats.total_packets}
                </div>
                <div className="text-sm">Packets</div>
              </div>
              <div className="rounded-lg bg-[#65CBF3] text-center text-white px-1 py-5">
                <div className="text-3xl font-medium">
                  {stats.total_agaents}
                </div>
                <div className="text-sm">Riders</div>
              </div>
            </>
          )}
        </div>
        <div className="grid grid-cols-3 gap-12">
          {stats && (
            <>
              <div className="rounded-lg bg-[#FC8172] text-center text-white px-1 py-5">
                <div className="text-3xl font-medium">
                  {stats.total_pincodes}
                </div>
                <div className="text-sm">Pincodes</div>
              </div>
              <div className="rounded-lg bg-[#AA00FF] text-center text-white px-1 py-5">
                <div className="text-3xl font-medium">
                  {stats.total_sectors}
                </div>
                <div className="text-sm">Sectors</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-[45%]">
        <div>
          <Select
            style={selectStyle}
            showSearch
            placeholder="Select A Rider"
            optionFilterProp="children"
            // onChange={onChange}
            // onSearch={handleSearch}
            // filterOption={filterOption}
            // options={allRiders.map((rider) => ({
            //   value: rider.id,
            //   label: rider.full_name,
            // }))}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardDetail;
