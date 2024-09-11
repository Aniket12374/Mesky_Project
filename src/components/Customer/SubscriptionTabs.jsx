import React, { useEffect, useState } from "react";
import { Header } from "../../utils";
import { getSubscriptions } from "../../services/customerInfo/CustomerInfoService";
import { Modal, Select, Tabs } from "antd";
import SubscriptionEditModal from "./SubscriptionEditModal";

function SubscriptionTabs() {
  const [activeTab, setActiveTab] = useState(1);
  const [modalData, setModalData] = useState({
    open: false,
    isCreateSubscription: false,
    data: [],
  });

  return (
    <div className="w-1/3 border-2 border-gray-200">
      <div className="flex justify-between py-2 pr-2">
        <div>
          <Header text="Subscription" className="m-2" />
        </div>
        <div
          className="bg-[#FB8171] text-white px-4 pt-2 h-10 rounded-md shadow-md text-center cursor-pointer"
          onClick={(prev) =>
            setModalData({ ...prev, isCreateSubscription: true, open: true })
          }
        >
          Create New
        </div>
      </div>
      <div className="ml-2">
        <Tabs
          defaultActiveKey={1}
          style={{ fontFamily: "Fredoka, sans-serif" }}
          onTabClick={(key) => setActiveTab(Number(key))}
          items={[
            {
              label: "Active",
              key: "1",
              children: (
                <SubscriptionData
                  tab={1}
                  modalData={modalData}
                  setModalData={setModalData}
                />
              ),
            },
            {
              label: "Inactive",
              key: "2",
              children: (
                <SubscriptionData
                  tab={2}
                  modalData={modalData}
                  setModalData={setModalData}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

const SubscriptionData = ({ tab, modalData, setModalData }) => {
  const [tabData, setTabData] = useState([]);

  useEffect(() => {
    getSubscriptions(tab == 1 ? "active" : "inactive").then((res) => {
      setTabData(res?.data);
    });
  }, [modalData]);

  const handleEdit = () => {};

  const handleOpenClose = () =>
    setModalData((prev) => ({ ...prev, open: !prev?.open }));

  const handleEditOpen = (record) =>
    setModalData((prev) => ({
      ...prev,
      open: true,
      data: record,
      isCreateSubscription: false,
    }));

  const activeTab = tab === 1;

  return (
    <div>
      {tabData.map((record, index) => {
        const { product, quantity, dates_range, start_date, end_date } = record;
        return (
          <div className="m-1 shadow-2xl rounded-lg">
            <div className="flex justify-between space-x-2 p-2">
              <div className="m-1 p-2 border-2 border-gray-200">
                <img
                  src={
                    product?.images_list?.length > 0
                      ? product?.images_list[0]
                      : null
                  }
                  width={50}
                  height={50}
                  className="rounded-lg"
                  alt="sub_img"
                />
              </div>
              <div className="flex-1">
                <div>{product?.product_sn}</div>
                <div className="">
                  <span>
                    {product?.dprod_unit_qty} x {quantity}
                  </span>
                  <span className="ml-10">
                    <span>₹ {product?.offer_price}</span>
                    <span className="line-through ml-3">
                      ₹ {product?.selling_price}
                    </span>
                  </span>
                </div>
              </div>
              <div
                onClick={() => handleEditOpen(record)}
                className="cursor-pointer"
              >
                <i class="fas fa-pencil-alt"></i>
              </div>
            </div>
            <div
              className={` ${
                activeTab ? "bg-[#fc8172]" : "bg-gray-400"
              }  text-white`}
              style={{ fontSize: "12px", padding: "4px" }}
            >
              <span>Daily Subscription</span>
              <span className="inline-flex items-center">
                <Dotted />
                <span>
                  Starting
                  <span className="ml-1">{start_date}</span>
                </span>
              </span>
              <span className="inline-flex items-center">
                <Dotted />
                <span className="break-word">
                  Ending
                  <span className="ml-1">{end_date}</span>
                </span>
              </span>
            </div>
          </div>
        );
      })}
      {/* <Modal
        open={modalData?.open}
        onOk={handleEdit}
        onCancel={handleOpenClose}
      >
        {modalData?.data.length == 0 ? null : (
          <div>
            {modalData.data.map((recordData) => {
              const { product, quantity } = recordData;
              return (
                <div>
                  <div className='flex justify-between space-x-2 p-2'>
                    <div className='m-1 p-2 border-2 border-gray-200'>
                      <img
                        src={
                          product?.images_list.length > 0
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
                          className='w-16'
                          options={quantityOptions.map((option) => ({
                            label: option,
                            value: option,
                          }))}
                        />

                        <span className='ml-10'>
                          <span>₹ {product?.offer_price}</span>
                          <span className='line-through ml-3'>
                            ₹ {product?.selling_price}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal> */}
      <SubscriptionEditModal
        modalData={modalData}
        handleEdit={handleEdit}
        handleOpenClose={handleOpenClose}
      />
    </div>
  );
};

const Dotted = () => (
  <span className="inline-flex mx-2 h-2 w-2 bg-white rounded-full"></span>
);

export default SubscriptionTabs;
