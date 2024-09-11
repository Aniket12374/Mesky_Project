import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/customerOrders/CustomerOrderService";
import { Header } from "../../utils";
import { OrderDetails } from "./OrderDetails";
import { Pagination } from "antd";
import { useQuery } from "react-query";
import CustomerFilters, { AppliedFilters } from "./CustomerFilters";
import OrderDetailTile from "./OrderDetailTile";

const OrderListing = () => {
  const [orders, setOrders] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [orderModal, setOrderModal] = useState({
    open: false,
    data: {},
    address: {},
  });
  const [finalFilters, setFinalFilters] = useState({});
  // const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const [address, setAddress] = useState({});
  const [totalCount, setTotalCount] = useState(2000);
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);

  const closeModal = () => setFilterModalOpen((prev) => !prev);
  const closeOrderModal = () =>
    setOrderModal((prev) => ({
      ...prev,
      open: !prev?.open,
    }));

  const { isLoading: isSearchLoading } = useQuery(
    ["getOrders", currentPage, size, finalFilters],
    () => getOrders(currentPage, size, finalFilters),
    {
      enabled: shouldFetch, // Only fetch when shouldFetch is true
      keepPreviousData: true, // This keeps the old data until the new one arrives
      onSuccess: (res) => {
        setShouldFetch(false);
        setAddress(res?.data?.address_info);
        const finalOrders = res?.data?.order_details.filter(
          (x) => x?.status === "Order Delivered"
        );
        // setOrders(res?.data?.order_details);
        setOrders(finalOrders);
        setTotalCount(res?.data?.totalcount);
      },
    }
  );

  const removeFilter = (key) => {
    let modifiedFilters = {};
    Object.keys(finalFilters)
      .filter((x) => x !== key)
      .forEach((x, index) => {
        modifiedFilters[x] = finalFilters[x];
      });

    setFinalFilters(modifiedFilters);
    setShouldFetch(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShouldFetch(true);
  };

  const pageSizeOptions = ["10", "20", "50", "100", "250", "500"];

  const handlePageSizeChange = (current, page) => {
    setSize(page);
    setCurrentPage(1);
    setShouldFetch(true);
  };

  const orderTileClassName = orderModal?.open
    ? "h-[95vh] overflow-y-auto"
    : "h-[80vh] overflow-y-auto";

  return (
    <div className="w-1/3 border-2 border-gray-200">
      <div className="flex">
        <Header text="Order History" className="m-2" />
        <input
          type="text"
          onClick={() => setFilterModalOpen(true)}
          onChange={closeModal}
          className="border-b-2 border-gray-300 w-32 ml-10 focus:outline-none"
          placeholder="Search"
        />
      </div>
      <AppliedFilters finalFilters={finalFilters} removeFilter={removeFilter} />

      {filterModalOpen && (
        <CustomerFilters
          open={filterModalOpen}
          closeModal={closeModal}
          modal={"order"}
          setShouldFetch={setShouldFetch}
          finalFilters={finalFilters}
          setFinalFilters={setFinalFilters}
        />
      )}
      <div>
        <div className={orderTileClassName}>
          {orderModal?.open ? (
            <OrderDetails
              data={orderModal?.data}
              closeOrderModal={closeOrderModal}
              address={address}
            />
          ) : (
            orders?.map((order) => (
              <OrderDetailTile
                productName={order?.orderitem_info?.product_sn}
                quantity={order?.orderitem_info?.quantity}
                date={order?.date}
                price={order?.total_price}
                unitQuantity={order?.orderitem_info?.dprod_unit_qty}
                orderId={order?.orderitem_info?.uid?.slice(
                  0,
                  order?.orderitem_info?.uid.length - 3
                )}
                status={order?.status}
                record={order}
                setOrderModal={setOrderModal}
              />
            ))
          )}
        </div>
        {/* <CustomerPopup
          open={modalOpen}
          closeModal={closeModal}
          modal={"order"}
        /> */}

        {!orderModal?.open ? (
          <div className="flex justify-end px-4 py-2 order-listing">
            <Pagination
              current={currentPage}
              total={totalCount}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${totalCount} items`
              }
              showQuickJumper
              onChange={handlePageChange}
              showSizeChanger={true}
              pageSizeOptions={pageSizeOptions}
              onShowSizeChange={handlePageSizeChange}
              disabled={isSearchLoading}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderListing;
