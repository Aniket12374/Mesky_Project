import React, { useEffect, useState } from "react";
import { Input, Pagination } from "antd";
import { useQuery } from "react-query";
import { OrderDetails } from "./OrderDetails";
import CustomerFilters from "./CustomerFilters";
import OrderDetailTile from "./OrderDetailTile";
import { OrderTnxHeader } from "./CustomerConstants";
import { getOrders } from "../../services/customerOrders/CustomerOrderService";

const OrderListing = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [orderModal, setOrderModal] = useState({
    open: false,
    data: {},
    address: {},
  });
  const [finalFilters, setFinalFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  // const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const [address, setAddress] = useState({});
  const [totalCount, setTotalCount] = useState(2000);
  const [shouldFetch, setShouldFetch] = useState(true);

  const closeModal = () => setFilterModalOpen((prev) => !prev);
  const closeOrderModal = () =>
    setOrderModal((prev) => ({
      ...prev,
      open: !prev?.open,
    }));

  const { isLoading: isSearchLoading, refetch } = useQuery(
    [`getOrders_${token}`, currentPage, size, finalFilters, token],
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
        setOrders(finalOrders);
        setTotalCount(res?.data?.totalcount || 0);
      },
      onError: () => {
        setShouldFetch(false);
        setTotalCount(0);
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [token]);

  const removeFilter = (key) => {
    let modifiedFilters = {};
    Object.keys(finalFilters)
      .filter((x) => x !== key)
      .forEach((x, index) => {
        modifiedFilters[x] = finalFilters[x];
      });

    setFinalFilters(modifiedFilters);
    setAppliedFilters(modifiedFilters);
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

  const handleClear = () => {
    setShouldFetch(true);
    setFinalFilters({});
    setAppliedFilters({});
    setFilterModalOpen(false);
  };

  const orderTileClassName = filterModalOpen
    ? "h-[200px] overflow-y-auto"
    : "h-[400px] overflow-y-auto";

  return (
    <div className='w-1/3 border-2 border-gray-200'>
      <OrderTnxHeader
        showSearch={true}
        name={"Order History"}
        setModalOpen={setFilterModalOpen}
        placeholder={"Search by Order Id, product name.."}
      />

      <CustomerFilters
        open={filterModalOpen}
        closeModal={closeModal}
        modal={"order"}
        setShouldFetch={setShouldFetch}
        finalFilters={finalFilters}
        setFinalFilters={setFinalFilters}
        removeFilter={removeFilter}
        setAppliedFilters={setAppliedFilters}
        appliedFilters={appliedFilters}
        clear={handleClear}
      />

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

        {!orderModal?.open ? (
          <div className='flex justify-end px-4 py-2 order-listing'>
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
