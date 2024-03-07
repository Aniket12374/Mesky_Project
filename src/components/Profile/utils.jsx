import React from "react";

export const InputComponent = ({
  register,
  fieldName,
  className = "",
  label = "",
}) => {
  return (
    <div className={className}>
      <label htmlFor="" className="select-label">
        {label}
      </label>
      <input
        {...register(fieldName)}
        type="text"
        disabled
        className={
          "w-full rounded-lg p-3 border-[1px] border-[#65CBF3] bg-white text-gray-400"
        }
      />
    </div>
  );
};

export const BoxShadowInput = ({
  register,
  label,
  fieldName,
  type = "date",
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="" className="text-xl fredoka-500">
        {label}
      </label>
      <input
        type={type}
        placeholder="Type here"
        className="input input-bordered w-full rounded-3xl credit-debit-boxshadow"
        {...register(fieldName, { required: true })}
      />
    </div>
  );
};
