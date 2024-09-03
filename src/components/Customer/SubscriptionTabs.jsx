import React, { useEffect, useState } from "react";
import { Header } from "../../utils";
import { getSubscriptions } from "../../services/customerInfo/CustomerInfoService";
import { Tabs } from "antd";

function SubscriptionTabs() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className='w-1/3 border-2 border-gray-200'>
      <Header text='Subscription' className='m-2' />
      <div className='ml-2'>
        <Tabs
          defaultActiveKey={1}
          onTabClick={(key) => setActiveTab(Number(key))}
          items={[
            {
              label: "Active",
              key: "1",
              children: <SubscriptionData tab={1} />,
            },
            {
              label: "Inactive",
              key: "2",
              children: <SubscriptionData tab={2} />,
            },
          ]}
        />
      </div>
    </div>
  );
}

const SubscriptionData = ({ tab }) => {
  const [tabData, setTabData] = useState([]);
  useEffect(() => {
    getSubscriptions(tab == 1 ? true : false).then((res) => {
      console.log({ res });
      setTabData(res?.data);
    });
  }, []);

  const activeTab = tab === 1;

  return (
    <div>
      {tabData.map(({ product, quantity, dates_range }) => (
        <div className='m-3 shadow-2xl rounded-lg'>
          <div className='flex justify-between space-x-2 p-2'>
            <div className='m-1 p-2 border-2 border-gray-200'>
              <img
                src={
                  product?.images_list.length > 0
                    ? product?.images_list[0]
                    : null
                }
                width={50}
                height={50}
                className='rounded-lg'
                alt='sub_img'
              />
            </div>
            <div className='flex-1'>
              <div>{product?.product_sn}</div>
              <div className=''>
                <span>
                  {product?.dprod_unit_qty} x {quantity}
                </span>
                <span className='ml-10'>
                  <span>₹ {product?.offer_price}</span>
                  <span className='line-through ml-3'>
                    ₹ {product?.selling_price}
                  </span>
                </span>
              </div>
            </div>
            <div className=''>
              <i class='fas fa-pencil-alt'></i>
            </div>
          </div>
          <div
            className={` ${
              activeTab ? "bg-[#fc8172]" : "bg-gray-400"
            } flex text-white`}
            style={{ fontSize: "12px", padding: "4px" }}
          >
            <div>Daily Subscription</div>
            <div className='flex items-center'>
              <Dotted />
              <span>Starting {dates_range[0]["start_date"]}</span>
            </div>
            <div className='flex items-center'>
              <Dotted />
              <span>Ending {dates_range[0]["end_date"]}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Dotted = () => <div className='mx-2 h-2 w-2 bg-white rounded-full'></div>;

export default SubscriptionTabs;
