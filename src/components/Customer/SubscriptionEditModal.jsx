import { Checkbox, Modal, Radio, Select, Space } from "antd";
import React, { useState } from "react";

function SubscriptionEditModal({ modalData, handleEdit, handleOpenClose }) {
  const [editData, setEditData] = useState({
    quantity: modalData?.data?.quantity,
    subscription_type: modalData?.data?.subscription_type,
  });
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

  const { product = {} } = modalData?.data;
  return (
    <div>
      <Modal
        open={modalData?.open}
        onOk={handleEdit}
        onCancel={handleOpenClose}
      >
        <div>
          <div className='flex justify-between space-x-2 p-2'>
            <div className='m-1 p-2 border-2 border-gray-200'>
              <img
                src={
                  product?.images_list?.length > 0
                    ? product?.images_list[0]
                    : null
                }
                width={100}
                height={100}
                className='rounded-lg'
                alt='sub_img'
              />
            </div>
            <div className='flex-1'>
              <div className='font-semibold'>{product?.product_sn}</div>
              <div className=''>
                <span>{product?.dprod_unit_qty}</span>
                <Select
                  name='quantity'
                  value={{
                    label: editData?.quantity,
                    value: editData?.quantity,
                  }}
                  className='w-16'
                  onSelect={(val) => handleQuantityChange(val)}
                  options={quantityOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                />

                <span className='ml-10'>
                  <span>₹ {product?.offer_price * editData?.quantity}</span>
                  <span className='line-through ml-3'>
                    ₹ {product?.selling_price * editData?.quantity}
                  </span>
                </span>
              </div>
              <div>
                <div>Delivery Schedule</div>
                <div>
                  <Radio.Group onChange={handleType}>
                    <Space direction='vertical'>
                      <Radio value={1}>Option A</Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SubscriptionEditModal;
