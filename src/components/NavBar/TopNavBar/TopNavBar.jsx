import { useState } from "react";
import { Link } from "react-router-dom";
// import { BsBell } from "react-icons/bs";
import { Image } from "antd";
import ProfileDropdown from "../../ProfileDropdown/ProfileDropdown";
import logo from "../../../assets/mesky-logos/mesky_logo_dashboard.svg";

const TopNavBar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Link to="/" className="flex ml-2 md:mr-24">
              <Image
                src={logo}
                alt="mesky-logo"
                className="mr-3"
                preview={false}
              />
            </Link>
          </div>
          {/* <Search /> */}
          <div className="flex items-center">
            <div className="flex justify-between items-center space-x-5">
              {/* <BsBell size={20} /> */}
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Search = () => {
  const [text, setText] = useState("");
  return (
    <div>
      <input
        type="text"
        placeholder="Search here, type something"
        className="input input-bordered border-2 rounded-3xl border-slate-400 w-96"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default TopNavBar;
