import React, { useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import { Switch, Tooltip, Popover } from "antd";
import DataTable from "../Common/DataTable/DataTable";
import { Modal, Form, Input, Row, Col } from "antd";

const ListingPage = () => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [form] = Form.useForm();

  const dataHistory = [
    {
      // order_date: "12-12-23",
      order_id: "iurhuyg4ryw3ttyg54",
      customer_name: "John Doedfvv",
      society_name: "DLF CREST, SECTOR 53, GURGAON-17",
      delivery: "FLAT 203, BLOCK 4, SECTION XYZ",
      align: "center",
      // product: {
      //   detail: "hgfwgerfvgc",
      // },
      agent_name: "manan",
      status: " In Progress",
    },
    {
      // order_date: "12-12-23",
      order_id: "iurhuyg4ryw3ttyg54",
      customer_name: "John Doedfvv",
      society_name: "DLF CREST, SECTOR 53, GURGAON-17",
      delivery: "FLAT 203, BLOCK 4, SECTION XYZ",
      align: "center",
      // product: {
      //   detail: "hgfwgerfvgc",
      // },
      agent_name: "manan",
      status: " Available",
    },
    {
      // order_date: "12-12-23",
      order_id: "iurhuyg4ryw3ttyg54",
      customer_name: "John Doedfvv",
      society_name: "DLF CREST, SECTOR 53, GURGAON-17",
      delivery: "FLAT 203, BLOCK 4, SECTION XYZ",
      align: "center",
      // product: {
      //   detail: "hgfwgerfvgc",
      // },
      agent_name: "manan",
      status: " Pending",
    },
  ];

  const HistoryHeaders = [
    // {
    //   title: "ORDER DATE",
    //   dataIndex: "order_date",
    //   align: "center",
    //   key: "order_date",
    //   width: 100,
    // },
    {
      title: "ORDER ID",
      dataIndex: "order_id",
      key: "order_id",
      align: "center",
      width: 100,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customer_name",
      align: "center",
      key: "customer_name",
    },
    {
      title: "SOCIETY NAME",
      dataIndex: "society_name",
      align: "center",
      key: "society_name",
    },

    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      align: "center",
      key: "delivery",
    },
    // {
    //   title: "PRODUCT DETAIL",
    //   dataIndex: "product",
    //   key: "product",
    //   align: "center",
    //   render: (product) => <span>{product.detail}</span>,
    // },
    {
      title: "AGENT NAME",
      dataIndex: "agent_name",
      key: "agent_name",
      align: "center",
      // width: 100,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      // width: 100,
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (rowData) => {
    console.log("Selected Row Data:", rowData); // Check the selectedRowData
    setSelectedRowData(rowData);
    form.setFieldsValue({
      // orderDate: rowData.order_date,
      orderId: rowData.order_id,
      customerName: rowData.customer_name,
      societyName: rowData.society_name,
      delivery: rowData.delivery,
      // productDetail: rowData.product,
      agentName: rowData.agent_name,
      deliveryDate: rowData.delivery_date,
      // Add more fields as needed
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // const handleSave = () => {
  //   console.log("handleSave function is called.");
  //   form
  //     .validateFields()
  //     .then((values) => {
  //       // Handle the updated values (values) here
  //       console.log("Updated values:", values);

  //       // Close the modal
  //       setIsModalVisible(false);
  //     })
  //     .catch((errorInfo) => {
  //       console.error("Validation failed:", errorInfo);
  //     });
  // };

  return (
    <div>
      <DataTable
        data={dataHistory}
        navigateTo="/products/edit/"
        columns={HistoryHeaders}
        pagination={true}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              // Pass the clicked row's data to the showModal function
              showModal(record);
            },
          };
        }}
      />
      <Modal
        title=" Details"
        open={isModalVisible}
        onCancel={handleCancel}
        // destroyOnClose={true}
        footer={null}
      >
        {selectedRowData && (
          <Form
            form={form}
            layout="vertical"
            style={{ fontSize: "16px" }}
            initialValues={selectedRowData}
          >
            <Row gutter={16}>
              {/* <Col span={12}>
                <Form.Item label="Order Date" name="order_date">
                  <Input
                    style={{
                      fontSize: "14px",
                      boxShadow: "inset 0 0 10px pink",
                      padding: "8px",
                    }}
                    disabled
                  />
                </Form.Item>
              </Col> */}
              <Col span={12}>
                <Form.Item label="Order ID" name="order_id">
                  <Input
                    style={{
                      fontSize: "14px",
                      boxShadow: "inset 0 0 10px pink",
                      padding: "8px",
                    }}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="CUSTOMER NAME" name="customer_name">
                  <Input
                    style={{
                      fontSize: "14px",
                      boxShadow: "inset 0 0 10px pink",
                      padding: "8px",
                    }}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="SOCIETY NAME" name="society_name">
                  <Input
                    style={{
                      fontSize: "14px",
                      boxShadow: "inset 0 0 10px pink",
                      padding: "8px",
                    }}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Delivery Address" name="delivery">
                  <Input
                    style={{
                      fontSize: "14px",
                      boxShadow: "inset 0 0 10px pink",
                      padding: "8px",
                    }}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* <Form.Item label="Product Detail" name="product.detail">
              <Input
                style={{
                  fontSize: "14px",
                  boxShadow: "inset 0 0 10px pink",
                  padding: "8px",
                }}
                disabled
              />
            </Form.Item> */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Agent Name" name="agent_name">
                  <Input
                    style={{
                      fontSize: "14px",
                      boxShadow: "inset 0 0 10px pink",
                      padding: "8px",
                    }}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Delivery Date" name="delivery_date">
                  <Input
                    style={{
                      fontSize: "14px",
                      boxShadow: "inset 0 0 10px pink",
                      padding: "8px",
                    }}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* Add more Form.Item elements for other data fields */}
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ListingPage;
