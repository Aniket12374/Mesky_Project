import React, { useEffect, useState } from "react";
import {
  getPinDetails,
  updateInfo,
} from "../../services/customerInfo/CustomerInfoService";
import toast from "react-hot-toast";

function AddressForm({ data, closeModal }) {
  const [formData, setFormData] = useState(data || {});
  let fields = ["pincode", "sector_name", "line_1", "line_2", "landmark"];
  let placeHolders = [
    "Pincode",
    "Sector/ Plot.No",
    "Flat No/ Floor No/ Apartment name/ Block",
    "Search the address",
    "Landmark",
  ];
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
      const latLngs = place?.geometry?.location;
      const lat = latLngs?.lat();
      const lng = latLngs?.lng();
      onChange("latitude", lat);
      onChange("longitude", lng);

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
      onChange("sector_name", extractSectorValue(place?.formatted_address));
    });
  }, []);

  const extractSectorValue = (line) => {
    if (typeof line !== "string") return "";

    const sectorPattern = /sector\s*[^,]*/i; // Match 'sector' followed by any number of spaces and then any characters except a comma
    const result = line.match(sectorPattern);
    return result ? result[0].trim() : "";
  };

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
            className={`m-2 border-b-2 border-gray-200 focus:outline-none ${
              index > 1 ? "w-full" : ""
            }`}
            placeholder={placeHolders[index]}
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
