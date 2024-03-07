import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import classNames from "classnames";
import moment from "moment/moment";
import CommonHeaders from "./CommonHeaders";
import Button from "../Common/Button";
import ShippingLabel from "./ShippingLabel";

import DownloadImg from "../../assets/order-tabs/download-colored.svg";
import PrintImg from "../../assets/order-tabs/print-colored.svg";
import DeliveryImg from "../../assets/order-tabs/delivery-colored.svg";
import DeliveryGreyImg from "../../assets/order-tabs/delivery-grey.svg";
import ReturnImg from "../../assets/order-tabs/return.png";

import {
  generateShippingLabelService,
  orderPickedup,
  getOrderInvoice,
  orderReturned,
} from "../../services/order/orderService";

const modifyDate = (date) => {
  const year = date ? date.split("-").pop() : " ";
  let modifiedyr = date ? year.slice(2) : "";
  let modifiedDate = date ? date.replace(year, modifiedyr) : "";
  return modifiedDate;
};

const OrderHeaders = (tab, orderData = {}, names) => {
  const { delivery_status: status, returned_date: returnedDate } = orderData;
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [cancellationModalOpen, setCancellationModalOpen] = useState(false);
  const [cancellationOrderData, setCancellationOrderData] = useState({});
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const [dispatchRecord, setDispatchRecord] = useState({});
  const [returnRecord, setReturnRecord] = useState({});
  const [shippingLabelData, setShippingLabelData] = useState({});

  const shippingLabelRef = useRef();
  const queryClient = useQueryClient();

  const handlePrintShippingLabel = (e, order) => {
    e.preventDefault();
    generateShippingLabelService(order.uid).then((res) => {
      setShippingLabelData(res);
      handlePrint();
    });
  };

  const handlePrint = useReactToPrint({
    content: () => shippingLabelRef.current,
  });

  const handleDownloadInvoice = (e, orderItem) => {
    e.preventDefault();
    const { invoice_link: invoiceLink, uid } = orderItem;
    invoiceLink
      ? window.open(invoiceLink, "_blank")
      : getOrderInvoice(uid)
          .then((res) => {
            //do the needful
          })
          .catch((err) => {});
  };

  const invoiceBtn = (icon = false, record, btnName = "") =>
    icon ? (
      <button
        title="Download Invoice"
        className="non-redirectable ml-3"
        onClick={(e) => handleDownloadInvoice(e, record)}
      >
        <img src={DownloadImg} alt="download-image" className="w-10 h-10" />
      </button>
    ) : (
      <Button
        className="ml-5"
        btnName={btnName}
        onClick={(e) => handleDownloadInvoice(e, orderData)}
      />
    );

  const handleDispatchOk = () => {
    const { id } = dispatchRecord;
    id &&
      orderPickedup(id)
        .then((res) => {
          setDispatchModalOpen(false);
          queryClient.invalidateQueries(["OpenOrders"]);
          toast.success("Order pickedup successfully.", {
            position: "bottom-right",
          });
        })
        .catch((err) => setDispatchModalOpen(false));
  };

  const handleCancelOrder = (e, record) => {
    e.preventDefault();
    setCancellationModalOpen(true);
    setCancellationOrderData(record);
  };

  const handleReturnOk = () => {
    const { id } = returnRecord;
    id &&
      orderReturned(id)
        .then((res) => {
          setReturnModalOpen(false);
          queryClient.invalidateQueries(["ReturnedOrders"]);
          toast.success("Order returned successfully.", {
            position: "bottom-right",
          });
        })
        .catch((err) => setReturnModalOpen(false));
  };

  const handleDispatch = (e, record) => {
    e.preventDefault();
    setDispatchModalOpen(true);
    setDispatchRecord(record);
  };

  const handleReturn = (e, record) => {
    e.preventDefault();
    setReturnRecord(record);
    setReturnModalOpen(true);
  };

  const headers = {
    Open: [
      {
        title: "PICKUP DATE",
        dataIndex: "pickup_request_date",
        key: "pickup_request_date",
        align: "center",
        width: 120,
        render: (pickup_request_date) => {
          let reqDate = modifyDate(pickup_request_date);
          return !reqDate ? (
            <div className="text-red-600">Pickup scheduled at</div>
          ) : (
            reqDate
          );
        },
        enabled: "Open",
      },
      {
        title: "ACTION",
        dataIndex: "action",
        key: "action",
        align: "center",
        width: 150,
        enabled: "Open",
        render: (_, record) => {
          const { delivery_status: status, pickup_request_date: date } = record;
          return (
            <div className="non-redirectable flex items-center">
              <div className="hidden">
                {shippingLabelData
                  ? Object.keys(shippingLabelData).length > 1 && (
                      <ShippingLabel
                        ref={shippingLabelRef}
                        data={shippingLabelData}
                      />
                    )
                  : null}
              </div>
              <button
                onClick={(e) => handlePrintShippingLabel(e, record)}
                title="Print Shipping Label"
                className="non-redirectable ml-2 mt-2"
              >
                <img src={PrintImg} alt="print-image" className="w-14 h-10" />
              </button>
              <button
                onClick={(e) => handleDispatch(e, record)}
                title={
                  status === "PICKED UP" ? "Dispatched" : "Mark as Dispatched"
                }
                disabled={status === "PICKED UP" || !date}
                className="non-redirectable ml-3 mt-2"
              >
                <img
                  src={
                    status === "PICKED UP" || !date
                      ? DeliveryGreyImg
                      : DeliveryImg
                  }
                  alt="delivery-image"
                  className="non-redirectable w-14 h-10"
                />
              </button>
              {invoiceBtn(true, record)}
              <button
                className="ml-3 text-[#FF9494]"
                onClick={(e) => handleCancelOrder(e, record)}
              >
                <span className="text-3xl">x</span>
              </button>
            </div>
          );
        },
      },
    ],
    Cancelled: [
      {
        title: "CANCELLATION DATE",
        dataIndex: "cancelled_date",
        key: "cancelled_date",
        align: "center",
        width: 100,
        render: (cancelled_date) => {
          const date = new Date(cancelled_date);
          return (
            <div className="flex items-center">{moment(date).format("ll")}</div>
          );
        },
      },
    ],
    Delivered: [
      {
        title: "DELIVERY DATE",
        dataIndex: "delivery_date",
        key: "delivery_date",
        align: "center",
        width: 120,
        render: (_, record) => {
          const { delivery_date: date } = record;
          const deliveredDate = date ? date.split(" ")[0] : "";
          return (
            <div>
              <div>{moment(deliveredDate).format("ll")}</div>
              {invoiceBtn(true, record)}
            </div>
          );
        },
      },
    ],
    Returns: [
      {
        title: "RETURN INITIATED",
        dataIndex: "action",
        key: "action",
        align: "center",
        width: 100,
        render: (_, record) => <div>Date needed</div>,
      },
      {
        title: "RETURN RECEIVED",
        dataIndex: "action",
        key: "action",
        align: "center",
        width: 100,
        render: (_, record) => {
          let returnedDate = modifyDate(record.returned_date);
          return returnedDate ? (
            <div>
              {returnedDate}
              {invoiceBtn(true, record)}
            </div>
          ) : (
            <button onClick={(e) => handleReturn(e, record)}>
              <img src={ReturnImg} alt="return-received" />
            </button>
          );
        },
      },
    ],
    Completed: [
      {
        title: "DELIVERY DATE",
        dataIndex: "delivery_date",
        key: "delivery_date",
        align: "center",
        width: 100,
        render: (_, record) => {
          const { delivery_date: date } = record;
          const deliveryDate = date ? date.split(" ")[0] : "";
          return <span>{moment(deliveryDate).format("ll")}</span>;
        },
      },
      {
        title: "PAYMENT DATE",
        dataIndex: "created_date",
        key: "created_date",
        align: "center",
        width: 120,
        render: (_, record) => {
          let paymentDate = modifyDate(record.created_date);
          return (
            <div className="flex items-center">
              <div className="mr-1">{paymentDate.split(" ")[0]}</div>
              {invoiceBtn(true, record)}
            </div>
          );
        },
      },
    ],
    All: [
      {
        title: "STATUS",
        dataIndex: "delivery_status",
        key: "delivery_status",
        width: 150,
        render: (delivery_status) => (
          <div className="flex items-center">{delivery_status}</div>
        ),
      },
    ],
  };

  const detailPageButtons = {
    Open: [
      <Button
        onClick={(e) => handlePrintShippingLabel(e, orderData)}
        className="ml-5"
        btnName={"Print Shipping Label"}
      />,
      <Button
        onClick={(e) => handleDispatch(e, orderData)}
        disabled={status === "PICKED UP"}
        className="ml-5"
        btnName={"Mark as Dispatched"}
        cancelBtn={status === "PICKED UP"}
      />,
      invoiceBtn(false, orderData, "Download Order Invoice"),
      <Button
        btnName={"Cancel Order"}
        cancelBtn
        onClick={(e) => handleCancelOrder(e, orderData)}
      />,
    ],
    Delivered: [invoiceBtn(false, orderData, "Print Order Invoice")],
    Returns: [
      <Button
        onClick={(e) => handleReturn(e, orderData)}
        btnName={"Mark as Received"}
        className={classNames("ml-5", {
          hidden: returnedDate,
        })}
      />,
      invoiceBtn(false, orderData, "Download Return Order Invoice"),
    ],
    Cancelled: [],
    Completed: [invoiceBtn(false, orderData, "Download Payment Invoice")],
    All: [],
  };

  return {
    headers: (data) => [...CommonHeaders(data, names), ...headers[tab]],
    buttons: detailPageButtons[tab],
    isDispatchedModalOpen: dispatchModalOpen,
    isCancellationModalOpen: cancellationModalOpen,
    setDispatchedModalOpen: setDispatchModalOpen,
    setCancellationModalOpen,
    handleDispatchOk,
    isReturnedModalOpen: returnModalOpen,
    setReturnedModalOpen: setReturnModalOpen,
    handleReturnOk,
    cancellationOrderData,
  };
};

export default OrderHeaders;
