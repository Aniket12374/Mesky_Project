import React, { useEffect, useState } from "react";
import Transactions from "./Transactions";
import OrderListing from "./OrderListing";
import CustomerInformation from "./CustomerInformation";
import SubscriptionTabs from "./SubscriptionTabs";
import { getCustomerTokenFromCookie } from "../../services/cookiesFunc";
import { useMainStore } from "../../store/store";

function CustomerDashboard() {
  const [token, setToken] = useState(getCustomerTokenFromCookie());
  const customerTokenChanged = useMainStore(
    (state) => state.customerTokenChanged
  );

  useEffect(() => {
    const presentToken = getCustomerTokenFromCookie();
    if (presentToken !== token) {
      setToken(presentToken);
    }
  }, [customerTokenChanged]);

  return token ? (
    <React.Fragment>
      <CustomerInformation token={token} />
      <div className='flex space-x-2 mt-5'>
        <Transactions token={token} />
        <OrderListing token={token} />
        <SubscriptionTabs />
      </div>
    </React.Fragment>
  ) : (
    <div className='flex justify-center items-center'>
      Please search the customer...
    </div>
  );
}

export default CustomerDashboard;
