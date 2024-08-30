import React from "react";
import Transactions from "./Transactions";
import OrderListing from "./OrderListing";
import CustomerInformation from "./CustomerInformation";

function CustomerDashboard() {
  return (
    <div>
      <div>CustomerDashboard</div>
      <CustomerInformation />
      <div className='flex space-x-5 mt-5'>
        <Transactions />
        <OrderListing />
      </div>
    </div>
  );
}

export default CustomerDashboard;
