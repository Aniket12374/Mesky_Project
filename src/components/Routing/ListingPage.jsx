import React, { useContext, useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
// import { CSVLink } from "react-csv";
import { routingStats } from "../../services/routing/RoutingService";
import { rankInfo } from "../../services/routing/RoutingService";
import { mappingList } from "../../services/areaMapping/MappingService";

const ListingPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [tableData, setTableData] = useState([]);
  const [allRiders, setAllRiders] = useState([]);
  const searchInput = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [buttonText, setButtonText] = useState("Edit");
  const [riderID, setRiderID] = useState();
  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(isEditMode);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    // useEffect(() => {
    //   if (editing) {
    //     inputRef.current?.focus();
    //   }
    // }, [editing]);

    const toggleEdit = () => {
      // setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();

        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            defaultValue={record?.rank}
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  const mergeSame = (arr) => {
    let mapData = new Map();
    arr.map((x) => {
      let newData = {
        ...x,
        rank: x.rank == "" ? 0 : x.rank,
      };
      if (mapData.has(x.sector))
        mapData.set(x.sector, [...mapData.get(x.sector), newData]);
      else mapData.set(x.sector, [newData]);
    });

    return Array.from(mapData.values()).flat();
  };

  const updateRankInfo = async (record) => {
    try {
      // Make API request to update rank information
      await rankInfo(record); // Assuming 'id' and 'rank' are properties of 'record'
      console.log("Rank updated successfully!");
    } catch (error) {
      console.error("Error updating rank:", error);
    }
  };

  useEffect(() => {
    // Fetch data for a specific rider when component mounts
    async function fetchDataForRider(riderId) {
      setRiderID(riderId);
      try {
        const response = await routingStats(riderId);
        // Set the response data as table data
        const data = mergeSame(response.data);
        setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Fetch all riders data
    async function fetchAllRiders() {
      try {
        const response = await mappingList();
        setAllRiders(response.data.all_riders);
        // Assuming you want to show the first rider's data by default
        if (response.data.all_riders.length > 0) {
          const defaultRiderId = response.data.all_riders[0].id;
          fetchDataForRider(defaultRiderId);
        }
      } catch (error) {
        console.error("Error fetching all riders:", error);
      }
    }

    fetchAllRiders();
  }, []);

  const onChange = async (value) => {
    setRiderID(value);
    const response = await routingStats(value);
    const finalData = mergeSame(response.data);
    setTableData(finalData);
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

  // Save data to localStorage
  const handleEditClick = async () => {
    if (isEditMode) {
      const payload = { rider_id: riderID, society_list: tableData };

      // Save tableData to localStorage before sending the API request
      localStorage.setItem("tableData", JSON.stringify(tableData));

      await updateRankInfo(payload);

      setIsEditMode(false);
      setButtonText("Edit");
    } else {
      setIsEditMode(true);
      setButtonText("Save");
    }
  };

  useEffect(() => {
    // Fetch saved data from localStorage when component mounts
    const savedTableData = localStorage.getItem("tableData");
    if (savedTableData) {
      setTableData(JSON.parse(savedTableData));
    }
  }, []);

  const handleCancelClick = () => {
    setIsEditMode(false);
    // If you want to discard changes, you might need to fetch the data again from the server
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
            onClick={() => {
              setSelectedKeys([]); // Clear selected keys
              handleSearch([], confirm, dataIndex); // Clear search and confirm
            }}
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
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current && searchInput.current.select());
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

  const routingColumns = [
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: "33%",

      ...getColumnSearchProps("sector"),
    },
    {
      title: "Society",
      dataIndex: "name",
      key: "name",
      width: "33%",
      ...getColumnSearchProps("society"),
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: "33%",
      editable: true,
      render: (rank) => {
        return rank == "" ? 0 : rank;
      },
      ...getColumnSearchProps("rank"),
      // render: (text, record) =>
      //   isEditMode ? (
      //     <Input
      //       value={text}
      //       onChange={(e) => {
      //         // Update the rank in the record
      //         const updatedRecord = { ...record, rank: e.target.value };
      //         // Update the table data with the updated record
      //         const updatedData = tableData.map((item) =>
      //           item.key === record.key ? updatedRecord : item
      //         );
      //         setTableData(updatedData);
      //       }}
      //     />
      //   ) : (
      //     text
      //   ),
    },
  ];

  // Duplicate columns for the second set
  const columnsSecondSet = routingColumns.map((col) => ({
    ...col,
    key: col.key + "2",
  }));

  const handleSave = (row) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.id === item.id);

    // const item = newData[index];
    newData[index]["rank"] = row["rank"];

    // console.log({ row });
    // let final = [...newData, item];
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });

    setTableData(newData);
  };

  // Split tableData into two subsets
  const tableDataFirstSet = tableData.slice(0, 13);
  const tableDataSecondSet = tableData.slice(13);

  const selectStyle = {
    width: "100%",
    fontWeight: "bold",
    color: "black",
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = routingColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

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
          <div
            className="rounded-2xl bg-[#DF4584] text-white px-4 py-1"
            onClick={handleEditClick}
          >
            {buttonText} {/* Display the buttonText state */}
          </div>

          <div
            className="rounded-2xl bg-[#A8A8A8] text-white px-4 py-1"
            onClick={handleCancelClick}
          >
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
            components={components}
            rowClassName={() => "editable-row"}
            pagination={false}
          />
        </div>
        <div className="w-1/2">
          <Table
            columns={columns}
            dataSource={tableDataSecondSet}
            pagination={false}
            components={components}
            rowClassName={() => "editable-row"}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
