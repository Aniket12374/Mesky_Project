import { useState, useEffect } from "react";
import { Button, Table, Modal, Radio } from "antd";

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
  const [assignedRider, setAssignedRider] = useState(null); // New state to hold assigned rider

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
  }, []);

  const showModal = (record) => {
    setAreaId(record.key);
    setVisible(true);
    setSelectedAgents({ ...selectedAgents, [record.full_name]: "" }); // Initialize selected agent for the button
  };

  const handleOk = async () => {
    try {
      setVisible(false);
      const res = await assignAgent({
        area_id: areaId,
        rider_id: riderId,
      });
      const assignedRider = res?.data?.area?.rider_list[0];
      setAssignedRider(assignedRider); // Set the assigned rider in state
      console.log(assignedRider);
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
