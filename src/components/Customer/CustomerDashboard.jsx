import React from "react";
import Transactions from "./Transactions";
import OrderListing from "./OrderListing";
import CustomerInformation from "./CustomerInformation";
import SubscriptionTabs from "./SubscriptionTabs";

function CustomerDashboard() {
  return (
    <div>
      <CustomerInformation />
      <div className='flex space-x-2 mt-5'>
        <Transactions />
        <OrderListing />
        <SubscriptionTabs />
      </div>
    </div>
  );
}

export default CustomerDashboard;
