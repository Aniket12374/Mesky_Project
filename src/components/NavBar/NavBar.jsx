import TopNavBar from "./TopNavBar/TopNavBar";
import SideNavBar from "./SideNavBar/SideNavBar";
import { getMyDetails } from "../../services/auth/authService";
import { useMainStore } from "../../store/store";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <TopNavBar />
      <SideNavBar />
    </>
  );
};

export default NavBar;
