import React from "react";
import Tabs from "../../Common/Tabs/Tabs";
import OpenListingTab from "./OpenListingTab";
import CancelledListingTab from "./CancelledListingTab";
import DeliveredListingTab from "./DeliveredListingTab";
import ReturnedListingTab from "./ReturnedListingTab";
import CompletedListingTab from "./CompletedListingTab";
import AllOrdersListingTab from "./AllOrdersListingTab";
import InTransitTab from "./InTransitTab";

const ListingPage = () => {
  return (
    <div>
      <Tabs
        tabHeaders={Object.keys(orderTabHeaders)}
        tabsContent={Object.values(orderTabHeaders)}
      />
    </div>
  );
};

const orderTabHeaders = {
  Open: <OpenListingTab />,
  "In-Transit": <InTransitTab />,
  Cancelled: <CancelledListingTab />,
  Delivered: <DeliveredListingTab />,
  Returns: <ReturnedListingTab />,
  Completed: <CompletedListingTab />,
  All: <AllOrdersListingTab />,
};

export default ListingPage;
