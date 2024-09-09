import React, { useEffect, useState } from "react";
import {
  customerInfo,
  updateInfo,
} from "../../services/customerInfo/CustomerInfoService";
import { Modal, Switch, notification } from "antd";
import moment from "moment";
import { SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Transactions from "./Transactions";
import AddressForm from "./AddressForm";
import Address from "./AddressMap";
import toast from "react-hot-toast";

const CustomerInformation = () => {
  const [details, setDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
    setShowNext(false);
  };

  useEffect(() => {
    customerInfo()
      .then((res) => {
        setDetails(res?.data);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [modalOpen]);

  const addressData = details?.address_info?.find(
    (x) => x.address_name !== null
  );

  console.log({ addressData });

  const addressFormData = {
    is_only_misc: false,
    ...addressData,
    address_id: addressData?.id,
  };

  return (
    <div>
      <div className="flex space-x-2">
        {details?.customer_info && (
          <CustomerDetails
            info={details?.customer_info}
            address={addressData}
            setModalOpen={setModalOpen}
          />
        )}
        {addressData && <DeliveryInstruction address={addressData} />}
        {details?.wallet_info && (
          <WalletBalanceTransaction walletData={details?.wallet_info} />
        )}
        <Modal
          open={modalOpen}
          onOk={null}
          onCancel={closeModal}
          width={580}
          footer={null}
        >
          {/* <Address
            url={
              "https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&libraries=places&v=weekly"
            }
            data={addressFormData}
            showNext={showNext}
            setShowNext={setShowNext}
          /> */}
          <AddressForm data={addressFormData} closeModal={closeModal} />
        </Modal>
      </div>
    </div>
  );
};

const CustomerDetails = ({ info, address, setModalOpen }) => {
  const { default_email, first_name, last_name, id, default_mobile_number } =
    info;
  localStorage.setItem("addressId", info?.id);
  const data = {
    Mobile: default_mobile_number,
    Email: default_email,
    "Customer Id": id,
  };

  return (
    <div className="w-1/3 border-2 border-gray-200">
      <div className="flex justify-between space-x-10 border-b-2 border-gray-200 p-2">
        <div className="font-semibold text-lg">Account Info</div>
        <button onClick={() => setModalOpen(true)}>
          <i class="fas fa-pencil-alt"></i>
        </button>
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
  const [checked, setChecked] = useState(
    address?.misc_info?.address_preferences?.via_ring_the_bell
  );
  const [btnHl, setBtnHl] = useState(false);

  const updateRTBOption = () => {
    updateInfo(payload)
      .then((res) => {
        toast.success("Updated Successfully");
        setBtnHl(false);
      })
      .catch((err) => {
        toast.error("Updated is not Successfully!");
      });
  };

  const payload = {
    is_only_misc: true,
    address_id: address?.id,
    default_email: address?.default_email,
    misc_info: {
      address_preferences: {
        via_ring_the_bell: checked,
      },
    },
  };
  console.log({ checked, btnHl });
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
          onChange={() => {
            setChecked(!checked);
            setBtnHl(true);
          }}
          className="ml-5 border-2 border-gray-200"
        />
      </div>
      <button
        className={`mb-3 ${
          btnHl ? "orange-btn" : "bg-gray-200 w-32 p-2 rounded-lg"
        }`}
        onClick={updateRTBOption}
      >
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
      right: 0,
      style: {
        width: 530,
        right: 0,
      },
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
