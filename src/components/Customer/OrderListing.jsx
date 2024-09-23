import React, { useEffect, useState } from "react";
import { Input, Pagination } from "antd";
import { useQuery } from "react-query";
import { OrderDetails } from "./OrderDetails";
import CustomerFilters from "./CustomerFilters";
import OrderDetailTile from "./OrderDetailTile";
import { OrderTnxHeader } from "./CustomerConstants";
import { getOrders } from "../../services/customerOrders/CustomerOrderService";
import NewOrderCreation from "./NewOrderCreation";
import { setCookie } from "../../services/cookiesFunc";

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
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);

  const handleCloseOC = () => setCreateOrderModalOpen((prev) => !prev);

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
      enabled: shouldFetch,
      keepPreviousData: true,
      onSuccess: (res) => {
        setShouldFetch(false);
        let tmrOrders = res?.data?.order_details.filter(
          (x) => x?.status == "ACCEPTED"
        );
        let orderVal = 0;
        tmrOrders.forEach((order) => {
          orderVal = orderVal + order.orderitem_info.total_price;
        });

        setCookie("currentOrderVal", orderVal);
        setAddress(res?.data?.address_info);
        const finalOrders = res?.data?.order_details.filter((x) => x?.status);
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
    (!createOrderModalOpen || !orderModal.open) && refetch();
  }, [token, createOrderModalOpen, orderModal]);

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
    : orderModal?.open
    ? "h-[525px] overflow-y-auto"
    : "h-[400px] overflow-y-auto";

  return (
    <div className='w-1/3 border-2 border-gray-200'>
      <OrderTnxHeader
        showSearch={true}
        name={"Order History"}
        setModalOpen={setFilterModalOpen}
        placeholder={"Search by Order Id, product name.."}
        handleOC={handleCloseOC}
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
                price={order?.orderitem_info?.total_price}
                unitQuantity={order?.orderitem_info?.dprod_unit_qty}
                orderId={order?.orderitem_info?.uid?.slice(
                  0,
                  order?.orderitem_info?.uid.length - 3
                )}
                status={order?.status}
                record={order}
                setOrderModal={setOrderModal}
                setFilterModalOpen={setFilterModalOpen}
              />
            ))
          )}
        </div>

        {!orderModal?.open ? (
          <div className='px-4 py-2 order-listing'>
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
        <NewOrderCreation open={createOrderModalOpen} onClose={handleCloseOC} />
      </div>
    </div>
  );
};

export default OrderListing;
