import { useState, useEffect } from "react";
import { dashboardStats } from "../../services/dashboard/DashboardService";
import { Select, Table } from "antd";
import { mappingList } from "../../services/areaMapping/MappingService";
import {
  sectorDataStats,
  dashboardTable,
  presentOrders,
} from "../../services/dashboard/DashboardService";
import { useQuery } from "react-query";

const DashboardDetail = () => {
  const [stats, setStats] = useState(null);
  const [allRiders, setAllRiders] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null); // Track selected rider
  const [otherProducts, setOtherProducts] = useState([]); // State for other products data
  const [allData, setAllData] = useState();
  const [isError, setIsError] = useState(null);
  const { data, isLoading } = useQuery("dashboardTable", dashboardTable);

  const [deliveryStats, setDeliveryStats] = useState();

  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    ["presentOrders"],
    () => presentOrders(477)
  );

  const colors = [
    "#DF4584",
    "#F9A603",
    "#65CBF3",
    "#FC8172",
    "#AA00FF",
    "#4CAF50",
    "#FFEB3B",
    "#00BCD4",
    "#9C27B0",
    "#FF9800",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardStats();
        setStats(response.data);
        setOtherProducts(response.data.other_products); // Set other products data
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

  useEffect(() => {
    if (ordersData && Array.isArray(ordersData.data.data)) {
      const totalCount = ordersData.data.totalCount;
      //api to get all data

      presentOrders(totalCount)
        .then((item) => {
          const {
            data: { data },
          } = item;
          setAllData(data); // Store all data in the allData state
          calculateDeliveryStats(data, totalCount); //??
        })
        .catch(() => {
          setIsError("error");
        });
    }
  }, [ordersData]);

  const calculateDeliveryStats = (orders, totalCount) => {
    const totalDeliveries = totalCount;

    const before1pm = orders.filter(
      (order) => order.delivery_date?.split(" ")[1]?.split(":")[0] < 7
    ).length;
    const after1pm = orders.filter(
      (order) => order.delivery_date?.split(" ")[1]?.split(":")[0] >= 7
    ).length;
    const percentageAfter1pm =
      ((after1pm / totalDeliveries) * 100).toFixed(2) + "%";

    setDeliveryStats({
      total: totalDeliveries,
      before7: before1pm,
      after7: after1pm,
      percentage: percentageAfter1pm,
    });
  };

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

  let historyData = [];
  data?.data?.map((rider) => {
    historyData.push({
      rider: rider.rider_name,
      assignedOrders: rider.total_orders,
      completedOrders: rider.completed_order_count,
      pendingOrders: rider.pending_order_count,
      escalatedOrders: rider.escelated_order_count,
    });
  });

  const HistoryHeaders = [
    {
      title: "Rider",
      dataIndex: "rider",
      key: "rider",
    },
    {
      title: "Assigned Orders",
      dataIndex: "assignedOrders",
      key: "assignedOrders",
    },
    {
      title: "Completed Orders",
      dataIndex: "completedOrders",
      key: "completedOrders",
    },
    {
      title: "Pending Orders",
      dataIndex: "pendingOrders",
      key: "pendingOrders",
    },
    {
      title: "Escalated Orders",
      dataIndex: "escalatedOrders",
      key: "escalatedOrders",
    },
  ];

  const columns = [
    {
      title: "Total Deliveries",
      dataIndex: "total",
    },
    {
      title: "Delivery before 7am",
      dataIndex: "before7",
    },
    {
      title: "Delivery after 7am",
      dataIndex: "after7",
    },
    {
      title: "Percentage after 7am",
      dataIndex: "percentage",
    },
  ];
  // const dateDate = [
  //   {
  //     key: "1",
  //     total: "50",
  //     before7: 32,
  //     after7: 12,
  //     percentage: "3%",
  //   },
  // ];

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
        <div className="grid grid-cols-5 gap-4">
          {otherProducts?.map((product, index) => (
            <div
              key={index}
              className="rounded-lg text-center text-white px-1 py-5"
              style={{ backgroundColor: colors[index % colors.length] }}
            >
              <div className="text-3xl font-medium">{product.count}</div>
              <div className="text-sm">{product.name}</div>
            </div>
          ))}
        </div>
        <div>
          <Table
            columns={HistoryHeaders}
            dataSource={historyData}
            rowKey={(record) => record.rider_id} // Assuming rider_id is a unique identifier
            pagination={false} // Optional: Configure pagination as needed
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

        <div>
          <Table
            columns={columns}
            dataSource={[deliveryStats]}
            size="small"
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardDetail;
