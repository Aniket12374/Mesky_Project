import React, { useEffect, useState } from "react";
import {
  getPinDetails,
  updateInfo,
} from "../../services/customerInfo/CustomerInfoService";
import toast from "react-hot-toast";

function AddressForm({ data, closeModal }) {
  const [formData, setFormData] = useState(data || {});
  let fields = ["pincode", "line_1", "line_2", "landmark"];
  let personalFields = ["first_name", "last_name", "default_email"];
  const onChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const input = document.getElementById("line_2");
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: "IN" },
    });
    autocomplete.addListener("place_changed", function () {
      const place = autocomplete.getPlace();

      let pincodeCompo = place?.address_components?.find((x) =>
        x.types.includes("postal_code")
      );
      let pincode = pincodeCompo?.long_name;
      onChange("pincode", pincode);
      getPinDetails(pincode).then((res) => {
        const data = res?.data;
        Object.keys(data).map((x) => {
          onChange(x, data[x]);
        });
      });
      onChange("line_2", place?.name);
    });
  }, []);

  const updateAddressInfo = () => {
    updateInfo(formData)
      .then((res) => {
        toast.success("Address Updated Successfully!");
        closeModal();
      })
      .catch((err) => {
        toast.error("Not Updated!");
      });
  };

  return (
    <div>
      <div className='font-bold'>Enter Full and Address</div>
      <div className='address-form flex space-x-2 flex-wrap'>
        {fields.map((field, index) => (
          <input
            type='text'
            name={field}
            id={field}
            value={formData[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className={`m-2 border-b-2 border-gray-200 ${
              index > 1 ? "w-full" : ""
            }`}
            placeholder={field}
          />
        ))}
      </div>
      <div className='font-bold'>Personal Information</div>
      <div>
        {personalFields.map((pslField, index) => (
          <input
            type='text'
            name={pslField}
            value={formData[pslField]}
            onChange={(e) => onChange(pslField, e.target.value)}
            className={`m-2 border-b-2 border-gray-200 ${
              index > 1 ? "w-full" : ""
            }`}
            placeholder={pslField}
          />
        ))}
      </div>
      <div className='flex justify-center mt-5'>
        <button
          className='bg-[#DF4584] rounded-lg p-2 text-white w-32'
          onClick={updateAddressInfo}
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default AddressForm;
