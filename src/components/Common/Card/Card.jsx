import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const Card = ({ text, icon, cardClassName = "", firstText, secondText }) => {
  return (
    <div
      className={`card w-52 h-38 bg-base-100 shadow-xl text-white rounded-xl border-slate-400 ${cardClassName}`}
    >
      <div className="card_body">
        <>
          <div className="flex justify-between mx-5">
            <div className="mt-10 mr-3">{icon}</div>
            <div className="text-4xl mt-10">{text}</div>
          </div>
          <div className="ml-5">
            <div>{firstText}</div>
            <span className="leading-3 pb-2">{secondText}</span>
          </div>
          <div className="mt-2"></div>
        </>
      </div>
    </div>
  );
};

Card.propTypes = {
  text: PropTypes.any,
  icon: PropTypes.any,
  cardClassName: PropTypes.string,
  firstText: PropTypes.string,
  secondText: PropTypes.string,
};

export default Card;
