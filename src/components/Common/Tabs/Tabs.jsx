import React, { useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const Tabs = ({ tabHeaders, tabsContent, tabsContentClassName = "" }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const Content = tabsContent[currentTabIndex];
  return (
    <React.Fragment>
      <div className="tabs-header flex justify-center">
        {tabHeaders.map((tabName, index) => (
          <div
            key={`tab_${tabName}_${index}`}
            className={classNames(
              "p-2 mx-5 w-32 border-2 border-[#F9A603] rounded-lg text-center cursor-pointer",
              {
                "text-white": currentTabIndex === index,
                "text-[#F9A603]": currentTabIndex !== index,
                "bg-[#F9A603]": currentTabIndex === index,
              }
            )}
            onClick={(e) => {
              e.preventDefault();
              setCurrentTabIndex(index);
            }}
          >
            {tabName}
          </div>
        ))}
      </div>
      <div className={`tabs-content ${tabsContentClassName}`}>{Content}</div>
    </React.Fragment>
  );
};

Tabs.propTypes = {
  tabHeaders: PropTypes.array,
  tabsContent: PropTypes.array,
};

export default Tabs;
