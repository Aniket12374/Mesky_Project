import React, { useEffect, useState } from "react";
import { customerInfo } from "../../services/customerInfo/CustomerInfoService";
import { Switch, notification } from "antd";
import moment from "moment";
import { SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Transactions from "./Transactions";

const CustomerInformation = () => {
  const [details, setDetails] = useState({});

  useEffect(() => {
    customerInfo()
      .then((res) => {
        setDetails(res?.data);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);

  const addressData = details?.address_info?.find(
    (x) => x.address_name !== null
  );

  return (
    <div>
      <div className="flex space-x-2">
        {details?.customer_info && (
          <CustomerDetails
            info={details?.customer_info}
            address={addressData}
          />
        )}
        {addressData && <DeliveryInstruction address={addressData} />}
        {details?.wallet_info && (
          <WalletBalanceTransaction walletData={details?.wallet_info} />
        )}
      </div>
    </div>
  );
};

const CustomerDetails = ({ info, address }) => {
  const { default_email, first_name, last_name, id, default_mobile_number } =
    info;
  const data = {
    Mobile: default_mobile_number,
    Email: default_email,
    "Customer Id": id,
  };

  return (
    <div className="w-1/3 border-2 border-gray-200">
      <div className="flex justify-between space-x-10 border-b-2 border-gray-200 p-2">
        <div className="font-semibold text-lg">Account Info</div>
        <div>Edit</div>
      </div>
      <div className="customer-name flex space-x-3 m-5 items-center">
        <div className="w-12 h-12 rounded-full bg-[#FB8171] p-3 text-white text-lg font-semibold flex items-center justify-center">
          {first_name[0].toUpperCase()}
          {last_name[0].toUpperCase()}
        </div>

        <div>
          <div>
            {first_name.toUpperCase()} {last_name.toUpperCase()}
          </div>
          <div>Since </div>
        </div>
      </div>
      <div className="customer-details m-5">
        {Object.keys(data).map((x, index) => (
          <div
            className="flex justify-between items-center space-y-2 space-x-5"
            key={index}
          >
            <div className="text-gray-500">{x}</div>
            <div className="break-word">{data[x]}</div>
          </div>
        ))}
      </div>
      <div className="customer-address m-5">
        <div>Delivery Address</div>
        <div>
          {address?.line_1}, {address?.line_2}, {address?.line_3},{" "}
          {address?.city}-{address?.pincode}, {address?.state}
        </div>
      </div>
    </div>
  );
};

const DeliveryInstruction = ({ address }) => {
  const [checked, setChecked] = useState(address?.misc_info?.via_ring_the_bell);
  return (
    <div className="flex flex-col items-center border-2 border-gray-200 w-1/3">
      <div className="w-full p-3 text-center text-lg font-semibold border-b-2 border-gray-200">
        Delivery Instructions
      </div>
      <div className="my-5">
        Ring the Bell{" "}
        <Switch
          size="default"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="ml-5"
        />
      </div>
      <button className="mb-3 orange-btn" onClick={null}>
        Update
      </button>
    </div>
  );
};

const WalletBalanceTransaction = ({ walletData }) => {
  const { current_balance, recharges } = walletData;
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const navigateHandler = () => navigate("/customer/transactions");
  const openNotification = (filters = {}) => {
    api.open({
      duration: null,
      bottom: 50,
      message: "",
      description: (
        <div className="w-full mt-10">
          <Transactions
            showSearch={false}
            filters={filters}
            showBorder={false}
          />
        </div>
      ),
    });
  };

  return (
    <div className="w-1/3">
      <div className="customer-current-balance bg-[#EAF6FE] p-3 mb-5 rounded-lg">
        <div className="flex justify-between">
          <div className="font-semibold text-lg">₹ {current_balance}</div>
          {contextHolder}
          <div
            className="text-[#7F39FB] text-sm font-semibold cursor-pointer"
            onClick={() => openNotification()}
          >
            See More
          </div>
        </div>
        <div className="text-lg text-gray-500">Wallet Balance</div>
      </div>
      <div className="customer-last-recharges border-2 border-gray-200">
        <div className="customer-last-recharge-heading p-2 border-b-2 border-gray-200">
          <div className="flex justify-between">
            <div className="font-semibold text-lg">Last 3 Recharges</div>
            <div
              className="text-[#7F39FB] text-sm font-semibold cursor-pointer"
              onClick={() =>
                openNotification({
                  transaction_type: "credit",
                })
              }
            >
              See More
            </div>
          </div>
        </div>
        {recharges.map((recharge, index) => {
          const date = recharge?.created_date.split(" ")[0];
          return (
            <div
              className="flex justify-between items-center space-y-2 space-x-5 px-2"
              key={index}
            >
              <div className="text-gray-500">
                {moment(date, "DD-MM-YYYY").format("MMMM D, YYYY")}
              </div>
              <div className="break-word font-semibold text-lg">
                ₹ {recharge?.transaction_amount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerInformation;
