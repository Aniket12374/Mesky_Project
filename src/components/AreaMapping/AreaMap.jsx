import { useState, useRef } from "react";
import { Button, Input, Space, Table, Modal, Checkbox } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

const AreaMap = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [visible, setVisible] = useState(false); // State for modal visibility
  const [selectedAgents, setSelectedAgents] = useState({}); // State for selected agents
  const searchInput = useRef(null);

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

  const handleCheckboxChange = (record, agentName, checked) => {
    setSelectedAgents((prevSelectedAgents) => ({
      ...prevSelectedAgents,
      [record.key]: checked ? agentName : "", // Update selected agent for the button
    }));
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      closeDropdown,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm();
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={closeDropdown}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "AREA",
      dataIndex: "area",
      key: "area",
      align: "center",
      width: "20%",
      ...getColumnSearchProps("area"),
    },
    {
      title: "SECTORS",
      dataIndex: "sectors",
      key: "sectors",
      align: "center",
      width: "30%",
      ...getColumnSearchProps("sectors"),
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

  const data = [
    {
      key: "1",
      area: "AREA 1",
      sectors: "sector 32",
    },
    {
      key: "2",
      area: "AREA 2",
      sectors: "sector 42",
    },
    {
      key: "3",
      area: "AREA 3",
      sectors: "sector 51",
    },
    {
      key: "4",
      area: "AREA 4",
      sectors: "sector 67",
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Select Agents"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {data.map((record) => (
          <Checkbox
            key={record.key}
            onChange={(e) =>
              handleCheckboxChange(record, record.area, e.target.checked)
            }
          >
            {record.area}
          </Checkbox>
        ))}
      </Modal>
    </>
  );
};

export default AreaMap;
