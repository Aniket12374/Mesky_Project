import { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { routingStats } from "../../services/routing/RoutingService";

import { mappingList } from "../../services/areaMapping/MappingService";

const ListingPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [tableData, setTableData] = useState([]);
  const [allRiders, setAllRiders] = useState([]);
  const searchInput = useRef(null);

  useEffect(() => {
    // Fetch data when component mounts
    async function fetchData() {
      try {
        const response = await routingStats();
        setTableData(response.data); // Assuming your API response contains the data array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();

    // Fetch all riders data
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

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select());
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
      title: "Society",
      dataIndex: "name",
      key: "name",
      width: "33%",
      ...getColumnSearchProps("society"),
    },

    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: "33%",
      ...getColumnSearchProps("sector"),
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: "33%",
      ...getColumnSearchProps("rank"),
    },
  ];

  // Duplicate columns for the second set
  const columnsSecondSet = columns.map((col) => ({
    ...col,
    key: col.key + "2",
  }));

  // Split tableData into two subsets
  const tableDataFirstSet = tableData.slice(0, 4);
  const tableDataSecondSet = tableData.slice(4);

  const selectStyle = {
    width: "100%",
    fontWeight: "bold",
    color: "black",
  };

  return (
    <div>
      <style>
        {`
        .ant-table-thead th {
          vertical-align: bottom; // Aligning titles at the bottom
        }
      `}
      </style>
      <div className="flex justify-end w-full">
        <div className="flex w-1/6 justify-evenly">
          <div className="rounded-2xl bg-[#DF4584] text-white px-4 py-1">
            Edit
          </div>
          <div className="rounded-2xl bg-[#A8A8A8] text-white px-4 py-1">
            Cancel
          </div>
        </div>
      </div>
      <div className="w-1/5">
        <Select
          style={selectStyle}
          showSearch
          placeholder="Select A Rider"
          optionFilterProp="children"
          onChange={onChange}
          onSearch={onSearch}
          filterOption={filterOption}
          options={allRiders.map((rider) => ({
            value: rider.id,
            label: rider.full_name,
          }))}
        />
      </div>
      <div className="flex w-full">
        <div className="w-1/2">
          <Table
            columns={columns}
            dataSource={tableDataFirstSet}
            pagination={false}
          />
        </div>
        <div className="w-1/2">
          <Table
            columns={columnsSecondSet}
            dataSource={tableDataSecondSet}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
