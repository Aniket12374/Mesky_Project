import React, { useEffect, useState } from "react";
import {
  customerInfo,
  updateInfo,
} from "../../services/customerInfo/CustomerInfoService";
import { Modal, Switch, notification } from "antd";
import moment from "moment";
import Transactions from "./Transactions";
import AddressForm from "./AddressForm";
// import Address from "./AddressMap";
import toast from "react-hot-toast";

const CustomerInformation = ({ token }) => {
  const [details, setDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  // const [showNext, setShowNext] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
    // setShowNext(false);
  };

  useEffect(() => {
    customerInfo()
      .then((res) => setDetails(res?.data))
      .catch((err) => console.log({ err }));
  }, [modalOpen, token]);

  const addressData = details?.address_info?.find(
    (x) => x.address_name !== null
  );

  const addressPayload = {
    is_only_misc: false,
    ...addressData,
    address_id: addressData?.id,
  };

  const { customer_info: csrInfo = {}, wallet_info: walletInfo = {} } = details;

  return (
    <div className='flex space-x-2 mt-2'>
      <CustomerDetails
        info={csrInfo}
        address={addressData}
        setModalOpen={setModalOpen}
      />
      <DeliveryInstruction address={addressData} />
      <WalletBalanceTransaction walletData={walletInfo} />
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
            data={addressPayload}
            showNext={showNext}
            setShowNext={setShowNext}
          /> */}
        <AddressForm data={addressPayload} closeModal={closeModal} />
      </Modal>
    </div>
  );
};

const CustomerDetails = ({ info, address, setModalOpen }) => {
  const {
    default_email = "",
    first_name = "",
    last_name = "",
    id = "",
    default_mobile_number = "",
    created_date = new Date(),
  } = info;

  localStorage.setItem("addressId", info?.id);

  const data = {
    Mobile: default_mobile_number,
    Email: default_email,
    "Customer Id": id,
  };

  const fullName = `${first_name}  ${last_name}`;

  return (
    <div className='customer-information w-1/3 border-2 border-[#ebe8e8]'>
      <div className='flex justify-between space-x-10 border-b-2 border-gray-200 p-2'>
        <div className='font-semibold text-lg'>Account Info</div>
        <button onClick={() => setModalOpen(true)}>
          <i class='fas fa-pencil-alt'></i>
        </button>
      </div>
      <div className='customer-name flex space-x-3 m-5 items-center'>
        <div className='w-12 h-12 rounded-full bg-[#FB8171] p-3 text-white text-lg font-semibold'>
          {first_name ? first_name[0].toUpperCase() : ""}
          {last_name ? last_name[0].toUpperCase() : ""}
        </div>
        <div>
          <div>{fullName?.toUpperCase()}</div>
          <div className='gray-color text-sm'>
            Since {moment(created_date, "YYYY-MM-DD").format("ll")}
          </div>
        </div>
      </div>
      <div className='customer-details m-5'>
        {Object.entries(data)?.map(([key, value], index) => (
          <div
            className='flex justify-between items-center space-y-2 space-x-5'
            key={index}
          >
            <div className='text-gray-500'>{key}</div>
            <div className='break-word'>{value}</div>
          </div>
        ))}
      </div>
      <div className='customer-address m-5'>
        <div className='text-gray-500'>Delivery Address</div>
        <div className='text-sm'>
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

  const updateRTBOption = () => {
    updateInfo(payload)
      .then((res) => {
        toast.success("Updated Successfully");
        setBtnHl(false);
      })
      .catch((err) => toast.error("Updated is not Successfully!"));
  };

  return (
    <div className='customer-delivery-instructions flex flex-col items-center border-2 border-gray-200 w-1/3'>
      <div className='w-full p-3 text-center text-lg font-semibold border-b-2 border-gray-200'>
        Delivery Instructions
      </div>
      <div className='my-5'>
        Ring the Bell{" "}
        <Switch
          size='default'
          checked={checked}
          onChange={() => {
            setChecked(!checked);
            setBtnHl(true);
          }}
          className='ml-5 border-2 border-gray-200'
        />
      </div>
      <button
        className={`mb-3 ${btnHl ? "orange-btn" : "gray-btn p-2"}`}
        onClick={updateRTBOption}
      >
        Update
      </button>
    </div>
  );
};

const WalletBalanceTransaction = ({ walletData }) => {
  const { current_balance, recharges = [] } = walletData;
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (filters = {}, name) => {
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
        <div className='w-full mt-10'>
          <Transactions
            showSearch={false}
            filters={filters}
            showBorder={false}
            name={name}
          />
        </div>
      ),
    });
  };

  return (
    <div className='w-1/3'>
      <div className='customer-current-balance bg-[#EAF6FE] p-3 mb-5 rounded-lg'>
        <div className='flex justify-between'>
          <div className='font-semibold text-lg'>₹ {current_balance}</div>
          {contextHolder}
          <div
            className='text-[#7F39FB] text-sm font-semibold cursor-pointer'
            onClick={() => openNotification({}, "Transactions")}
          >
            See More
          </div>
        </div>
        <div className='text-lg text-gray-500 mt-2'>Wallet Balance</div>
      </div>
      <div className='customer-last-recharges border-2 border-gray-200'>
        <div className='customer-last-recharge-heading p-2 border-b-2 border-gray-200'>
          <div className='flex justify-between'>
            <div className='font-semibold text-lg'>Last 3 Recharges</div>
            <div
              className='text-[#7F39FB] text-sm font-semibold cursor-pointer'
              onClick={() =>
                openNotification(
                  {
                    transaction_type: "credit",
                  },
                  "Latest Wallet Recharges"
                )
              }
            >
              See More
            </div>
          </div>
        </div>
        {recharges?.map((recharge, index) => {
          const date = recharge?.created_date?.split(" ")[0];
          return (
            <div
              className='flex justify-between items-center space-y-2 space-x-5 px-2'
              key={index}
            >
              <div className='text-gray-500'>
                {moment(date, "DD-MM-YYYY").format("MMMM D, YYYY")}
              </div>
              <div className='break-word font-semibold text-lg'>
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
