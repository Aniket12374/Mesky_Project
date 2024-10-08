import { useEffect, useState } from "react";
import Button from "../Common/Button";
import { httpVendor, httpVendorUpload } from "../../services/api-client";
import { addRider, getSocieties } from "../../services/riders/riderService";
import toast from "react-hot-toast";
import Select from "react-select";
import { DatePicker, Tabs } from "antd";
import moment from "moment";
import FileAction from "../shared/FileAction";

const dateFormat = "YYYY/MM/DD";

const AgentCreation = ({ setShowAgentCreation }) => {
  const [agent, setAgent] = useState({});
  const [socitiesList, setSocitiesList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({
    dl: false,
    adhar_front: false,
    adhar_back: false,
    veh_n_pl_im: false,
    veh_rc: false,
    veh_is: false,
    poll_ch: false,
  });

  const handleChange = (key, value) => {
    setAgent((prev) => ({ ...prev, ...{ [key]: value } }));
  };

  const handleUpload = (event, key) => {
    let files = event.target.files;

    // Check if a file is selected
    if (files.length === 0) {
      return; // No file selected
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const fileType = files[0].type;

    // Extract file extension from the file name
    const fileName = files[0].name;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    // Check both MIME type and file extension
    if (
      !allowedTypes.includes(fileType) ||
      !["pdf", "jpeg", "jpg", "png"].includes(fileExtension)
    ) {
      // Invalid file type
      toast.error("Please upload PDF, JPEG, JPG, or PNG files only.");
      return;
    }

    // Proceed with file upload
    const formData = new FormData();
    formData.append("files", files[0], fileName);

    httpVendorUpload
      .post("/api/upload/multiple-image", formData)
      .then((res) => {
        const links = res.data.links;
        handleChange(key, links.length > 0 ? links[0] : null);
        setUploadedFiles((prev) => ({ ...prev, [key]: true }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSaveAgent = () => {
    // Define required fields including documents
    const requiredFields = [
      "full_name",
      "mobile_number",
      "dl",
      "adhar_front",
      "adhar_back",
      "veh_n_pl_im",
      "veh_rc",
      "veh_is",
      "poll_ch",
    ];

    // Check if required fields are filled
    const missingFields = requiredFields.filter((field) => !agent[field]);

    // If any required fields are missing, show error message
    if (missingFields.length > 0) {
      const errorMessage = "Please fill all the required fields.";
      return toast.error(errorMessage);
    }

    const mobile_number = agent.mobile_number;

    if (/\s/.test(mobile_number)) {
      toast.error("Phone number should not contain spaces.");
      return;
    }

    if (!/^\d{10}$/.test(mobile_number)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    // Save agent information
    addRider(agent)
      .then((res) => {
        toast.success("Saved successfully");
        setShowAgentCreation(false);
      })
      .catch((err) => {
        console.log({ err });
        toast.error(err?.response?.data.message);
      });
  };

  const handleSelectOption = (selectedOption) => {
    handleChange(
      "society",
      selectedOption.map((x) => x.value)
    );
  };

  useEffect(() => {
    getSocieties().then((res) => {
      let list = res?.data?.data?.map((x) => ({
        label: x.sector,
        value: x.id,
      }));
      setSocitiesList(list);
    });
  }, []);

  const issueDts = [
    "dl_i_date",
    "adhar_i_date",
    "veh_n_pl_im_i_date",
    "veh_rc_i_date",
    "poll_ch_i_date",
  ];

  const expDts = [
    "dl_ex_date",
    "adhar_ex_date",
    "veh_n_pl_im_ex_date",
    "veh_rc_ex_date",
    "poll_ch_ex_date",
  ];

  const dateFormat = "YYYY-MM-DD";

  function disabledFutureDate(current) {
    return current && current > moment().endOf("day");
  }

  function disabledPastDate(current) {
    return current && current < moment().startOf("day");
  }

  return (
    <div>
      {/* Tabs for Page 1 and Page 2 */}
      <Tabs defaultActiveKey="1" started>
        {/* Page 1 - Agent Information */}
        <Tabs.TabPane tab="Agent Info" key="1">
          <div className="w-full flex justify-end ">
            <Button btnName={"Edit"} onClick={handleSaveAgent}/>
            <Button
              btnName={"Verify"}
              onClick={() => setShowAgentCreation(false)}
            />
            <Button
              btnName={"Reject"}
              onClick={() => setShowAgentCreation(false)}
            />
          </div>
          <div className="flex space-x-5 w-full justify-start">
            <div className="w-[40%] space-y-2">
              <div className="">
                <label>Full Name</label>
                <input
                  type="text"
                  className="w-full h-12 rounded-lg border-select__control p-2"
                  value={agent?.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                />
              </div>
              <div className="">
                <label>Phone Number (example: 8130067178)</label>
                <input
                  type="text"
                  className="w-full h-12 rounded-lg border-select__control p-2"
                  value={agent?.mobile_number}
                  onChange={(e) =>
                    handleChange("mobile_number", e.target.value)
                  }
                />
              </div>
              <div className="">
                <label>Status</label>
                <select
                  className="w-full h-12 rounded-lg border-select__control p-2"
                  value={agent?.status || ""}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="available">Available</option>
                  <option value="not_available">Not Available</option>
                </select>
              </div>
            </div>
            <div className="w-[40%]">
              <div>
                <label>Assigned Area</label>
                <Select
                  options={socitiesList}
                  isMulti
                  classNamePrefix="border-select"
                  placeholder="Please select areas"
                  onChange={handleSelectOption}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex w-[100%] justify-between">
            <div className="bg-[#FEF2F7] w-[30%] border-2 border-gray rounded-lg shadow-xs pt-4 space-y-3 px-4 pb-4">
              <p className="font-bold text-lg">Work Details</p>
              <div className="space-y-1">
                <label className="text-[#878787] py-1">
                  WAREHOUSE ALLOCATED *
                </label>
                <div className="w-72">
                  <Select
                    options={socitiesList}
                    isMulti
                    classNamePrefix="border-select"
                    placeholder="Please select areas"
                    onChange={handleSelectOption}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[#878787]">REFFERED BY *</label>
                <div className="w-72">
                  <Select
                    options={socitiesList}
                    isMulti
                    classNamePrefix="border-select"
                    placeholder="Please select areas"
                    onChange={handleSelectOption}
                  />
                </div>
              </div>
              {/* joining date */}

              <div className="font-medium">Joining Date *</div>

              <DatePicker
                format={"DD-MM-YYYY"}
                placeholder="Select date"
                allowClear={false}
              />
              <div className="flex justify-between">
                <p>VEHICAL TYPE *</p>
                <p className="bg-[#FF80B4] px-8 border border-[#FF80B4] rounded-md">
                  Petrol
                </p>
                <p className="border border-[#FF80B4] px-8 rounded-md">
                  Electric
                </p>
              </div>
            </div>
            <div className="w-[50%] h-[200px]">
              <div className="ml-4">Action History</div>
              <div className="border border-gray border-2 w-[69%] h-72">
                <div className="p-2">Rejected Reasons....</div>
              </div>
            </div>
          </div>
          {/* Bank details  */}
          <div className="w-[40%] bg-[#FEF2F7] mt-4 border-2 border-gray rounded-lg shadow-xs pb-2">
            <div className="px-4 space-y-2 py-2">
              <p className="font-bold text-lg">Bank Details</p>
              <div className="">
                <input
                  type="text"
                  className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                  value={agent?.mobile_number}
                  placeholder="Bank account number *"
                  onChange={(e) =>
                    handleChange("mobile_number", e.target.value)
                  }
                />
              </div>
              <div className="">
                <input
                  type="text"
                  className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                  value={agent?.mobile_number}
                  placeholder="Account Holder's number *"
                  onChange={(e) =>
                    handleChange("mobile_number", e.target.value)
                  }
                />
              </div>
              <div className="flex justify-between">
                <div className="w-[48%]">
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                    value={agent?.mobile_number}
                    placeholder="IFSC Code *"
                    onChange={(e) =>
                      handleChange("mobile_number", e.target.value)
                    }
                  />
                </div>
                <div className="w-[48%]">
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                    value={agent?.mobile_number}
                    placeholder="Branch Name *"
                    onChange={(e) =>
                      handleChange("mobile_number", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Tabs.TabPane>

        {/* Page 2 - Documents */}
        <Tabs.TabPane tab="Documents" key="2">
          <div>
            {/* Adhar details */}
            <div>
              <p className="font-bold pb-1">Enter Aadhar Details</p>
              <div className="flex space-x-2">
                <input
                  className="py-3 px-2 w-52 border border-gray rounded-md h-12"
                  placeholder="Enter your Aadhar Number"
                />
                <FileAction
                  name={"Upload Aadhar Front JPG/PDF"}
                  upload={true}
                  display={true}
                  
                  download={true}
                />
                <FileAction
                  name={"Upload Aadhar Back JPG/PDF"}
                  upload={true}
                  display={true}
                 
                  download={true}
                />
              </div>
            </div>
            {/* DL details */}
            <div>
              <p className="font-bold pb-1">Driving License Details</p>
              <div className="flex space-x-2">
                <input
                  className="py-3 px-2 w-52 border border-gray rounded-md h-12"
                  placeholder="Enter your Aadhar Number"
                />
                <DatePicker
                  format={"DD-MM-YYYY"}
                  placeholder="Enter Expiry date"
                  allowClear={false}
                  className="h-12 w-48"
                />
                <FileAction
                  name={"Upload DL with expiry date Visible JPG/PDF"}
                  upload={true}
                  display={true}
                  
                  download={true}
                />
              </div>
            </div>
            {/* Insurance details */}
            <div>
              <p className="font-bold pb-1">Insurance Details</p>
              <div className="flex space-x-2">
                <DatePicker
                  format={"DD-MM-YYYY"}
                  placeholder="Enter Expiry date"
                  allowClear={false}
                  className="h-12 w-52"
                />
                <FileAction
                  name={"upload 2-wheeler insurance (JPG/PDF)"}
                  upload={true}
                  display={true}
                 
                  download={true}
                />
              </div>
            </div>
            {/* Registration details */}
            <div>
              <p className="font-bold pb-1">Registration Details</p>
              <div className="flex space-x-2">
                <input
                  className="py-3 px-2 w-52 border border-gray rounded-md h-12"
                  placeholder="Enter your Aadhar Number"
                />
                <DatePicker
                  format={"DD-MM-YYYY"}
                  placeholder="Enter Expiry date"
                  allowClear={false}
                  className="h-12 w-48"
                />
                <FileAction
                  name={"Upload DL with expiry date Visible JPG/PDF"}
                  upload={true}
                  display={true}
                 
                  download={true}
                />
                <FileAction
                  name={"Upload DL with expiry date Visible JPG/PDF"}
                  upload={true}
                  display={true}
                  
                  download={true}
                />
              </div>
            </div>
            {/* PAN details */}
            <div>
              <p className="font-bold pb-1">Insurance Details</p>
              <div className="flex space-x-2">
                <input
                  className="py-3 px-2 w-52 border border-gray rounded-md h-12"
                  placeholder="Enter your Aadhar Number"
                />

                <FileAction
                  name={"upload 2-wheeler insurance (JPG/PDF)"}
                  upload={true}
                  display={true}
                  
                  download={true}
                />
              </div>
            </div>
            {/* polution Check details */}
            <div>
              <p className="font-bold pb-1">Insurance Details</p>
              <div className="flex space-x-2">
                <DatePicker
                  format={"DD-MM-YYYY"}
                  placeholder="Enter Expiry date"
                  allowClear={false}
                  className="h-12 w-52"
                />
                <FileAction
                  name={"upload 2-wheeler insurance (JPG/PDF)"}
                  upload={true}
                  display={true}
                  download={true}
                />
              </div>
            </div>
            {/* Bank PassBook / cancelled Cheque  */}
            <div>
              <p className="font-bold pb-1">Bank Passbook/ Cancelled Cheque</p>
              <FileAction
                name={"upload 2-wheeler insurance (JPG/PDF)"}
                upload={true}
                display={true}
               
                download={true}
              />
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AgentCreation;
