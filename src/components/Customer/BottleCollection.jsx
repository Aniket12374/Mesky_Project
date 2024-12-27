import React, { useState, useRef, useEffect, useContext } from "react";
import { Table, Form, Input } from "antd";
import {
  updateBottleRemarks,
  updateDeliveryInstructions,
} from "../../services/customerOrders/CustomerOrderService";
import { getDeliveryOrderDetails } from "../../services/customerOrders/CustomerOrderService";
import { fetchapiCollectionData } from "../../services/customerOrders/CustomerOrderService";
import { element } from "prop-types";
import { keyBy } from "lodash";

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
  dataIndex,
  title,
  editable,
  inputType,
  record,
  children,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(children);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const save = () => {
    handleSave({ ...record, instructions: value }); // Pass updated instructions
    setEditing(false);
  };

  useEffect(() => {
    setValue(children); // Set initial value
  }, [children]);

  const Save = async () => {
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
        <Input ref={inputRef} onPressEnter={Save} onBlur={Save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingInlineEnd: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const BottleCollection = () => {
  const [dataSource, setDataSource] = useState([]);

  // const [columns, setColumns] = useState([]);

  const [toUpdateRow, setToUpdateRow] = useState([]);

  const handleClick = async () => {
    console.log(toUpdateRow);
    try {
      const isUpdate = await updateDeliveryInstructions(toUpdateRow);
      console.log("isUpdate :", isUpdate);
    } catch (error) {
      console.log("error:", error);
    }
  };
  console.log({ dataSource });

  useEffect(() => {
    const handleApiChanges = async () => {
      try {
        const response = await fetchapiCollectionData();
        console.log("response data:", response, response?.data);
        if (response && response.data && Array.isArray(response.data.data)) {
          const apiData = response?.data?.data;
          const formattedData = apiData?.map((item) => ({
            ...item,
            customer_name: item.customer_address.full_name, // Flatten nested property
            phone_number: item.customer_address.mobile_number,
            address_name: item.customer_address.address_name,
            delivery_instruction: item.customer_address.instructions,

            // Another flatten example
          }));
          setDataSource(formattedData);

          // setColumns(defaultColumns);
        }
      } catch (error) {
        console.log("Error Fetching API:", error);
      }
    };
    handleApiChanges();
  }, []);

  
  const defaultColumns = [
    {
      title: "Customer Name",
      dataIndex: ["customer_address", "full_name"],
      key: "full_name",
    },

    {
      title: "Bottles Pending",
      dataIndex: "pending_bottles",
      key: "pending_bottles",
    },

    {
      title: "Phone Number",
      dataIndex: ["customer_address", "mobile_number"],
      key: "mobile_number",
    },

    {
      title: "Address Name",
      dataIndex: ["customer_address", "address_name"],
      key: "address_name",
    },

    {
      title: "Delivery Instructions",
      dataIndex: ["customer_address", "instructions"],
      key: "instructions",
      editable: true,
    },
  ];

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
      customer_address: {
        ...item.customer_address, // Retain the previous properties of customer_address (if any)
        address: row.address,
        instructions: row.instructions, // Update the address from the row data
      },
    });
    setDataSource(newData);

    const objResult = {
      bottlepickuphistory_id: row?.key,
      instructions: row?.delivery_instruction,
    };
    setToUpdateRow((toUpdateRow) => {
      const index = toUpdateRow.findIndex(
        (element) => element.bottlepickuphistory_id === row.key
      );
      if (index !== -1) {
        return toUpdateRow.map((item, i) =>
          i === index ? { ...objResult } : item
        );
      } else {
        return [...toUpdateRow, { ...objResult }];
      }
    });
  };

 
  useEffect(() => {
    console.log("Updated rows:", toUpdateRow);
  }, [toUpdateRow]);

  useEffect(() => {
    const handleapi = () => {
      console.log("getDeliveryOrderDetails:", getDeliveryOrderDetails);
      getDeliveryOrderDetails()
        .then((res) => {
          console.log("data:", res.data);
        })
        .catch((error) => {
          console.log("error:", error);
        });
    };
    handleapi();
  }, []);

  const columns = defaultColumns.map((col) => {
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
      <h1 className="font-semibold my-8 mx-2 text-xl">
        Bottle Collection Status
      </h1>

      <button
        className="bg-[#FB8171] text-white  mx-12 mb-2 p-2 w-24 rounded-md shadow-md
      text-center cursor-pointer"
        onClick={handleClick}
      >
        Save
      </button>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};
export default BottleCollection;
