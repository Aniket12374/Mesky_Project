import React, { useState, useRef, useEffect, useContext } from "react";
import { Table, Form, Input } from "antd";
import { updateBottleRemarks } from "../../services/customerOrders/CustomerOrderService";
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
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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

const OrderDetails = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: 1,
      customer_name: "Ramesh Kumar",
      phone_number: "+91 9650571697",
      bottles_pending: 40,
      rider_collected: 20,
      warehouse_received: 5,
      declare_unrecoverable: 17,
      balance: 18,
      remarks: "Less Collection reason",
    },
    {
      key: 2,
      customer_name: "Ramesh Kumar",
      phone_number: "+91 9650571697",
      bottles_pending: 40,
      rider_collected: 20,
      warehouse_received: 5,
      declare_unrecoverable: 17,
      balance: 18,
      remarks: "Less Collection reason",
    },
  ]);
  const [toOrderToUpdate, setToOrderToUpdate] = useState([]);

  const handleSaveForOrderRemarks = async () => {
    console.log(toOrderToUpdate);
    try {
      const isUpdate = await updateBottleRemarks(toOrderToUpdate);
      console.log("isUpdate :", isUpdate);
    } catch (error) {
      console.log("error :", error);
    }
  };

  const data = [
    { phone: "+91 9650571697" },
    { customer: "Ramesh Kumar" },
    { bottles_pending: "40", rider_collected: "20" },
    { bottles_pending: "40", rider_collected: "20" },
    { uniques_warehouse: "5" },
    { declare_unrecoverable: "17" },
    { balancecheck: "18" },
    { remarktext: "Less collection reason" },
  ];

  const uniqueBottlePendings = Array.from(
    new Set(data.map((record) => record.bottles_pending))
  ).sort();
  const uniqueriderCollected = Array.from(
    new Set(data.map((record) => record.rider_collected))
  ).sort();
  const uniquewarehouse = Array.from(
    new Set(data.map((record) => record.uniques_warehouse))
  ).sort();
  const declareunrecoverable = Array.from(
    new Set(data.map((record) => record.declare_unrecoverable))
  ).sort();
  const declareBalance = Array.from(
    new Set(data.map((record) => record.balancecheck))
  ).sort();
  const declareRemark = Array.from(
    new Set(data.map((record) => record.remarktext))
  ).sort();
  const declarecustomer = Array.from(
    new Set(data.map((record) => record.customer))
  ).sort();
  const uniquephonenumber = Array.from(
    new Set(data.map((record) => record.phone))
  ).sort();

  const defaultColumns = [
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      filters: declarecustomer.map((value) => ({
        text: value,
        value: value,
      })),

      filterSearch: true,
      onFilter: (value, record) => record.customer_name === value,
    },

    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      filters: uniquephonenumber.map((value) => ({
        text: value,
        value: value,
      })),

      filterSearch: true,
      onFilter: (value, record) => record.phone_number === value,
    },

    {
      title: "Bottles Pending",
      dataIndex: "bottles_pending",
      key: "bottles_pending",
      filters: uniqueBottlePendings.map((value) => ({
        text: value,
        value: value,
      })),

      filterSearch: true,
      onFilter: (value, record) => record.bottles_pending === value,
    },

    {
      title: "Rider Collected",
      dataIndex: "rider_collected",
      key: "rider_collected",
      filters: uniqueriderCollected.map((value) => ({
        text: value,
        value: value,
      })),

      filterSearch: true,
      onFilter: (value, record) => record.rider_collected === value,
    },

    {
      title: "Warehouse Received",
      dataIndex: "warehouse_received",
      key: "warehouse_received",
      editable: true,
      filters: uniquewarehouse.map((value) => ({
        text: value,
        value: value,
      })),

      filterSearch: true,
      onFilter: (value, record) => record.warehouse_received === value,
    },

    {
      title: "Declare Unrecoverable",
      dataIndex: "declare_unrecoverable",
      key: "declare_unrecoverable",
      editable: true,
      filters: declareunrecoverable.map((value) => ({
        text: value,
        value: value,
      })),

      filterSearch: true,
      onFilter: (value, record) => record.declare_unrecoverable === value,
    },

    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      filters: declareBalance.map((value) => ({
        text: value,
        value: value,
      })),

      filterSearch: true,
      onFilter: (value, record) => record.balance === value,
    },

    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      editable: true,
      filters: declareRemark.map((value) => ({
        text: value,
        value: value,
      })),

      filterSearch: true,
      onFilter: (value, record) => record.remarks === value,
    },
  ];

  const handleSave = (row) => {
    console.log("row :", row);
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);

    // Code for to update order remarks:

    const payloadObject = {
      bottlepickuphistory_id: row?.key,
      warehouse_received: row?.warehouse_received,
      declare_unrecoverable: row?.declare_unrecoverable,
      remarks: row?.remarks,
    };
    setToOrderToUpdate((toOrderToUpdate) => {
      const index = toOrderToUpdate.findIndex(
        (element) => element.bottlepickuphistory_id === row.key
      );
      if (index !== -1) {
        return toOrderToUpdate.map((item, i) =>
          i === index ? { ...payloadObject } : item
        );
      } else {
        return [...toOrderToUpdate, { ...payloadObject }];
      }
    });
  };

  
   
  useEffect(() => {
    console.log("Order Update:", toOrderToUpdate);
  }, [toOrderToUpdate]);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
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
        Order Collection Status
      </h1>
      <button
        className="bg-[#FB8171] text-white  mx-12 mb-2 p-2 w-24 rounded-md shadow-md
      text-center cursor-pointer"
        onClick={handleSaveForOrderRemarks}
      >
        Save
      </button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default OrderDetails;
