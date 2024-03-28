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
  const [assignedRider, setAssignedRider] = useState(
    JSON.parse(localStorage.getItem("assignedRider")) || null
  ); // Initialize assignedRider state with data from localStorage

  useEffect(() => {
    assignAgent();
    // setIsLoading(true);
    // setIsError(null);

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

    // Fetch assigned rider when the component mounts or updates
    const fetchAssignedRider = async () => {
      try {
        // Fetch assigned rider data
        const res = await assignAgent({
          area_id: areaId, // You might want to adjust this depending on your requirements
        });
        const assignedRider = res?.data?.area?.rider_list[0];
        setAssignedRider(assignedRider); // Set the assigned rider in state
        localStorage.setItem("assignedRider", JSON.stringify(assignedRider)); // Store assigned rider in localStorage
      } catch (err) {
        console.log("error message", err);
      }
    };

    // Call the fetchAssignedRider function
    fetchAssignedRider();

    // If areaId changes, refetch the assigned rider
    // This ensures that assigned rider state gets updated when areaId changes
  }, [areaId]);

  const showModal = (record) => {
    setAreaId(record.key);
    setVisible(true);

    // Check if there is an assigned rider
    if (assignedRider) {
      setRiderId(assignedRider.id); // Set the riderId with the already assigned rider's id
      setSelectedAgents({ [assignedRider.full_name]: assignedRider.id }); // Set the selected agent with the already assigned rider
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
          area_id: areaId,
          rider_id: riderId,
        });
        const assignedRider = res?.data?.area?.rider_list[0];
        setAssignedRider(assignedRider); // Set the assigned rider in state
        localStorage.setItem("assignedRider", JSON.stringify(assignedRider)); // Store assigned rider in localStorage
      }
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
      title: "AREA",
      dataIndex: "area",
      key: "area",
      align: "center",
      width: "20%",
    },
    {
      title: "SECTORS",
      dataIndex: "sectors",
      key: "sectors",
      align: "center",
      width: "30%",
      render: (sectors) => (
        <ul>
          {sectors.map((sector) => (
            <li key={sector.id}>{sector.sector}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "ASSIGNED TO",
      key: "action",
      align: "center",

      render: (text, record) => (
        <div className="flex justify-center">
          <div className="w-5/12 flex justify-evenly items-center">
            {assignedRider && (
              <span style={{ marginLeft: "10px" }}>
                {assignedRider.full_name}
              </span>
            )}
            <button
              type="primary"
              size="large"
              shape="round"
              onClick={() => showModal(record)}
              className="rounded-full px-3 py-2"
              style={{
                backgroundColor:
                  assignedRider && assignedRider?.full_name
                    ? "#AA00FF"
                    : "#DF4584",
                color: "#FFFFFF", // Change text color to white
              }}
            >
              {assignedRider ? "Change" : "Assign Agent"}
            </button>
          </div>
        </div>
      ),
    },
  ];

  const data = tableData?.map((item) => ({
    key: item.id,
    area: item.area_name,
    sectors: item.sector_list,
  }));

  return (
    <>
      <Table columns={columns} dataSource={data} loading={isLoading} />
      <Modal
        title="Select Agents"
        visible={visible}
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
