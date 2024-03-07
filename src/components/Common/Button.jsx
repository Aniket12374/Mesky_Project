import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const Button = ({
  btnName,
  className = "",
  onClick,
  cancelBtn = false,
  disabled,
  ...otherProps
}) => {
  return (
    <button
      className={classNames(
        `py-2 px-3 mx-3  rounded-2xl text-white  ${className}`,
        {
          "bg-[#A8A8A8] text-black": cancelBtn,
          "bg-[#DF4584]": !cancelBtn,
        }
      )}
      onClick={onClick}
      disabled={disabled}
      {...otherProps}
    >
      {btnName}
    </button>
  );
};

Button.propTypes = {
  btnName: PropTypes.string,
  className: PropTypes.string,
  onClickFn: PropTypes.func,
};

export default Button;
