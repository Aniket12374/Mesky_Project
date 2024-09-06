import { Checkbox, Modal, Radio, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import trashBin from "../../assets/delt-bin.png";
import { DatePicker } from "antd";
import moment from "moment";

function SubscriptionEditModal({ modalData, handleEdit, handleOpenClose }) {
  console.log("modalData", modalData);
  const [editData, setEditData] = useState({
    quantity: null,
    subscription_type: null,
  });
  console.log("editData", editData);
  useEffect(() => {
    setEditData({
      quantity: modalData?.data?.quantity,
      subscription_type: modalData?.data?.subscription_type,
    });
  }, [modalData]);
  const [agent, setAgent] = useState({});

  const quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const handleQuantityChange = (qty) => {
    setEditData((prev) => ({
      ...prev,
      quantity: qty,
    }));
  };

  const handleType = () => {
    setEditData((prev) => ({
      ...prev,
      subscription_type: "",
    }));
  };

  const handleChange = (key, value) => {
    setAgent((prev) => ({ ...prev, ...{ [key]: value } }));
  };

  const deliverySchedule = [
    "Daily",
    "Alternate days",
    "No Delivery on Weekends",
    "Weekly",
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dateFormat = "YYYY-MM-DD";

  function disabledFutureDate(current) {
    return current && current > moment().endOf("day");
  }

  function disabledPastDate(current) {
    return current && current < moment().startOf("day");
  }

  const { product = {} } = modalData?.data;
  console.log("product", product);
  let price = product?.offer_price * editData?.quantity;
  console.log("price", price);

  return (
    <div>
      <Modal open={modalData?.open} width={900} footer={null}>
        <div>
          <div className="flex space-x-2 p-2">
            <div className="m-1 p-2 border-2 border-gray-200">
              <img
                src={
                  product?.images_list?.length > 0
                    ? product?.images_list[0]
                    : null
                }
                width={100}
                height={100}
                className="rounded-lg"
                alt="sub_img"
              />
            </div>
            <div className="">
              <div className="font-semibold">{product?.product_sn}</div>
              <div>
                <span>{product?.dprod_unit_qty}</span>
                <Select
                  name="quantity"
                  value={{
                    label: editData?.quantity,
                    value: editData?.quantity,
                  }}
                  className="w-16 ml-12"
                  onSelect={(val) => handleQuantityChange(val)}
                  options={quantityOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />

                <span className="ml-10">
                  <span>₹ {product?.offer_price * editData?.quantity}</span>
                  <span className="line-through ml-3">
                    ₹ {product?.selling_price * editData?.quantity}
                  </span>
                </span>
              </div>
              <div className="flex py-4 space-x-4">
                <div>
                  <div className="font-semibold">Delivery Schedule</div>
                  <div>
                    <Radio.Group onChange={handleType}>
                      <Space direction="vertical">
                        {deliverySchedule.map((value) => (
                          <Radio value={1}>{value}</Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
                <div className="">
                  <div>Starting from</div>
                  <div>
                    <DatePicker
                      placeholder={"select date"}
                      format={dateFormat}
                      disabledDate={disabledFutureDate}
                      // onChange={(date, dateString) => {
                      //   handleChange(x, dateString);
                      // }}
                    />
                  </div>
                  <div className="py-2">Choose Day</div>
                  <div className="flex text-center space-x-2">
                    {weekDays.map((day) => (
                      <div className=" w-10 h-10 pt-2 rounded-full bg-[#FB8171] text-white text-center">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="shadow-md py-4 rounded-lg px-2">
            <div className="flex justify-between">
              <div className="font-medium">Pause Schedule</div>
              <div className="text-white bg-[#FB8171] shadow-md p-1 rounded-md px-2">
                {" "}
                + ADD PAUSE
              </div>
            </div>
            <div className="flex  flex-row justify-between w-[50%] ">
              <div className="border border-gray-300 rounded-lg p-2 w-[127px]">
                <div className="flex justify-end relative bottom-1 left-1">
                  <img src={trashBin} width={15} height={15} alt="delt-bin" />
                </div>
                <div className="flex justify-center">
                  <div>
                    <p className="">10 May 2024</p>
                    <p className="flex justify-center">to</p>
                    <p className="">20 May 2024</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="border border-gray-300 rounded-lg p-2 w-[127px]">
                  <div className="flex justify-end relative bottom-1 left-1">
                    <img src={trashBin} width={15} height={15} alt="delt-bin" />
                  </div>
                  <div className="flex justify-center">
                    <div>
                      <p className="">10 May 2024</p>
                      <p className="flex justify-center">to</p>
                      <p className="">20 May 2024</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="border border-gray-300 rounded-lg p-2 w-[127px]">
                  <div className="flex justify-end relative bottom-1 left-1">
                    <img src={trashBin} width={15} height={15} alt="delt-bin" />
                  </div>
                  <div className="flex justify-center">
                    <div>
                      <p className="">10 May 2024</p>
                      <p className="flex justify-center">to</p>
                      <p className="">20 May 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-[#FB8171] text-white px-4 py-2 rounded-md"
              // onClick={handleAttachTicket}
            >
              AttachTicket
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SubscriptionEditModal;
