import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import { useQuery } from "react-query";
import { OrderDetails } from "./OrderDetails";
import CustomerFilters from "./CustomerFilters";
import OrderDetailTile from "./OrderDetailTile";
import NewOrderCreation from "./NewOrderCreation";
import { OrderTnxHeader } from "./CustomerConstants";
import { getOrders } from "../../services/customerOrders/CustomerOrderService";
import { setCookieOrderVal } from "../../services/cookiesFunc";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(2000);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);

  const handleCloseOC = () => setCreateOrderModalOpen((prev) => !prev);

  const closeFilterModal = () => setFilterModalOpen((prev) => !prev);
  const closeOrderModal = () =>
    setOrderModal((prev) => ({
      ...prev,
      open: !prev?.open,
    }));

  const { isLoading: isSearchLoading, isFetching } = useQuery({
    queryKey: [`getOrders`, token, currentPage, size, finalFilters],
    queryFn: () => getOrders(currentPage, size, finalFilters),
    staleTime: 60 * 1000,
    onSuccess: (res) => {
      let orderCurrentVal = res?.data?.order_details
        .filter((x) => x?.status == "ACCEPTED")
        ?.reduce(
          (acc, curr) => acc + (curr.orderitem_info?.total_price || 0),
          0
        );

      setCookieOrderVal(orderCurrentVal);

      const finalOrders = res?.data?.order_details.filter((x) => x?.status);
      setOrders(finalOrders);
      setTotalCount(res?.data?.totalcount || 0);
    },
    onError: () => {
      setOrders([]);
      setTotalCount(0);
    },
  });

  useEffect(() => {
    setCurrentPage(1);
    setOrderModal((prev) => ({
      ...prev,
      open: false,
    }));
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
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const pageSizeOptions = ["10", "20", "50", "100", "250", "500"];

  const handlePageSizeChange = (current, page) => {
    setSize(page);
    setCurrentPage(1);
  };

  const handleClear = () => {
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
        closeModal={closeFilterModal}
        modal={"order"}
        finalFilters={finalFilters}
        setFinalFilters={setFinalFilters}
        removeFilter={removeFilter}
        setAppliedFilters={setAppliedFilters}
        appliedFilters={appliedFilters}
        clear={handleClear}
      />

      {isFetching ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className={orderTileClassName}>
            {orderModal?.open ? (
              <OrderDetails
                closeOrderModal={closeOrderModal}
                orderDataUid={orderModal?.data?.orderitem_info?.uid}
              />
            ) : (
              orders?.map((order, index) => (
                <OrderDetailTile
                  productName={order?.orderitem_info?.product_sn}
                  quantity={order?.orderitem_info?.quantity}
                  date={order?.date}
                  index={index}
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
          <NewOrderCreation
            open={createOrderModalOpen}
            onClose={handleCloseOC}
          />
        </div>
      )}
    </div>
  );
};

export default OrderListing;
