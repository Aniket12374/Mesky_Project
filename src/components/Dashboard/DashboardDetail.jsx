import { useState, useEffect } from "react";
import { dashboardStats } from "../../services/dashboard/DashboardService";
import { Select, Table } from "antd";
import { mappingList } from "../../services/areaMapping/MappingService";
import { sectorDataStats } from "../../services/dashboard/DashboardService";

const DashboardDetail = () => {
  const [stats, setStats] = useState(null);
  const [allRiders, setAllRiders] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null); // Track selected rider

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

    async function fetchSectorData() {
      try {
        const response = await sectorDataStats();
        const sectorsData = response.data.sectors_data.map((sector) => ({
          id: sector.id,
          name: sector.sector_name,
          count: sector.count,
        }));
        setSectorData(sectorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchSectorData();

    // Fetch all riders from mappingList API
    async function fetchAllRiders() {
      try {
        const response = await mappingList();
        setAllRiders(response.data.all_riders);
      } catch (error) {
        console.error("Error fetching all riders:", error);
      }
    }
    fetchAllRiders();
  }, []);

  const selectStyle = {
    width: "60%",
    fontWeight: "bold",
    color: "black",
  };

  const onChange = async (value) => {
    setSelectedRider(value); // Update selected rider
    const response = await sectorDataStats(value);
    setSectorData(response.data.sectors_data);
  };

  const handleSearch = (value) => {
    // Handle onSearch event of Select component
    console.log("Searching for rider:", value);
  };

  const filterOption = (input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
    },
  ];

  return (
    <div className="flex justify-between mt-12">
      <div className="w-[45%] space-y-7">
        <div className="grid grid-cols-5 gap-4">
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
        <div>
          {" "}
          <Table
            columns={columns}
            dataSource={data}
            size="middle"
            pagination={false}
          />
        </div>
      </div>

      <div className="w-[45%]">
        <div>
          <Select
            style={selectStyle}
            showSearch
            placeholder="Orders by Rider"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={handleSearch}
            filterOption={filterOption}
            options={allRiders.map((rider) => ({
              value: rider.id,
              label: rider.full_name,
            }))}
          />
        </div>

        {selectedRider && sectorData.length > 0
          ? sectorData.map((sector, index) => (
              <div
                className="rounded-xl bg-[#AA00FF] flex w-3/5 mt-3 justify-center p-2 text-white"
                key={index}
              >
                <div className="flex flex-col">
                  <p className="font-medium text-xl">
                    {sector.sector_name} - {sector.count} Orders
                  </p>
                </div>
              </div>
            ))
          : selectedRider &&
            sectorData.length === 0 && (
              <p className="rounded-xl bg-[#AA00FF] flex w-3/5 mt-3 justify-center p-2 text-white">
                No sectors assigned
              </p>
            )}
      </div>
    </div>
  );
};

export default DashboardDetail;
