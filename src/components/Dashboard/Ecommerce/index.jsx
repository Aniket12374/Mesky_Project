import React from "react";
import EcommerceCards from "./EcommerceCards";
import EcommerceTables from "./EcommerceTables";

const Ecommerce = () => {
  return (
    <div className="ecommerce-tab-content">
      <EcommerceCards />
      <EcommerceTables />
    </div>
  );
};
export default Ecommerce;
