import React, { useMemo, useState } from "react";
import { DatePicker, Modal, Select } from "antd";
import _ from "lodash";
import { DebounceSelect } from "./SubscriptionEditModal";
import { searchProductList } from "../../services/customerInfo/CustomerInfoService";
import { ProductCard } from "../../utils";
import { getCookie } from "../../services/cookiesFunc";
import { createOrder } from "../../services/customerOrders/CustomerOrderService";
import toast from "react-hot-toast";
import moment from "moment";
import { useQueryClient } from "react-query";

function NewOrderCreation({ open, onClose }) {
  const dateFormat = "DD-MM-YYYY";
  const queryClient = useQueryClient();
  const [orderData, setOrderData] = useState({
    start_date: moment().add(1, "days").endOf("day").format(dateFormat),
    qty: 0,
  });

  const [value, setValue] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const currentOrderVal = Number(getCookie("currentOrderVal"));
  const walletBalance = getCookie("walletBalance");

  const handleOrderData = (key, value) => {
    setOrderData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const disableYesterday = (current) => {
    return current && current < moment().subtract(1, "days").endOf("day");
  };

  const tmrDate = moment().add(1, "days").endOf("day").format(dateFormat);

  const fetchProductOptions = async (search) => {
    try {
      if (search) {
        const res = await searchProductList(search);

        const data = res.data.data.map((product) => ({
          label: product.product_sn,
          value: product.product_id,
          img: product.default_image,
          price: product?.offer_price,
          quantity: 1,
          ...product,
        }));
        setProductOptions(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
      return [];
    }
  };

  const handleUpdateQty = (productId, updatedQty) => {
    let modifiedProducts = [...selectedProducts];
    modifiedProducts.forEach((product) => {
      if (product.product_id === productId) {
        product["quantity"] = Number(updatedQty);
      }
    });

    setSelectedProducts(modifiedProducts);
  };

  const handleAddProduct = (newValue) => {
    let currentProduct = productOptions.find(
      (options) => options.value === newValue.value
    );
    const { unit_price: currentUnitPrice, offer_price: currentOffPrice } =
      currentProduct;

    currentProduct["quantity"] = 1;
    currentProduct["final_price"] =
      currentUnitPrice && currentUnitPrice !== 0.0
        ? currentUnitPrice
        : currentOffPrice;

    let productExists = selectedProducts.find(
      (prod) => prod.product_id == currentProduct?.product_id
    );

    !productExists && setSelectedProducts((prev) => [...prev, currentProduct]);
  };

  const handleRemove = (prodId) => {
    let modifiedProducts = [...selectedProducts];
    let filteredProducts = modifiedProducts.filter(
      (product) => product.product_id !== prodId
    );

    setSelectedProducts(filteredProducts);
  };

  const productsPresent = selectedProducts.length > 0;

  const subTotal = productsPresent
    ? selectedProducts
        .map((x) => x.final_price * x.quantity)
        .reduce((acc, curr) => acc + curr)
    : 0;

  const mrpTotal = productsPresent
    ? selectedProducts
        .map((x) => x.selling_price * x.quantity)
        .reduce((acc, curr) => acc + curr)
    : 0;

  const negBalance = walletBalance - currentOrderVal - subTotal < 0;

  const resetData = () => {
    setSelectedProducts([]);
    setOrderData({
      qty: 1,
      start_date: "",
    });
  };

  const handleOrderSuccess = () => {
    toast.success("Succesfully created");
    onClose();
    resetData();
    queryClient.invalidateQueries("getOrders");
  };

  const handleSubmitCreation = () => {
    const orderCreationPayload = {
      order_creation_date: orderData.start_date || tmrDate,
      products: selectedProducts.map((selProd) => ({
        product_id: selProd?.product_id,
        qty: selProd?.quantity,
      })),
    };

    if (walletBalance - currentOrderVal - subTotal < 0) {
      toast.error(`Can't create order because of low Balance`);
      return;
    }

    createOrder(orderCreationPayload)
      .then((res) => handleOrderSuccess())
      .catch((err) => {
        toast.error(
          err?.response?.data?.message?.message || err?.response?.data?.message
        );
        console.log({ err });
      });
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        onClose();
        resetData();
      }}
      width={1200}
      className='roboto-400'
      footer={null}
    >
      <React.Fragment>
        <div className='flex justify-center'>
          <DebounceSelect
            mode='single'
            value={value}
            size='large'
            placeholder={
              <div className='flex justify-between'>
                <div className='roboto-300 gray-color'>
                  Search product to add...
                </div>
                <div>
                  <span className='text-[#645d5d]'>
                    <i className='fa-solid fa-magnifying-glass' />
                  </span>
                </div>
              </div>
            }
            className='mb-10'
            fetchOptions={fetchProductOptions}
            onChange={(newValue) => handleAddProduct(newValue)}
            style={{
              width: "70%",
            }}
          />
        </div>
        <div className='flex space-x-10'>
          <div className='creation-part w-1/2'>
            <div className='calendar-selection flex items-center justify-between'>
              <div className='font-semibold'>Order Delivery Date</div>
              <DatePicker
                name={"start_date"}
                placeholder={"Place select the date"}
                format={dateFormat}
                disabledDate={disableYesterday}
                className='border-2 border-gray-300'
                onChange={(val, dateString) =>
                  handleOrderData("start_date", dateString)
                }
              />
            </div>
            <div className='font-medium my-5'>Newly Added Products</div>
            <EditCreatePart
              selectedProducts={selectedProducts}
              orderData={orderData}
              handleUpdateQty={handleUpdateQty}
              className={`p-5 ${productsPresent ? "customer-shadow" : ""}`}
              handleRemove={handleRemove}
            />
          </div>
          <div className='creation-preview w-1/2'>
            <div className='roboto-500 mb-3'>
              Verify the newly added products and amount below
            </div>
            <div className='customer-shadow p-3'>
              <EditCreatePart
                selectedProducts={selectedProducts}
                orderData={orderData}
                handleUpdateQty={handleUpdateQty}
                editable={false}
                handleRemove={handleRemove}
              />
              <div className='roboto-500 px-2 mt-8'>New Order Details</div>
              <div className='grid grid-cols-2 px-2 mt-2'>
                <div className='roboto-500 mt-2'>{`Sub Total (${selectedProducts.length}) items`}</div>
                <div className='grid place-items-end mt-1 roboto-500'>
                  ₹{subTotal}
                </div>
                <div className='gray-color my-1'>MRP </div>
                <div className='grid place-items-end my-1'>₹{mrpTotal}</div>
                <div className='gray-color'>Product Discount</div>
                <div className='grid place-items-end text-[#07B442]'>
                  -₹{mrpTotal - subTotal}
                </div>
                <div className='roboto-600 mt-1'>New Order Total</div>
                <div className='grid place-items-end mt-1 roboto-600'>
                  ₹{subTotal}
                </div>
              </div>
            </div>
            <div className='customer-shadow p-5 mt-8'>
              <div className='roboto-500'>Order Summary</div>
              <div className={`grid grid-cols-2 mt-3`}>
                <div className={negBalance ? "text-red-400" : ""}>
                  Available Wallet Balance
                </div>
                <div
                  className={`grid place-items-end ${
                    negBalance ? "text-red-400" : ""
                  }`}
                >
                  ₹{walletBalance - currentOrderVal}
                </div>
                <div className='my-1'>Total New Order Amount</div>
                <div className='grid place-items-end my-1 text-[#16753E]'>
                  ₹{subTotal}
                </div>
                <div className='font-semibold'>Balance Amount</div>
                <div
                  className={`grid place-items-end ${
                    negBalance ? "text-red-500 font-semibold" : "font-semibold"
                  }`}
                >
                  {negBalance ? "-" : ""} ₹
                  {Math.abs(walletBalance - currentOrderVal - subTotal)}
                </div>
              </div>
              {negBalance && (
                <div className='text-red-500 mt-2'>
                  * Insufficient wallet balance to process this order
                </div>
              )}
            </div>

            <button
              className={`mt-5 w-64 text-white p-2 float-right rounded-md ${
                negBalance || !productsPresent ? "bg-[#ACACAC]" : "bg-[#FB8171]"
              }`}
              disabled={negBalance || !productsPresent}
              onClick={handleSubmitCreation}
            >
              Create New Order
            </button>
          </div>
        </div>
      </React.Fragment>
    </Modal>
  );
}

const EditCreatePart = ({
  selectedProducts,
  orderData,
  handleUpdateQty,
  handleRemove,
  className = "",
  editable = true,
}) => {
  const totalQtyOptions = Array.from({ length: 10 }, (_, index) => index + 1);
  return (
    <div className={`added-products mt-3  ${className}`}>
      {selectedProducts.map((selectedProduct) => {
        const {
          selling_price: selPrice,
          offer_price: offPrice,
          final_price: finalPrice,
          quantity: qty,
          product_id: prodID,
        } = selectedProduct;
        return (
          <div
            className={
              editable
                ? "my-3 border-b-2 border-gray-200"
                : "p-1 border-b-2 border-gray-200"
            }
          >
            <div>
              {editable && (
                <div
                  className='float-right w-[20px] h-[20px] flex items-center justify-center rounded-full bg-red-500 border-2 border-gray-200 cursor-pointer'
                  onClick={() => handleRemove(prodID)}
                >
                  <div className='text-white'>x</div>
                </div>
              )}
              <ProductCard
                product={selectedProduct}
                quantity={1}
                showQty={false}
              >
                <div className='flex space-x-5 items-center w-[300px] mt-2'>
                  <div className='quantity-selection w-1/2'>
                    {editable ? (
                      <select
                        value={qty}
                        onChange={(e) =>
                          handleUpdateQty(prodID, e.target.value)
                        }
                        className='border-2 border-gray-200 focus:outline-none rounded-md'
                      >
                        {totalQtyOptions.map((qtyOption) => (
                          <option value={qtyOption}>
                            Qty &nbsp;&nbsp;{qtyOption}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        <div className='gray-color'>Quantity</div>
                        <div>{qty}</div>
                      </div>
                    )}
                  </div>
                  <div className='price text-center'>
                    <div className='gray-color'>Price</div>
                    <div className='flex space-x-2'>
                      <span className='roboto-500'>
                        ₹{offPrice * Number(qty)}
                      </span>
                      {offPrice !== selPrice && (
                        <span className='line-through gray-color'>
                          ₹{selPrice * Number(qty)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ProductCard>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewOrderCreation;
