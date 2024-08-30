import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
// import { BsBell } from "react-icons/bs";
import { Image, Select, Spin } from "antd";
import _, { debounce } from 'lodash'
import ProfileDropdown from "../../ProfileDropdown/ProfileDropdown";
import logo from "../../../assets/mesky-logos/mesky_logo_dashboard.svg";
import { getCustomers } from "../../../services/customerInfo/CustomerInfoService";

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
          <Search />
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
  const [options, setOptions] = useState([])
  const [fetching, setFetching] = useState(true)
  const fetchRef = useRef(null)

  const debounceFn = useCallback((val) => {
    setText(val)
      console.log(val, {val} )
      val.length > 0 && getCustomers(val).then( (res) => {
        setFetching(false)
        const customers = res?.data?.data
        const customersData = customers.map((customer) => ({
          label: `${customer.default_mobile_number} - ${customer.first_name} ${customer.last_name}`,
          value: customer.id,
        }))
        setOptions(customersData)
      })
    // }
  }, [])

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      value.length > 0 && getCustomers(value).then( (res) => {
        const customers = res?.data?.data
        const customersData = customers.map((customer) => ({
          label: `${customer.default_mobile_number} - ${customer.first_name} ${customer.last_name}`,
          value: customer.id,
        }))
        setOptions(customersData)
        setFetching(false)
      }).catch( (err) => {
        console.log({ err})
        setFetching(false)

      })
    };
    return debounce(loadOptions, 300);
  }, [getCustomers, 300]);

  return (
    <div>
      <Select 
        labelInValue
        showSearch
        // onSearch={_.debounce((val) => debounceFn(val), 300)}
        onSearch={debounceFetcher}
        options={options}
        className="w-96"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(newValue) => {
          setText(newValue);
        }}
       
      />
    </div>
  );
};


export default TopNavBar;
