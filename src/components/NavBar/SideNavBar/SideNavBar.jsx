import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { Image } from "antd";
import * as Images from "../../../assets/sidebar";
import { useMainStore } from "../../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-solid-svg-icons";

const SidebarNavItems = [
  {
    id: 1,
    name: "Dashboard",
    path: "dashboard",
    icon1: Images["DashboardColored"],
    icon2: Images["Dashboard"],
  },
  {
    id: 2,
    name: "Subscription",
    path: "subscription",
    icon1: Images["ShoppingColoredLogo"],
    icon2: Images["ShoppingLogo"],
  },
  {
    id: 3,
    name: "Customer Credit",
    path: "customer/credit",
    icon1: Images["ShoppingColoredLogo"],
    icon2: Images["ShoppingLogo"],
  },
  {
    id: 4,
    name: "Routing",
    path: "routing",
    icon1: Images["RoutingColoredLogo"],
    icon2: Images["RoutingLogo"],
  },
  {
    id: 5,
    name: "Area Mapping",
    path: "AreaMapping",
    icon1: Images["AreaMapColoredLogo"],
    icon2: Images["AreaMapLogo"],
  },
  {
    id: 6,
    name: "History",
    path: "history",
    icon1: Images["OrdersLogoColored"],
    icon2: Images["OrdersLogo"],
  },
  {
    id: 7,
    name: "Agents",
    path: "agents",
    icon1: Images["SupportLogoColored"],
    icon2: Images["SupportLogo"],
  },
];

const SideNavBar = () => {
  let location = useLocation();
  const close = useMainStore((state) => state.sidebarOpen);
  const setClose = useMainStore((state) => state.setSideBarOpen);

  const samePath = (page) => location.pathname.includes(page);

  const LiItem = ({ path, name, icon1, icon2 }) => (
    <li
      className={classNames({
        "bg-gradient-to-l to-neutral-50 from-[#d3b5e2] rounded-lg":
          samePath(path),
      })}
    >
      <Link to={`/${path}`} className="flex items-center p-6">
        <Image
          src={samePath(path) ? icon1 : icon2}
          alt={`${path}-icon`}
          preview={false}
          width={24}
          height={24}
        />
        {close && (
          <span
            className={classNames("flex-1 ml-3", {
              "text-[#AA00FF]": samePath(path),
              "text-gray-600": !samePath(path),
            })}
          >
            {name}
          </span>
        )}
      </Link>
    </li>
  );

  return (
    <div
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40  h-screen pt-20 transition-transform -translate-x-full bg-white sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 w-max">
        <div className="flex mt-2 justify-end">
          <button onClick={() => setClose(!close)}>
            <FontAwesomeIcon
              size="2x"
              icon={close ? faSquareCaretLeft : faSquareCaretRight}
            />
          </button>
        </div>
        <ul className="py-2 space-y-2">
          {SidebarNavItems.map((sidebarItem, index) => (
            <LiItem
              path={sidebarItem.path}
              name={sidebarItem.name}
              icon1={sidebarItem.icon1}
              icon2={sidebarItem.icon2}
              key={index}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNavBar;
