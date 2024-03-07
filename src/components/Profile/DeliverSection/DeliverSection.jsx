import React from "react";

const DeliverSection = ({ paidBy }) => {
  return (
    <section>
      <section className="flex flex-col md:flex-row justify-between">
        <div>
          <div className="text-xl">Who pays for the delivery?</div>

          <div className="flex flex-col space-y-2 my-5">
            <div className="flex items-center space-x-2">
              <input
                id="brand"
                type="radio"
                name="radio-4"
                className="radio radio-accent"
                value="brand"
                checked={paidBy === "brand"}
              />
              <label htmlFor="brand">Brand</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="customer"
                type="radio"
                name="radio-4"
                className="radio radio-accent"
                value="customer"
                checked={paidBy === "customer"}
              />
              <label htmlFor="customer">Customer</label>
            </div>
          </div>
        </div>
      </section>

      {/* {watch("delivery") === "brand" && (
        <section className="flex flex-col space-y-2 my-8">
          <label className="text-xl">
            What is the minimum order value for the customer to get free
            delivery?
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-info w-full max-w-xs rounded-3xl"
          />
        </section>
      )} */}
    </section>
  );
};

export default DeliverSection;
