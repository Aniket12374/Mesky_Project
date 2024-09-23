import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Formlabel } from "../../../utils";
import ProfilePic from "./ProfilePic";
import { FormInput } from "../../Product/Form/FormComponents";
import { brandEdit, getBrand } from "../../../services/profile/profileService";
import { toast } from "react-hot-toast";
import { useMainStore } from "../../../store/store";
import { InputComponent } from "../utils";
import DeliverSection from "../DeliverSection/DeliverSection";

const ProfileSection = () => {
  const [editing, setEditing] = useState(false);
  const [brandInfo, setBrandInfo] = useState({
    description: "",
    profilePic: "",
  });
  const { register: registerProfile, setValue } = useForm();
  const brand = useMainStore((state) => state.brand);

  useEffect(() => {
    setValue("firstName", brand?.first_name);
    setValue("lastName", brand?.last_name);
    setValue("email", brand?.email);
    setValue("phoneNumber", brand?.phoneNumber);
    setValue("registeredName", brand?.registered_name);
    setValue("address_line_1", brand?.address_line_1);
    setValue("address_line_2", brand?.address_line_1);
    setValue("city", brand?.city);
    setValue("state", brand?.state);
    setValue("pincode", brand?.address_line_1);

    if (brand && brand.brand_id !== -1) {
      getBrand(brand.brand_id)
        .then((res) => {
          setBrandInfo({
            description: res.description,
            profilePic: res.logo,
          });
        })
        .catch((err) => console.log(err));
    }
  }, [brand]);

  const handleDescriptionSubmit = () => {
    let data = {
      description: brandInfo.description,
      logo: brandInfo.profilePic,
      brand_id: brand?.brand_id,
    };
    brandEdit(data)
      .then((res) => {
        toast.success("Data Updated Successfully", {
          position: "bottom-right",
        });
      })
      .catch((err) => {
        toast.error("Something Went wrong!", {
          position: "bottom-right",
        });
      });
  };

  return (
    <section>
      <div className='flex md:flex-row flex-col items-center md:items-start space-x-10'>
        {/* <div className="flex-none w-36 h-36">
          {brand && (
            <ProfilePic
              brandInfo={brandInfo}
              setBrandInfo={setBrandInfo}
              disabled={!editing}
            />
          )}
        </div> */}
        <div className='flex-1 md:w-64'>
          <div className='flex flex-col space-y-6 my-6 md:my-0'>
            <div className='flex justify-between items-start'>
              <div className='text-2xl roboto600'>{brand?.brand_name}</div>
              {/* <button
                className="py-2 px-20 rounded-3xl drop-shadow-lg text-white roboto600 bg-pink-600"
                onClick={() => {
                  editing && handleDescriptionSubmit();
                  setEditing(!editing);
                }}
              >
                {editing ? "Save" : "Edit"}
              </button> */}
            </div>

            {/* <div>
              <label htmlFor="" className="select-label">
                Description
              </label>
              <textarea
                className={
                  "w-full rounded-lg p-3 border-[1px] border-[#65CBF3] bg-white text-gray-400"
                }
                placeholder="Description"
                rows={6}
                disabled={!editing}
                onChange={(e) =>
                  setBrandInfo((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                value={brandInfo.description}
              ></textarea>
            </div> */}

            <div className='space-y-5'>
              <div className='text-2xl roboto600'>
                Primary contact information
              </div>
            </div>

            {/*  */}
            <div className='w-3/4 grid  gap-5'>
              <div className='flex flex-col md:flex-row md:space-x-4 w-full'>
                <InputComponent
                  register={registerProfile}
                  label='First Name'
                  fieldName='firstName'
                  className='w-1/2'
                />
                <InputComponent
                  register={registerProfile}
                  label='Last Name'
                  fieldName='lastName'
                  className='w-1/2'
                />
              </div>

              {/* <InputComponent
                register={registerProfile}
                label="Registered Name"
                fieldName="registeredName"
              /> */}
              <div className='flex flex-col md:flex-row space-x-4 w-full'>
                <div className='w-1/2'>
                  <InputComponent
                    register={registerProfile}
                    label='Email'
                    fieldName='email'
                  />
                </div>

                <div className=' w-1/2 flex flex-row space-x-4'>
                  <InputComponent
                    register={registerProfile}
                    label='Phone number'
                    fieldName='phoneNumber'
                    className='w-1/2'
                  />
                  <InputComponent
                    register={registerProfile}
                    label='Alternate Phone number'
                    fieldName='alTphoneNumber'
                    className='w-1/2'
                  />
                </div>
              </div>

              {/* <div>
                <Formlabel
                  label="Registered Address"
                  className="select-label"
                />
                <div className="rounded-lg border-[1px] border-[#65CBF3]">
                  <div className="primary-address mx-10">
                    <FormInput
                      name={"address_line_1"}
                      placeholder="Address Line 1"
                      className={`mt-5 mb-3 border-t-0 border-x-0 rounded-sm `}
                      disabled
                      register={registerProfile}
                    />
                    <div className="flex items-center space-x-2">
                      <FormInput
                        name={"address_line_2"}
                        placeholder="Address Line 2"
                        className={`w-3/4 mb-3 border-t-0 border-x-0 rounded-sm`}
                        // onChange={(e) => {
                        //   onChange(e, "address2");
                        // }}
                        disabled
                        register={registerProfile}
                      />
                    </div>
                    <div className="space-x-3 flex items-center justify-between">
                      <FormInput
                        name={"state"}
                        placeholder="Select State"
                        className={`w-1/3 mb-3 border-t-0 border-x-0 rounded-sm`}
                        // onChange={(e) => handleSelect(e, "state")}
                        disabled
                        register={registerProfile}
                      />
                      <FormInput
                        name={"city"}
                        placeholder="Select City"
                        className={`w-1/3 mb-3 border-t-0 border-x-0 rounded-sm`}
                        // onChange={(e) => handleSelect(e, "city")}
                        disabled
                        register={registerProfile}
                      />
                      <FormInput
                        name={"pincode"}
                        placeholder="Pincode"
                        disabled
                        register={registerProfile}
                        className={`w-1/3 mb-3 border-t-0 border-x-0 rounded-sm`}
                        // onChange={(e) => {
                        //   onChange(e, "pincode");
                        //   handlePincode(e.target.value, "city", "state");
                        // }}
                      />
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            {/* <div className="space-y-5">
              <div className="text-2xl roboto600">Delivery Information</div>
              <DeliverSection paidBy={brand?.delivery_pay_by} />
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
