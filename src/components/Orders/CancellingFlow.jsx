import React, { useState, useEffect } from "react";
import { Checkbox, Modal, Input } from "antd";
import classNames from "classnames";
import { toast } from "react-hot-toast";
import { orderCancel } from "../../services/order/orderService";

const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

const cancellingReasons = [
  "Product out of Stock",
  "Warehouse Closed",
  "Not in business anymore",
  "Others",
];

const CancellingFlow = ({ isOpen, setIsOpen, orderDetails }) => {
  const [reason, setReason] = useState("");
  const [reasonOther, setReasonOther] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setReason("");
    setReasonOther("");
  }, []);

  const onSubmit = () => {
    const cancelOrderData = {
      uid: orderDetails.uid,
      reason:
        reason && reason[0]
          ? reason[0] === "Others"
            ? reasonOther
            : reason[0]
          : "",
    };

    orderCancel(cancelOrderData)
      .then((res) => {
        setReason("");
        setReasonOther("");
        setShowMessage(true);
      })
      .catch((err) => {
        toast.success(err?.response?.data?.message, {
          position: "bottom-right",
        });
        setReason("");
        setReasonOther("");
        setShowMessage(false);
      });
  };

  const onClose = () => {
    setIsOpen(false);
    setShowMessage(false);
  };

  const onCancel = () => {
    setIsOpen(false);
    setReason("");
    setReasonOther("");
  };

  const disabledBtn =
    (reason && reason[0] === "") ||
    reason === "" ||
    (reason && reason[0] === "Others" && reasonOther === "");
  return (
    <Modal
      open={isOpen}
      centered
      width={800}
      bodyStyle={{
        padding: "15px",
      }}
      footer={
        !showMessage ? (
          <div className="campaign-aggrement-buttons text-center space-x-4 mt-3">
            <button
              className={classNames("text-white rounded-lg p-2 w-20", {
                "bg-gray-400 hover:bg-gray-400": disabledBtn,
                "bg-[#65CBF3] hover:bg-[#65CBF3]": !disabledBtn,
              })}
              onClick={onSubmit}
              disabled={disabledBtn}
            >
              Submit
            </button>
            <button
              className="bg-gray-400 text-white rounded-lg p-2 w-20"
              onClick={onCancel}
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <button
              className="bg-gray-400 text-white rounded-lg p-2 w-20"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )
      }
    >
      {!showMessage ? (
        <React.Fragment>
          <div className={`text-3xl font-semibold my-5 fredoka-600`}>
            Why are you cancelling the order?
          </div>
          <CheckboxGroup
            options={cancellingReasons}
            defaultValue={"Others"}
            value={reason ? reason[0] : ""}
            className="flex flex-col cancelling-orders"
            onChange={(val) => setReason(val)}
          />
          <div>
            {reason && reason[0] === "Others" ? (
              <div className="text-center">
                <TextArea
                  className="border-2 border-sky-400 rounded-lg mt-5 p-3"
                  autoSize={{
                    minRows: 4,
                    maxRows: 6,
                  }}
                  cols={80}
                  onChange={(e) => setReasonOther(e.target.value)}
                >
                  {reasonOther}
                </TextArea>
              </div>
            ) : null}
          </div>
        </React.Fragment>
      ) : (
        <div>
          <div>Order is Cancelled</div>
        </div>
      )}
    </Modal>
  );
};

export default CancellingFlow;
