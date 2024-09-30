import React, { useEffect, useState } from "react";
import {
  getPinDetails,
  updateInfo,
} from "../../services/customerInfo/CustomerInfoService";
import toast from "react-hot-toast";
import _ from "lodash";
import { useQueryClient } from "react-query";

function EditableAddressForm({ data, closeModal, errors }) {
  const [formData, setFormData] = useState(data || {});
  const [formErrors, setFormErrors] = useState({});
  let fields = ["pincode", "sector_name", "line_1", "line_2", "land_mark"];
  let placeHolders = [
    "Pincode",
    "Sector/ Plot.No",
    "Flat No/ Floor No/ Apartment name/ Block",
    "Search the address",
    "Landmark",
  ];
  let personalFields = ["first_name", "last_name", "default_email"];
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData(data);
    setFormErrors(errors);
  }, [data]);

  const onChange = (key, value) => {
    if (key === "pincode" && value.length == 6) {
      getPinDetails(value).then((res) => {
        const pincodeData = res?.data;
        console.log({ pincodeData });
        if (pincodeData["subscrption"]) {
          setFormData((prev) => ({
            ...prev,
            ...pincodeData,
          }));
          setFormErrors((prev) => _.filter((prev) => prev !== "pincode"));
        }
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  // useEffect(() => {
  //   const input = document.getElementById("line_2");
  //   const autocomplete = new google.maps.places.Autocomplete(input, {
  //     componentRestrictions: { country: "IN" },
  //   });
  //   autocomplete.addListener("place_changed", function () {
  //     const place = autocomplete.getPlace();
  //     const latLngs = place?.geometry?.location;
  //     const lat = latLngs?.lat();
  //     const lng = latLngs?.lng();
  //     onChange("latitude", lat);
  //     onChange("longitude", lng);

  //     let pincodeCompo = place?.address_components?.find((x) =>
  //       x.types.includes("postal_code")
  //     );
  //     let pincode = pincodeCompo?.long_name;
  //     onChange("pincode", pincode);
  //     getPinDetails(pincode).then((res) => {
  //       const data = res?.data;
  //       Object.keys(data).map((x) => {
  //         onChange(x, data[x]);
  //       });
  //     });
  //     onChange("line_2", place?.name);
  //     onChange("sector_name", extractSectorValue(place?.formatted_address));
  //   });
  // }, []);

  const updateAddressInfo = () => {
    let requiredFields = [
      "line_1",
      "pincode",
      "sector_name",
      "first_name",
      "last_name",
    ];
    let emptyFields = [];
    requiredFields.map((field) => {
      if (!formData[field]) {
        let capField = field.replace("_", " ");
        emptyFields.push(field);
        return toast.error(`${capField} is required Field`);
      }
    });
    emptyFields.length < 1 &&
      updateInfo(formData)
        .then((res) => {
          toast.success("Address Updated Successfully!");
          queryClient.invalidateQueries("CustomerInfo");
          closeModal();
        })
        .catch((err) => toast.error("Not Updated!"));
  };

  return (
    <div>
      <div className='font-bold'>Enter Full and Address</div>
      <div className='address-form flex space-x-2 flex-wrap'>
        {fields.map((field, index) => (
          <div>
            <input
              type='text'
              name={field}
              id={field}
              value={formData[field]}
              onChange={(e) => onChange(field, e.target.value)}
              className={`m-2 border-b-2 border-gray-200 focus:outline-none ${
                index > 1 ? "w-96" : ""
              }`}
              disabled={index === 3}
              placeholder={placeHolders[index]}
            />
            <div className='text-red-500 text-xs'>{formErrors[field]}</div>
          </div>
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
            className={`m-2 border-b-2 border-gray-200 focus:outline-none ${
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

export default EditableAddressForm;
