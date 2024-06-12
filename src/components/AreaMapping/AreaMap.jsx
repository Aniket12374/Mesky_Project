import { useState, useEffect } from "react";
import { Table, Modal, Radio } from "antd";

import {
  assignAgent,
  mappingList,
} from "../../services/areaMapping/MappingService";

const AreaMap = () => {
  const [visible, setVisible] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState({});
  const [mappingData, setMappingData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [riderId, setRiderId] = useState(null);
  const [areaId, setAreaId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const [assignedRider, setAssignedRider] = useState(() => {
    try {
      const item = localStorage.getItem("assignedRider");
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error parsing JSON from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    mappingList()
      .then((item) => {
        const {
          data: { data },
        } = item;
        setTableData(data); // table list data
        setMappingData(item?.data); //riders list
      })
      .catch((error) => {
        setIsError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [areaId]);

  const showModal = (record) => {
    setAreaId(record.key);
    setVisible(true);

    // Check if there is an assigned rider
    const rider = record?.full_name ? record : assignedRider;
    if (rider) {
      setRiderId(rider.id); // Set the riderId with the already assigned rider's id
      setSelectedAgents({ [rider.full_name]: rider.id }); // Set the selected agent with the already assigned rider
    } else {
      setSelectedAgents({ ...selectedAgents, [record.full_name]: "" }); // Initialize selected agent for the button
    }
  };

  const handleOk = async () => {
    try {
      setVisible(false);
      if (areaId && riderId) {
        // Check if both areaId and riderId are present
        let res = await assignAgent({
          society_id: areaId,
          rider_id: riderId,
        });

        const assignedRider = res?.data?.area?.rider[0];
        setAssignedRider(assignedRider); // Set the assigned rider in state
        localStorage.setItem("assignedRider", JSON.stringify(assignedRider)); // Store assigned rider in localStorage
      }

      mappingList()
        .then((item) => {
          const {
            data: { data },
          } = item;
          setTableData(data); // table list data
          setMappingData(item?.data); //riders list
        })
        .catch((error) => {
          setIsError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (err) {
      console.log("error message", err);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleRadioChange = (record) => {
    if (record) {
      setRiderId(record.id);
      setSelectedAgents({ [record.full_name]: record.id });
    }
  };

  const columns = [
    {
      title: "CITY",
      dataIndex: "city",
      key: "city",
      // align: "center",
      // width: "20%",
    },
    {
      title: "AREA",
      dataIndex: "area",
      key: "area",
      // align: "center",
      // width: "20%",
    },
    {
      title: "PINCODE",
      dataIndex: "postal_code",
      key: "postal_code",
      // align: "center",
      // width: "20%",
    },
    {
      title: "SECTORS",
      dataIndex: "sector",
      key: "sector",
      // align: "center",
      // width: "30%",
      // render: (sectors) => (
      //   <ul>
      //     {sectors.map((sector) => (
      //       <li key={sector.id}>{sector.sector}</li>
      //     ))}
      //   </ul>
      // ),
    },
    {
      title: "ORDERS",
      dataIndex: "order",
      key: "order",
      // align: "center",
      // width: "20%",
    },
    {
      title: "ASSIGNED TO",
      dataIndex: "riders",
      key: "riders",
      // align: "center",

      render: (riders, record) => (
        <div className="flex ">
          <div className="w-3/5 flex flex-col space-y-2 justify-start items-center">
            {riders?.length ? (
              riders?.map((rider) => {
                return (
                  <>
                    <div className="flex space-x-7">
                      {rider.full_name && <span>{rider.full_name}</span>}
                      <button
                        type="primary"
                        size="large"
                        shape="round"
                        onClick={() =>
                          showModal({
                            key: record.key,
                            ...rider,
                          })
                        }
                        className="rounded-full ml-2 px-3 py-2"
                        style={{
                          backgroundColor: rider?.full_name
                            ? "#AA00FF"
                            : "#DF4584",
                          color: "#FFFFFF",
                        }}
                      >
                        Change
                      </button>
                    </div>
                  </>
                );
              })
            ) : (
              <button
                type="primary"
                size="large"
                shape="round"
                onClick={() => showModal(record)}
                className="rounded-full px-3 py-2"
                style={{
                  backgroundColor: "#DF4584",
                  color: "#FFFFFF",
                }}
              >
                Assign Agent
              </button>
            )}
          </div>
        </div>
      ),
    },
  ];

  const data = tableData?.map((item) => ({
    key: item.id,
    area: item.area,
    city: item.city,
    postal_code: item.postal_code,
    order_count: item.order,
    sector: item.sector,
    riders: item?.rider || [],
  }));

  return (
    <>
      <style>
        {`
        .ant-table-thead th {
          vertical-align: bottom; // Aligning titles at the bottom
        }
      `}
      </style>
      <Table columns={columns} dataSource={data} loading={isLoading} />
      <Modal
        title="Select Agents"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {mappingData.all_riders?.map((record) => (
            <Radio
              key={record.full_name}
              value={record.id}
              checked={selectedAgents[record.full_name] === record.id}
              onChange={() => handleRadioChange(record)}
            >
              {record.full_name}
            </Radio>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default AreaMap;
