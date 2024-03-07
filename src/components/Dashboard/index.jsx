import React from "react";
import Tabs from "../Common/Tabs/Tabs";
import Ecommerce from "./Ecommerce";
import Social from "./Social";

const DashboardTab = () => {
  return (
    <Tabs
      tabHeaders={["Ecommerce", "Social"]}
      tabsContent={[<Ecommerce />, <Social />]}
    />
  );
};

export default DashboardTab;
