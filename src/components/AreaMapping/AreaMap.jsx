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
      await assignAgent({
        area_id: areaId,
        rider_id: riderId,
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
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={() => showModal(record)}
          style={{ backgroundColor: "#DF4584" }}
        >
          {selectedAgents[record.full_name]
            ? selectedAgents[record.full_name]
            : "Assign Agent"}
        </Button>
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
