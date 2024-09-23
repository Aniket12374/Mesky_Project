import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
// import { BsBell } from "react-icons/bs";
import { Image, Select, Spin } from "antd";
import _, { debounce } from "lodash";
import ProfileDropdown from "../../ProfileDropdown/ProfileDropdown";
import logo from "../../../assets/mesky-logos/mesky_logo_dashboard.svg";
import { getCustomers } from "../../../services/customerInfo/CustomerInfoService";
import {
  getCookie,
  setCustomerTokenCookie,
} from "../../../services/cookiesFunc";
import { useMainStore } from "../../../store/store";

const TopNavBar = () => {
  const customerAgent = getCookie("customerAgent") == "true";

  return (
    <nav className='fixed top-0 z-50 w-full bg-white'>
      <div className=''>
        <div className='flex items-center justify-between bg-[#7F39FB]'>
          <div className='flex items-center justify-start'>
            <Link to='/' className='flex ml-2 md:mr-24'>
              <Image
                src={logo}
                alt='mesky-logo'
                className='mr-3'
                preview={false}
              />
            </Link>
          </div>
          {customerAgent && <Search />}
          <div className='flex items-center'>
            <div className='flex justify-between items-center space-x-5'>
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
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const setCustomerTokenChanged = useMainStore(
    (state) => state.setCustomerTokenChanged
  );

  const debounceFetcher = useMemo(() => {
    setCustomerTokenChanged(false);
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);
      getCustomers(Number(value)).then((res) => {
        console.log({ res }, res?.data);
        const customers = res?.data?.data;
        const customersData = customers.map((customer) => ({
          label: `${customer.default_mobile_number} - ${customer.first_name} ${customer.last_name}`,
          value: customer.Customertoken,
        }));
        setOptions(customersData);
        setFetching(false);
      });
    };
    return debounce(loadOptions, 200);
  }, []);

  return (
    <div>
      <Select
        showSearch
        optionFilterProp='label'
        placeholder='Search for phone number...'
        options={options}
        onSearch={debounceFetcher}
        onKeyDown={debounceFetcher}
        className='w-96'
        notFoundContent={fetching ? <Spin size='small' /> : null}
        onChange={(newValue) => {
          setText(newValue);
          setCustomerTokenCookie(newValue);
          setCustomerTokenChanged(true);
        }}
      />
    </div>
  );
};

export default TopNavBar;
