import React from "react";
import "./form.css";
import classNames from "classnames";
import { Input, Select } from "antd";
import { Controller } from "react-hook-form";

const { TextArea } = Input;

// ALL THESE FIELDS ARE FOR REACT HOOK FORM
const formClass =
  "w-full rounded-lg p-3 focus:outline-none focus:border-sky-600 focus:ring-sky-600";

const FormInput = (props) => {
  const {
    register,
    required = false,
    className = "",
    size = "",
    label,
    name,
    value,
    disabled = false,
    width = "",
    onChange,
    errors = "",
    ...otherProps
  } = props;

  const outlineClassname = classNames(`form-input  ${className} ${width}`, {
    "small-width": size === "small",
    "border-[#65CBF3]": !disabled,
    "w-full": !width,
  });

  const inputClassname = classNames(`${formClass}`, {
    "small-width": size,
    "border-[1px] border-[#A8A8A8] bg-white text-gray-400": disabled,
    "bg-white border-[1px] border-[#65CBF3]": !disabled,
  });

  const requiredInput = required ? `This field is Required` : false;

  return (
    <div className={outlineClassname}>
      <label>
        {label}
        {required ? <span className="text-orange-700">*</span> : ""}
      </label>
      <input
        {...register(name, { required: requiredInput })}
        className={inputClassname}
        onChange={onChange}
        disabled={disabled}
        value={value}
        title={name}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        {...otherProps}
      />
      {errors && errors[name] && errors[name]["message"] && (
        <p role="alert" className="text-red-400">
          This field is Required
        </p>
      )}
    </div>
  );
};

const FormSelect = ({
  label,
  name,
  options,
  disabled,
  onChange,
  value,
  text = "",
  multi = false,
  control,
  className = "",
  required = true,
  ...otherProps
}) => (
  <div className={`select-component relative ${className}`}>
    <label className="select-label">
      {label} {required ? <span className="text-orange-700">*</span> : ""}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          label={label}
          name={name}
          showSearch
          allowClear
          className={classNames("flex items-center tags-select rounded-lg", {
            "multi-select": multi,
          })}
          style={{
            width: "100%",
            border: !disabled ? "1px solid #65CBF3" : "1px solid #e5e7eb",
          }}
          options={options}
          disabled={disabled}
          onChange={onChange}
          required={required}
          {...otherProps}
        />
      )}
    />
    <small className="text-[#A8A8A8]">{text}</small>
  </div>
);

const FormTextArea = ({
  name,
  placeholder = "",
  className = "",
  label,
  onChange,
  disabled,
  width = "",
  value,
  control,
  required = false,
  ...otherProps
}) => (
  <div
    className={classNames(`border-none m-0 relative ${className} ${width}`, {
      "w-full": !width,
    })}
  >
    <label className="text-[#A8A8A8] select-label">
      {label} {required ? <span className="text-orange-700">*</span> : ""}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextArea
          {...field}
          type="text"
          name={name}
          title={name}
          className={classNames(`${formClass} border-[1px] bg-white`, {
            "font-normal text-lg text-gray-400": disabled,
            "border-[#65CBF3] font-normal text-lg": !disabled,
          })}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          autoSize
          required={required}
          {...otherProps}
        />
      )}
    />
  </div>
);

export { FormTextArea, FormInput, FormSelect };
