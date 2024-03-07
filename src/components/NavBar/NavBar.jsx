import TopNavBar from "./TopNavBar/TopNavBar";
import SideNavBar from "./SideNavBar/SideNavBar";
import { getMyDetails } from "../../services/auth/authService";
import { useMainStore } from "../../store/store";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const setName = useMainStore((state) => state.setName);
  const setBrand = useMainStore((state) => state.setBrand);
  const navigate = useNavigate();

  const {
    data: response,
    isSuccess,
    isError,
  } = useQuery("vendorDetails", getMyDetails, {
    staleTime: 120000,
    cacheTime: 120000,
  });

  useEffect(() => {
    if (isSuccess) {
      const {
        first_name,
        last_name,
        brand_id,
        brand_name,
        default_email,
        default_mobile_number,
        alternateNumber,
        registered_name,
        registered_address,
        delivery_pay_by,
        address_line_1,
        address_line_2,
        state,
        city,
        pincode,
      } = undefined || response.data;
      setName(`${first_name} ${last_name}`);
      setBrand(
        brand_id,
        brand_name,
        default_mobile_number,
        alternateNumber,
        default_email,
        first_name,
        last_name,
        registered_name,
        registered_address,
        delivery_pay_by,
        address_line_1,
        address_line_2,
        state,
        city,
        pincode
      );
    }
    if (isError) {
      navigate("/login");
    }
  }, [isSuccess, isError]);

  return (
    <>
      <TopNavBar />
      <SideNavBar />
    </>
  );
};

export default NavBar;
