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
    setVisible(true);
    setSelectedAgents({ ...selectedAgents, [record.key]: "" }); // Initialize selected agent for the button
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCheckboxChange = (record, checked) => {
    const { id, fullname } = record;
    setSelectedAgents(() => ({
      [id]: checked ? fullname : "",
    }));
  };

  console.log(selectedAgents);

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
          {selectedAgents[record.key] || "Assign Agent"}{" "}
          {/* Show selected agent name if available */}
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
              key={record.key}
              onChange={(e) => handleCheckboxChange(record, e.target.checked)}
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
