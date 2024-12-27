import React, { useEffect, useState } from "react";
import { mappingList } from "../../services/areaMapping/MappingService";
import {
  dashboardTable,
  deliveryStats,
  sectorDataStats,
} from "../../services/dashboard/DashboardService";
import { dashboardStats } from "../../services/dashboard/DashboardService";
import SectorData from "../Customer/SectorData";
import { Table, Select } from "antd";
import { commonHeaders } from "../Common/TableHeadersGeneration";
import { useQuery } from "react-query";
import { set } from "lodash";
// const { data, isLoading } = useQuery("dashboardTable", dashboardTable, {
//   refetchOnWindowFocus: false,
// });

const DashboardInformation = () => {
  const [items, setItems] = useState([]);

  //  const [modifieditems, setModifiedItems] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [allRiders, setAllRiders] = useState([]);
  const [addProducts, setAddProducts] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState();
  const [cityWise, setCityWise] = useState();
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);
  const [addPackets, setAddPackets] = useState([]);
  const [addOrders, setAddOrders] = useState([]);
  const [addRiders, setAddRiders] = useState([]);
  const [addPincodes, setAddPincodes] = useState([]);
  const [addSector, setAddSector] = useState([]);
  const [addCustomer, setAddCustomer] = useState([]);

  useEffect(() => {
    const handlesector = async () => {
      try {
        const response = await sectorDataStats();
        console.log(response.data);

        if (
          response.data.sector_data &&
          Array.isArray(response.data.sector_data)
        ) {
          setSectorData(sectorData);
        } else {
          console.log("No sector data:", response.data.sector_data);
        }
      } catch (error) {
        console.log("Error In API:", error);
      }
    };

    handlesector();
  }, []);

  useEffect(() => {
    const handlerider = () => {
      dashboardStats()
        .then((response) => {
          setItems(response.data);
          console.log(response.data);

          setAddProducts(response.data.other_products);
          setAddOrders(response.data.total_orders);
          setAddPackets(response.data.total_packets);
          setAddRiders(response.data.total_agaents);
          setAddPincodes(response.data.total_pincodes);
          setAddSector(response.data.total_sectors);
          setAddCustomer(response.data.unique_customer_count);
        })
        .catch((error) => {
          console.log("Error in API:", error);
        });
    };

    handlerider();
  }, []);

  useEffect(() => {
    const handlerider = () => {
      mappingList()
        .then((response) => {
          console.log("API response:", response.data);

          setAllRiders(response.data.all_riders);
          setData(response);
          console.log(response.data);
        })
        .catch((error) => {
          console.log("Error in API:", error);
        });
    };

    handlerider();
  }, []);

  useEffect(() => {
    const fetchDeliveryStats = async () => {
      try {
        const response = await deliveryStats();
        const dataStats = response.data;
        setCityWise(dataStats);
      } catch (error) {
        console.error("Error fetching delivery stats:", error);
      }
    };
    fetchDeliveryStats();
  }, []);

  const tableHeaders = [
    {
      title: "Rider",
      dataIndex: "rider_name",
      key: "rider_name",
      width: 200,
    },
    {
      title: "Assigned Orders",
      dataIndex: "assigned_orders",
      key: "assigned_orders",
    },
    {
      title: "Completed Orders",
      dataIndex: "completed_orders",
      key: "completed_orders",
    },
    {
      title: "Pending Orders",
      dataIndex: "pending_orders",
      key: "pending_orders",
    },
    {
      title: "Escalated Orders",
      dataIndex: "escalated_orders",
      key: "escalated_orders",
    },
  ];

  useEffect(() => {
    const handleRiderChanges = async () => {
      try {
        const response = await dashboardTable();
        console.log("response:", response.data);

        if (response && response.data && Array.isArray(response.data)) {
          const fetchapi = response?.data;
          console.log("fetchapi:", fetchapi);

          const formatteddata = fetchapi.map((rider) => ({
            rider_name: rider.rider_name,
            assigned_orders: rider.total_orders,
            completed_orders: rider.completed_order_count,
            pending_orders: rider.pending_order_count,
            escalated_orders: rider.escelated_order_count,
          }));
          setTableData(formatteddata);
        }
      } catch (error) {
        console.log("API error:", error);
      }
    };
    handleRiderChanges();
  }, []);

  useEffect(() => {
    if (selectedRider) {
      const handlesectordata = async (selectedRider) => {
        const response = await sectorDataStats(selectedRider);
        setSectorData(response.data.sector_data);
      };
      handlesectordata();
    }
  }, []);

  const onChange = (value) => {
    setSelectedRider(value);
  };

  const handleSearch = (value) => {
    console.log("handle search value:", value);
  };

  const deliveryColumns = [
    {
      title: "Total Deliveries",
      dataIndex: "total_deliveries",
      key: "total_deliveries",
    },
    {
      title: "Delivery Before 7 AM",
      dataIndex: "delivery_before_7am",
      key: "delivery_before_7am",
    },
    {
      title: "Delivery After 7 AM",
      dataIndex: "delivery_after_7am",
      key: "delivery_after_7am",
    },
    {
      title: "Percetage after 7 AM",
      dataIndex: "percentage_after_7am",
      key: "percentage_after_7am",
    },
  ];

  const cityColumns = [
    {
      title: "City, State",
      dataIndex: "City, State",
      key: "City, State",
      width: 200,
    },
    {
      title: " Before 7",
      dataIndex: "before7",
      key: "before7",
    },
    {
      title: " After 7",
      dataIndex: "after7",
      key: "after7",
    },
    {
      title: "Pending ",
      dataIndex: "acceptedCount",
      key: "acceptedCount",
    },
    {
      title: " Not Delivered ",
      dataIndex: "notDelivered",
      key: "notDelivered",
    },
  ];

  // const tableHeaders = [
  //   {
  //     title: "Rider",
  //     dataIndex: "rider_name",
  //     key: "rider_name",
  //     width: 200,
  //   },
  //   {
  //     title: "Assigned Orders",
  //     dataIndex: "assigned_orders",
  //     key: "assigned_orders",
  //   },
  //   {
  //     title: "Completed Orders",
  //     dataIndex: "completed_orders",
  //     key: "completed_orders",
  //   },
  //   {
  //     title: "Pending Orders",
  //     dataIndex: "pending_orders",
  //     key: "pending_orders",
  //   },
  //   {
  //     title: "Escalated Orders",
  //     dataIndex: "escalated_orders",
  //     key: "escalated_orders",
  //   },
  // ];

  console.log("tabledata:", tableData);

  const colors = [
    "#0000FF",
    "#8A2BE2",
    "#FFB6C1",
    "#FF0000",
    "#FF0000",
    "#8A2BE2",
  ];

  const labels = [
    "Orders",
    "Packets",
    "Riders",
    "PinCodes",
    "Sectors",
    "Unique Customer",
  ];

  // const statItems = [
  //   { valueKey: "total_orders", label: "Orders" },
  //   { valueKey: "total_packets", label: "Packets" },
  //   { valueKey: "total_riders", label: "Riders" },
  //   { valueKey: "total_pincodes", label: "PinCodes" },
  //   { valueKey: "total_sectors", label: "Sectors" },
  //   { valueKey: "unique_customer_count", label: "Unique Customers" },
  // ];

  // const itemsfetch = statItems.map((item, index) => ({
  //   value: items[item.valueKey] || 0,
  //   label: item.label,
  //   color: colors[index],
  // }));

  // useEffect(() => {
  //   const itemsvalue = {
  //     total_orders: items.total_orders,
  //     total_packets: items.total_packets,
  //     total_riders: items.total_agaents,
  //     total_pincodes: items.total_pincodes,
  //     total_sectors: items.total_sectors,
  //     unique_customer_count: items.unique_customer_count,
  //   };

  //   setModifiedItems(itemsvalue);
  //   console.log("items:", itemsvalue);
  // }, []);

  // useEffect(() => {
  //   const fetchrideritems = items.map((item) => ({
  //     total_orders: item.total_orders,
  //     total_packets: item.total_packets,
  //     total_riders: item.total_agents,
  //     total_pincodes: item.total_pincodes,
  //     total_sectors: item.total_sectors,
  //     unique_customer_count: item.unique_customer_count,
  //   }));
  //   setItems(fetchrideritems);
  // }, []);
  //  useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await dashboardStats();
  //       setStats(response.data);
  //       setOtherProducts(response.data.other_products);
  //     } catch (error) {
  //       console.error("Error fetching dashboard stats:", error);
  //     }
  //   };

  //   fetchData();
  //  },[])

  return (
    // <div className="flex justify-between mt-12">
    //   <div className="w-[45%] space-y-7">
    //     <div className="grid grid-cols-5 gap-4">
    //       <div className="w-1/2">
    //         <h2>Total Orders</h2>
    //         <p>{addOrders}</p>
    //       </div>
    //       <div>
    //         <h2>Total Packets</h2>
    //         <p>{addPackets}</p>
    //       </div>
    //       <div>
    //         <h2>Total Riders</h2>
    //         <p>{addRiders}</p>
    //       </div>
    //       <div>
    //         <h2>Total Pincodes</h2>
    //         <p>{addPincodes}</p>
    //       </div>
    //       <div>
    //         <h2>Total Sectors</h2>
    //         <p>{addSector}</p>
    //       </div>
    //       <div>
    //         <h2>Unique Customer</h2>
    //         <p>{addCustomer}</p>
    //       </div>
    //     </div>
    //     <div className="grid grid-cols-3 gap-4">
    //       {addProducts && addProducts.length > 0 ? (
    //         addProducts?.map((product, index) => (
    //           <div
    //             key={index}
    //             className="rounded-lg text-center text-white px-1 py-5"
    //             style={{
    //               backgroundColor: index % 2 === 0 ? "#3498db" : "#0000FF",
    //             }}
    //           >
    //             <div className="text-3xl font-medium">{product.count}</div>
    //             <div className="text-sm">{product.name}</div>
    //           </div>
    //         ))
    //       ) : (
    //         <div>No product </div>
    //       )}
    //     </div>

    //     <div>
    //       <Table
    //         columns={tableHeaders}
    //         dataSource={tableData}
    //         pagination={false}
    //         rowKey="rider_name"
    //       ></Table>
    //     </div>
    //   </div>

    //   <div className="w-1/2  space-y-5">
    //     <div>
    //       <Select
    //         showSearch
    //         placeholder="Orders by Rider"
    //         optionFilterProp="children"
    //         onChange={onChange}
    //         onSearch={handleSearch}
    //         options={allRiders.map((rider) => ({
    //           value: rider.id,
    //           label: rider.full_name,
    //         }))}
    //       />
    //     </div>

    //     {selectedRider &&
    //       (sectorData.length > 0 ? (
    //         sectorData.map((sector, index) => (
    //           <div
    //             className="rounded-xl bg-[#AA00FF] flex w-3/5 mt-3 justify-center p-2 text-white"
    //             key={index}
    //           >
    //             <div className="flex flex-col">
    //               <p className="font-medium text-xl">
    //                 {sector.sector_name} - {sector.sector_count} Orders
    //               </p>
    //             </div>
    //           </div>
    //         ))
    //       ) : (
    //         <p className="rounded-xl bg-[#AA00FF] flex w-3/5 mt-3 justify-center p-2 text-white">
    //           No sectors assigned
    //         </p>
    //       ))}
    //     <div>
    //       <Table
    //         columns={deliveryColumns}
    //         dataSource={[deliveryStatus]}
    //         pagination={false}
    //       ></Table>
    //     </div>
    //     <Table columns={cityColumns} pagination={false}></Table>
    //   </div>

    <SectorData />
  );
};

export default DashboardInformation;
