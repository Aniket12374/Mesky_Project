import React, { useState, useEffect } from "react";
import { Checkbox } from "antd";
import { useForm } from "react-hook-form";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-hot-toast";
import { State, City } from "country-state-city";
import classNames from "classnames";
import _ from "lodash";
import { useMainStore } from "../store/store";
import Button from "../components/Common/Button";
import Layout from "../components/Layout/Layout";
import { FormInput } from "../components/Product/Form/FormComponents";
import { Formlabel, Header } from "../utils";

import {
  getWarehouse,
  editWarehouse,
  createWarehouse,
} from "../services/warehouse/warehouseService";

import "react-phone-input-2/lib/style.css";

const primaryAddressFields = {
  state: "state",
  city: "city",
  address1: "address1",
  address2: "address2",
  pincode: "pincode",
};

const returnAddressFields = {
  state: "return_state",
  city: "return_city",
  address1: "return_address1",
  address2: "return_address2",
  pincode: "return_pincode",
};

const AllFields = [];
AllFields.push(
  Object.keys(primaryAddressFields),
  Object.values(returnAddressFields),
  "email",
  "mobile_number",
  "name"
);

const Warehouse = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [checked, setChecked] = useState(false);
  const [editable, setEditable] = useState(false);
  const [btnName, setBtnName] = useState("");
  const [cancelClicked, setCancelClicked] = useState("");
  const brand = useMainStore((state) => state.brand);

  const addressSplit = (address) => {
    let result = {
      address1: "",
      address2: "",
    };
    let splitAddress = address.split(" ");
    let totalLength = splitAddress.length;

    splitAddress.slice(0, totalLength / 2).map((x) => {
      result["address1"] = result["address1"] + x + "";
      return result["address1"];
    });
    splitAddress.slice(totalLength / 2, totalLength).map((x) => {
      result["address2"] = result["address2"] + x;
      return result["address2"];
    });

    return result;
  };

  useEffect(() => {
    clearErrors();
    getWarehouse()
      .then((res) => {
        const warehouse = res.data.data;
        const warehouseData = warehouse.length > 0 ? warehouse[0] : {};

        if (Object.keys(warehouseData).length > 1) {
          Object.keys(warehouseData).forEach((key) =>
            setValue(key, warehouseData[key])
          );
          const primaryAddress = addressSplit(warehouseData.address);
          const returnAddress = addressSplit(warehouseData.return_address);
          setValue("address1", primaryAddress["address1"]);
          setValue("address2", primaryAddress["address2"]);
          setValue("return_address1", returnAddress["address1"]);
          setValue("return_address2", returnAddress["address2"]);
          setBtnName("Edit");
        } else {
          AllFields.flat().forEach((key) => setValue(key, ""));
          setBtnName("Create Warehouse");
        }
      })
      .catch((err) => {});
  }, [cancelClicked]);

  const create = (data) => {
    data["brand_id"] = brand.brand_id;
    data["address"] = `${data["address1"]} ${data["address2"]}`;
    data[
      "return_address"
    ] = `${data["return_address1"]} ${data["return_address2"]}`;
    data["country"] = "India";
    data["return_country"] = "India";
    data["registered_name"] = data["name"];
    data["manager_firstname"] = data["manager_firstname"];
    data["manager_lastname"] = data["manager_lastname"];

    let allData = Object.keys(data).every((x) => data[x] !== "");

    if (!allData) {
      toast.error("Please All fields", {
        position: "top-center",
      });
    }

    let warehouseApi =
      btnName == "Create Warehouse"
        ? createWarehouse(data)
        : editWarehouse(data);

    allData &&
      warehouseApi &&
      warehouseApi
        .then((res) => {
          setEditable(false);
          setBtnName("Edit");
          toast.success("Warehouse created successful", {
            position: "bottom-right",
          });
        })
        .catch((err) => {
          toast.error(err.response.data.message, {
            position: "bottom-right",
          });
        });
  };

  const updatedStates = State.getStatesOfCountry("IN").map((state) => ({
    label: state.name,
    value: state.name,
    ...state,
  }));

  const updatedCities = (fieldName) => {
    let fieldValue = watch(fieldName);
    const stateCode = updatedStates.filter((x) =>
      x["name"].includes(fieldValue)
    );

    return stateCode.length > 0
      ? City.getCitiesOfState("IN", stateCode[0]["isoCode"]).map((city) => ({
          label: city.name,
          value: city.name,
          ...city,
        }))
      : null;
  };

  const handlePincode = (value, city, state) => {
    axios.get(`https://api.postalpincode.in/pincode/${value}`).then((res) => {
      if (res && res.data) {
        const data = res.data[0]["PostOffice"];
        setValue(`${city}`, data[0].Division);
        setValue(`${state}`, data[0].State);
      }
    });
  };

  const handleCheckBox = () => {
    if (!checked) {
      Object.values(primaryAddressFields).forEach((field) =>
        setValue(`return_${field}`, getValues(field))
      );
    } else {
      Object.values(returnAddressFields).forEach((field) =>
        setValue(field, "")
      );
    }
    setChecked(!checked);
  };

  const handleChange = (e, key) => {
    e.preventDefault();
    clearErrors(key);
    setValue(key, e.target.value ? e.target.value : "");
    if (checked) {
      clearErrors(`return_${key}`);
      setValue(`return_${key}`, e.target.value ? e.target.value : "");
    }
  };

  const handleSelect = (value, key) => {
    setValue(key, value);
    checked ? setValue(`return_${key}`, value ? value : "") : null;
  };

  const handleCancel = (e) => {
    e.preventDefault();
    clearErrors();
    setCancelClicked(true);
    setEditable(false);
  };

  const onSubmit = (data) => {
    create(data);
  };

  return (
    <Layout>
      <Header text="Warehouse" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-end">
          <div>
            <Button
              btnName={btnName}
              className={!editable ? "float-right w-32" : "hidden"}
              onClick={(e) => {
                e.preventDefault();
                clearErrors();
                setEditable(true);
                setCancelClicked(false);
              }}
            />
            <Button
              btnName={"Cancel"}
              cancelBtn={true}
              onClick={(e) => handleCancel(e)}
              className={editable ? "w-32" : "hidden"}
            />

            <Button btnName={"Save"} className={editable ? "w-32" : "hidden"} />
          </div>
        </div>
        <div className="warehouse-listing mx-5">
          <div className="flex space-x-5 mt-5">
            <div className="warehouse-name w-1/2">
              <FormInput
                name="name"
                label="Warehouse Name"
                placeholder="Name"
                errors={errors}
                onChange={(e) => handleChange(e, "name")}
                register={register}
                disabled={!editable}
              />
            </div>
            <div className="w-1/2 warehouse-phone-number">
              <div
                className={classNames({
                  "border-[1px] border-[#65CBF3] rounded-lg": editable,
                  "border-[1px] border-[#d9d9d9] bg-[#f7f7f9] rounded-lg":
                    !editable,
                })}
              >
                <Formlabel
                  label="Warehouse Phone Number"
                  className="select-label"
                />
                <div className="bg-white" style={{ padding: "5px" }}>
                  <PhoneInput
                    country="in"
                    onChange={(value) => {
                      setValue("mobile_number", value.slice(2, value.length));
                    }}
                    value={"+91" + getValues("mobile_number")}
                    disabled={!editable}
                    className="w-full"
                    inputClass={classNames({
                      "bg-slate-100": !editable,
                    })}
                  />
                  {errors["phone-input"] && (
                    <span className="text-red-600">Invalid Phone</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex  space-x-5 mt-5">
            <div className="warehouse-manager-name w-1/2">
              <FormInput
                name="manager_firstname"
                label="Warehouse Manger First Name"
                placeholder="Manager First Name"
                errors={errors}
                onChange={(e) => handleChange(e, "manager_firstname")}
                register={register}
                disabled={!editable}
              />
            </div>
            <div className="warehouse-manager-firstName w-1/2">
              <FormInput
                name="manager_lastname"
                label="Warehouse Manger Last Name"
                placeholder="Manager Last Name"
                errors={errors}
                onChange={(e) => handleChange(e, "manager_lastname")}
                register={register}
                disabled={!editable}
              />
            </div>
          </div>
          <div className="mt-5 w-1/2">
            <FormInput
              name="email"
              label="Email Address"
              placeholder="Email"
              onChange={(e) => handleChange(e, "email")}
              register={register}
              disabled={!editable}
              errors={errors}
            />
          </div>
          <div className="my-5 flex justify-end">
            <Checkbox checked={checked} onChange={handleCheckBox}>
              <span className="text-[#A8A8A8]">Same as primary address</span>
            </Checkbox>
          </div>
          <div className="address flex space-x-5">
            <Address
              label="WareHouse Primary Address"
              getValues={getValues}
              errors={errors}
              onChange={handleChange}
              disabled={!editable}
              register={register}
              control={control}
              updatedStates={updatedStates}
              updatedCities={updatedCities}
              handleSelect={handleSelect}
              addressFields={primaryAddressFields}
              handlePincode={handlePincode}
            />
            <Address
              label="Return Address"
              getValues={getValues}
              errors={errors}
              disabled={checked || !editable}
              register={register}
              control={control}
              onChange={handleChange}
              handleSelect={handleSelect}
              updatedStates={updatedStates}
              updatedCities={updatedCities}
              addressFields={returnAddressFields}
              handlePincode={handlePincode}
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

const Address = ({
  label,
  onChange,
  disabled,
  register,
  updatedStates,
  updatedCities,
  handleSelect,
  handlePincode,
  addressFields,
  getValues,
  errors,
  control,
}) => {
  return (
    <div className="w-1/2">
      <Formlabel label={label} className="select-label" />
      <div
        className={classNames("rounded-lg", {
          "border-[1px] border-[#65CBF3]": !disabled,
          "border-[1px] border-[#d9d9d9]": disabled,
        })}
      >
        <div className="primary-address mx-10">
          <FormInput
            name={addressFields.address1}
            placeholder="Address Line 1"
            className={`mt-5 mb-3 border-t-0 border-x-0 rounded-sm `}
            disabled={disabled}
            register={register}
            onChange={(e) => onChange(e, addressFields.address1)}
            errors={errors}
          />
          <div className="flex items-center space-x-2">
            <FormInput
              name={addressFields.address2}
              placeholder="Address Line 2"
              className={`w-3/4 mb-3 border-t-0 border-x-0 rounded-sm`}
              onChange={(e) => {
                onChange(e, addressFields.address2);
              }}
              disabled={disabled}
              register={register}
              errors={errors}
            />
          </div>
          <div className="space-x-3 flex items-center justify-between">
            <FormInput
              name={addressFields.state}
              placeholder="Select State"
              className={`w-1/3 mb-3 border-t-0 border-x-0 rounded-sm`}
              onChange={(e) => {
                handleSelect(e, addressFields.state);
              }}
              disabled={disabled}
              register={register}
              errors={errors}
            />
            <FormInput
              name={addressFields.city}
              placeholder="Select City"
              className={`w-1/3 mb-3 border-t-0 border-x-0 rounded-sm`}
              onChange={(e) => {
                handleSelect(e, addressFields.city);
              }}
              disabled={disabled}
              register={register}
              errors={errors}
            />

            <FormInput
              name={addressFields.pincode}
              placeholder="Pincode"
              disabled={disabled}
              register={register}
              className={`w-1/3 mb-3 border-t-0 border-x-0 rounded-sm`}
              errors={errors}
              onChange={(e) => {
                onChange(e, addressFields.pincode);
                handlePincode(
                  e.target.value,
                  addressFields.city,
                  addressFields.state
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Warehouse;
