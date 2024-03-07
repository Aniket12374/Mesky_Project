import React from "react";
import _ from "lodash";
import DelhiveryLogo from "./Delhivery_Logo.png";

const ShippingLabel = React.forwardRef((props, ref) => {
  const {
    shipping_label_barcode,
    uid_barcode,
    transportation_type,
    payment_type,
    shipping_address: {
      email,
      address_1,
      address_2,
      address_3,
      state,
      city,
      country,
      pincode,
    },
    product_details: { name: productName, total_price, item_price },
    seller_address: {
      name,
      address,
      city: sellerCity,
      country: sellerCountry,
      pincode: sellerPincode,
    },
    return_address: {
      address: returnAddress,
      city: returnCity,
      country: returnCountry,
      pincode: returnPincode,
    },
    shipping_label_date,
  } = props.data;

  const borderTd = "border-t-[2px] border-r-[2px] border-[black]";
  return (
    <div
      className="shipping-label flex justify-center h-screen items-center"
      ref={ref}
    >
      <div className="border border-[2px] border-[black] w-96 bar-code">
        <div className="flex border-b-[2px] border-[black] w-full items-center">
          <div className="seller-name w-1/2 p-1 text-lg font-semibold border-r-[2px] border-[black] leading-4">
            {name}
          </div>
          <div className="delhivery-logo w-1/2 p-1">
            <img src={DelhiveryLogo} alt="delhivery-logo" />
          </div>
        </div>
        <div className="w-64 mx-auto">
          <div>
            <img
              src={shipping_label_barcode}
              alt="shipping label barcode"
              className="w-64 h-16 mt-2"
            />
          </div>
          <div className="flex justify-between mt-2">
            <div>122003</div>
            <div>DUM/WLT</div>
          </div>
        </div>
        <div className="Shipping-address border-t-[2px] border-[black] flex items-center">
          <div className="address border-r-[2px] border-[black] w-64 p-1 leading-5">
            <React.Fragment>
              <div className="font-semibold">Ship To:</div>
              <div className="text-lg font-semibold">{email}</div>
              <div>
                {address_1} {address_2} {address_3}, {city}, {state}, {country}
              </div>
              <div className="font-semibold">PIN: {pincode}</div>
            </React.Fragment>
          </div>
          <div className="amount p-2">
            <div className="font-semibold">{payment_type}</div>
            <div className="font-semibold">{transportation_type}</div>
            <div className="font-semibold">INR {total_price}</div>
          </div>
        </div>
        <div className="seller-address  border-t-[2px] border-[black] leading-5">
          <div className="flex items-center">
            <div className="p-1 seller-address  border-r-[2px] border-[black] w-64">
              <div className="w-64">
                <span className="font-semibold">Seller: </span>
                <span variant="h6">{name}</span>
              </div>
              <div className="w-64">
                <span className="font-semibold">Address:</span> {address}{" "}
                {sellerCity}, {sellerCountry}, {sellerPincode}
              </div>
            </div>
            <div className="p-1">
              <span>Date: {shipping_label_date} </span>
            </div>
          </div>
        </div>
        <div className="product-pricing leading-5">
          <table
            style={{
              width: "100%",
              borderSpacing: 0,
              border: "1px solid black",
            }}
          >
            <thead>
              <tr className={`${borderTd}`}>
                <th className="align-left font-normal w-64 border-r-[2px] border-[black]">
                  Product(Qty)
                </th>
                <th className="align-left border-r-[2px] border-[black] font-normal">
                  Price
                </th>
                <th className="align-left font-normal">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${borderTd} p-2`}>{productName}</td>
                <td className={`${borderTd}`}>{item_price}</td>
                <td className={`${borderTd}`}>{total_price}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className={`${borderTd}`}>Total</td>
                <td className={`${borderTd}`}>{item_price}</td>
                <td className={`${borderTd}`}>{total_price}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className={`${borderTd} UID-barcode`}>
          <img
            src={uid_barcode}
            alt="UID barcode"
            className="w-60 h-16 my-2 mx-auto"
          />
        </div>
        <div className="return-address border-t-[2px] border-[black] p-1 leading-5">
          <div>
            Return Address: {returnAddress} {returnCity}, {returnCountry},{" "}
            {returnPincode}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ShippingLabel;
