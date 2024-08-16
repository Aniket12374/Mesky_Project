import { Modal } from "antd";
import React, { useEffect } from "react";
import { refundProcess } from "../../services/subscriptionOrders/subscriptionService";
import toast from "react-hot-toast";
import { set } from "react-hook-form";

function RefundModal({ change, setChange, handleModalRef }) {
  const {
    refAmount,
    refundModalOpen,
    reason,
    modalData: { item_uid, customer_name, phone_number, OrderValue },
  } = change;

  const refundReasons = [
    "Select Reason",
    "Qty Change Error on App",
    "Delivery Rider Error",
    "Item Delivered in Bad Condition (Dairy)",
    "Item Delivered in Bad Condition (Non-Dairy)",
    "Poor Product Quality",
    "Marked Delivered But Not Received",
    "Short Qty received",
    "Leakage",
    "Spoilt",
    "Expired Received",
  ];

  useEffect(() => {
    if (refundModalOpen) {
      setChange((prevChange) => ({
        ...prevChange,
        reason: refundReasons[0],
      }));
    }
  }, [refundModalOpen]);

  const handleSubmitChangeRef = () => {
    const refundPayload = {
      amount: refAmount,
      reason: reason,
      item_uid: item_uid,
    };

    if (reason.length > 500) {
      toast.error("Please add a proper short reason.");
      return;
    }

    if (reason.length < 3 || reason === "" || reason == "Select Reason") {
      toast.error("Please add a proper reason.");
      return;
    }

    if (refAmount > OrderValue) {
      toast.error("Refund Amount should be lesser than the Order amount.");
      return;
    }

    if (!refAmount || refAmount <= 0) {
      toast.error("Please add a proper refund amount.");
      return;
    }

    refundProcess(refundPayload)
      .then((res) => {
        toast.success(res?.data?.message);
        setChange((prev) => ({
          ...prev,
          refundModalOpen: false,
          refAmount: "",
          reason: "",
        }));
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setChange((prev) => ({
          ...prev,
          refAmount: "",
          reason: "",
        }));
      });
  };

  return (
    <div>
      <Modal
        style={{ fontFamily: "Fredoka, sans-serif" }}
        title="Refund Amount"
        titleColor="#9c29c1"
        open={refundModalOpen}
        onCancel={() => handleModalRef({})} // Closing modal with empty object
        width={700}
        okText="Refund"
        onOk={handleSubmitChangeRef}
        centered
      >
        <div>
          <span>Item UID:</span>
          <span className="font-bold ml-2">{item_uid}</span>
        </div>
        <div>
          <span>Customer Name:</span>
          <span className="font-bold ml-2">{customer_name}</span>
        </div>
        <div>
          <span>Customer Phone Number:</span>
          <span className="font-bold ml-2">{phone_number}</span>
        </div>
        <div>
          <span>Order Amount:</span>
          <span className="font-bold ml-2">₹ {OrderValue}</span>
        </div>
        <div>
          <span>Select reason:</span>
          <select
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm border-blue-400 bg-white text-gray-700"
            onChange={(e) => setChange({ ...change, reason: e.target.value })}
            value={reason}
          >
            {refundReasons.map((item, index) => (
              <option key={index} value={item} hidden={index == 0}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="font-bold text-lg mt-3 text-[#df4584]">
          Please Add Refund Amount
        </div>
        <div className="mt-3 flex space-x-5">
          <div className="flex space-x-2 items-center">
            <div className="text-[#ffa500] font-medium pb-1">
              Refund Amount:
            </div>
            <div className="text-center flex">
              <input
                type="number"
                className="text-center font-medium w-full h-8 rounded-lg border-2 border-black p-2"
                value={refAmount}
                min={1}
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    refAmount: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RefundModal;
