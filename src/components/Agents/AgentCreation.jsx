import { useEffect, useState } from "react";
import Button from "../Common/Button";
import { httpVendor, httpVendorUpload } from "../../services/api-client";
import {
  addRider,
  getSocieties,
  getRiderData,
  getRiderHistory,
  getWarehouses,
  feedBackRider,
  getRiderFeedback,
  modifyRider,
  getRiderInfo,
} from "../../services/riders/riderService";
import toast from "react-hot-toast";
import Select from "react-select";
import { DatePicker, Modal, Tabs } from "antd";
import moment from "moment";
import FileAction from "../shared/FileAction";
import AgentDetail from "./AgentDetail";
import RiderHistory from "./RiderHistory";
import AgentDoc from "./AgentDoc";
import dayjs from "dayjs";

const dateFormat = "YYYY/MM/DD";

const AgentCreation = ({
  setShowAgentCreation,
  rowData,
  setSelectedRowData,
  refetch,
}) => {
  const [agent, setAgent] = useState({});
  const [socitiesList, setSocitiesList] = useState([]);

  const [rejectionModel, setRejectionModel] = useState(false);
  const [riderFeedback, setRiderFeedback] = useState("");
  const [riderActions, setRiderActions] = useState();
  const [isDisable, setIsDisable] = useState(true);
  const [wareHouseList, setWareHouseList] = useState([]);
  const [referenceList, setReferenceList] = useState([]);

  const uniqueDates = Array.from(
    new Set(
      riderActions?.map((action) => {
        const date = new Date(action.created_date);
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      })
    )
  );

  console.log("uniqueDates", uniqueDates);

  // const [uploadedFiles, setUploadedFiles] = useState({
  //   dl: false,
  //   adhar_front: false,
  //   adhar_back: false,
  //   veh_n_pl_im: false,
  //   veh_rc: false,
  //   veh_is: false,
  //   poll_ch: false,
  // });
  const [docs, setDocs] = useState();
  console.log("row", rowData);

  const [agentInfo, setAgentInfo] = useState({
    full_name: rowData?.agent_name || "",
    mobile_number: rowData?.phone_number || "",
    status: rowData?.status || "",
    society_ids: rowData?.society_ids || [],
    assigned_areas: rowData?.assigned_area || [],
    warehouse: [] || null,
    referred_by: docs?.refered_by_rider.full_name || "",
    joining_date: null,
    vehicle_type: "Petrol",
    bank_account_number: docs?.bank_details.account_number || "",
    account_holder_name: docs?.bank_details.account_holder_name || "",
    ifsc_code: docs?.bank_details.ifsc_code || "",
    branch_name: docs?.bank_details.branch_name || "",
  });

  console.log("agentInfo", agentInfo);

  const [formData, setFormData] = useState({
    aadharNumber: docs?.adhar || "",
    aadharFront: null,
    aadharBack: null,
    drivingLicenseNumber: docs?.dl_details?.document_number || "",
    drivingLicenseExpiry: docs?.dl_details?.expiry_date || null,
    drivingLicenseFile: docs?.dl || null,
    insuranceExpiry: null,
    insuranceFile: docs?.veh_ins || null,
    rcNumber: docs?.rc_details.document_number || "",
    rcExpiry: docs?.rc_details.expiry_date || null,
    rcFile: docs?.veh_rc || null,
    rcVehiclePicture: docs?.veh_n_pl_im || null,
    panNumber: "",
    panFile: null,
    pollutionCheckExpiry: docs?.pol_check_details.expiry_date || null,
    pollutionCheckFile: docs?.poll_ch || null,
    bankPassbookCheque: docs?.bank_details.passbook_or_cancelled_cheque || null,
  });
  console.log("formData", formData);

  useEffect(() => {
    getRiderInfo().then((res) => {
      setReferenceList(res?.data);
    });
    getWarehouses().then((res) => {
      setWareHouseList(res?.data);
    });
    getSocieties().then((res) => {
      let list = res?.data?.data?.map((x) => ({
        label: x.sector,
        value: x.id,
      }));
      setSocitiesList(list);
    });

    handleChange("rider_id", rowData?.s_no);

    // Object?.keys(rowData).map((row) => {
    //   setAgent((prev) => ({ ...prev, ...{ [row]: rowData[row] } }));
    // });

    let agentAssignedAreas = rowData?.assigned_area?.map((x) =>
      x.replace(", ", "")
    );

    setAgentInfo((prev) => ({
      ...prev,
      ...{ assigned_areas: agentAssignedAreas },
    }));

    getRiderHistory(rowData?.s_no).then((res) => {
      let list = [];
      res?.data?.data.map((x) => {
        list.push({
          order_date: x.accept_date,
          order_id: x.order.uid,
          customer_name: x.order.full_name,
          society_name: x.society.name,
          delivery: x.order.line_1 + " " + x.order.line_2,
          agent_name: x.rider.map((x) => x.full_name),
          status: x.status.del_status,
          del_image: x.status.del_img,
          image_log: x.status.img_status,
          align: "center",
        });
      });

      // setHistoryData(list);
    });
  }, []);

  useEffect(() => {
    getRiderData(rowData?.s_no)
      .then((res) => {
        const data = res?.data;
        console.log("data", data);
        // const { poll_ch, veh_ins, veh_n_pl_im, veh_rc, dl } = data;
        setAgentInfo((prev) => ({
          ...prev,
          warehouse: data?.allocated_warehouse || [],
          referred_by: data?.refered_by_rider.full_name || "",
          joining_date: data?.joining_date,
          vehicle_type: "Petrol",
          bank_account_number: data?.bank_details.account_number || "",
          account_holder_number: data?.bank_details.account_holder_name || "",
          ifsc_code: data?.bank_details.ifsc_code || "",
          branch_name: data?.bank_details.branch_name || "",
        }));
        setFormData({
          aadharNumber: data?.adhar || "",
          aadharFront: data?.aadhar_details.adhar_front || null,
          aadharBack: data?.aadhar_details.adhar_back || null,
          drivingLicenseNumber: data?.dl_details?.document_number || "",
          drivingLicenseExpiry: data?.dl_details?.expiry_date || "",
          drivingLicenseFile: data?.dl || null,
          insuranceExpiry: data?.veh_ins_ex_date || "",
          insuranceFile: data?.veh_ins || null,
          rcNumber: data?.rc_details.document_number || "",
          rcExpiry: data?.rc_details.expiry_date || "",
          rcFile: data?.veh_rc || null,
          rcVehiclePicture: data?.veh_n_pl_im || null,
          panNumber: data?.document_number || "",
          panFile: null,
          pollutionCheckExpiry: data?.pol_check_details.expiry_date || "",
          pollutionCheckFile: data?.poll_ch || null,
          bankPassbookCheque:
            data?.bank_details.passbook_or_cancelled_cheque || null,
        });
      })
      .catch((err) => console.log({ err }));
  }, []);

  useEffect(() => {
    getRiderFeedback(rowData?.s_no).then((res) => {
      setRiderActions(res?.data);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (key, date) => {
    setFormData((prev) => ({
      ...prev,
      [key]: date,
    }));
  };

  const handleVehicleTypeChange = (type) => {
    setAgentInfo((prev) => ({
      ...prev,
      vehicle_type: type,
    }));
  };

  const handleChange = (key, value) => {
    setAgentInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // const [fileType, setFileType] = useState("");

  // const handleChange = (key, value) => {
  //   setAgentInfo((prev) => ({ ...prev, ...{ [key]: value } }));
  // };

  // const handleUpload = (event, key) => {
  //   let files = event.target.files;

  //   // Check if a file is selected
  //   if (files.length === 0) {
  //     return; // No file selected
  //   }

  //   // Check file type
  //   const allowedTypes = [
  //     "application/pdf",
  //     "image/jpeg",
  //     "image/jpg",
  //     "image/png",
  //   ];
  //   const fileType = files[0].type;

  //   // Extract file extension from the file name
  //   const fileName = files[0].name;
  //   const fileExtension = fileName.split(".").pop().toLowerCase();

  //   // Check both MIME type and file extension
  //   if (
  //     !allowedTypes.includes(fileType) ||
  //     !["pdf", "jpeg", "jpg", "png"].includes(fileExtension)
  //   ) {
  //     // Invalid file type
  //     toast.error("Please upload PDF, JPEG, JPG, or PNG files only.");
  //     return;
  //   }

  //   // Proceed with file upload
  //   const formData = new FormData();
  //   formData.append("files", files[0], fileName);

  //   httpVendorUpload
  //     .post("/api/upload/multiple-image", formData)
  //     .then((res) => {
  //       const links = res.data.links;
  //       handleChange(key, links.length > 0 ? links[0] : null);
  //       setUploadedFiles((prev) => ({ ...prev, [key]: true }));
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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
    const missingFields = requiredFields?.filter((field) => !agent[field]);

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
    const selectedSocietyIds = selectedOption.map((x) => x.value);
    const selectedAssignedAreas = selectedOption.map((x) => x.label);

    setAgentInfo((prevState) => ({
      ...prevState,
      society_ids: selectedSocietyIds,
      assigned_areas: selectedAssignedAreas,
    }));
  };

  const handleOptionChange = (selectedOption, key) => {
    setAgentInfo((prev) => ({
      ...prev,
      [key]: selectedOption,
    }));
  };

  const handleRiderFeedback = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    const data = {
      rider_id: rowData.s_no,
      feedback: riderFeedback,
    };

    try {
      await feedBackRider(data);
      toast.success("Feed Back Submited Successfully");
      setRejectionModel(false);
      // handle successful response
    } catch (error) {
      // handle error response
    }
  };

  const handleVerifyAgent = async () => {
    try {
      let agent = {
        rider_id: rowData?.s_no,
        status: agentInfo?.status,
        society_ids: agentInfo.society_ids,
        full_name: agentInfo?.full_name,
        warehouse_id: agentInfo?.warehouse.id,
        tentative_date_of_joining: agentInfo?.joining_date,
        vehicle_type: agentInfo?.vehicle_type,
        mobile_number: agentInfo?.mobile_number,
        account_number: agentInfo?.bank_account_number,
        account_holder_name: agentInfo?.account_holder_name,
        ifsc_code: agentInfo?.ifsc_code,
        branch_name: agentInfo?.branch_name,
        aadhar_number: formData?.aadharNumber,
        aadhar_front: formData?.aadharFront,
        aadhar_back: formData?.aadharBack,
        dl_number: formData?.drivingLicenseNumber,
        dl_img: formData?.drivingLicenseFile,
        dl_exp: formData?.drivingLicenseExpiry,
        dl_n_plate: formData?.rcVehiclePicture,
        // insurance_number: formData,
        insurance_img: formData?.insuranceFile,
        insuranceExpiry: dayjs(formData.insuranceExpiry).format("DD-MM-YYYY"),
        registration_number: formData?.rcNumber,
        registration_img: formData?.rcFile,
        registration_exp: formData?.rcExpiry,
        pan_number: formData?.panNumber,
        pan_img: formData?.panFile,
        // pol_check_number: formData,
        pol_check_img: formData?.pollutionCheckFile,
        pol_check_exp: formData?.pollutionCheckExpiry,
        passbk_canc_check_img: formData?.bankPassbookCheque,
      };
      const response = await modifyRider(agent);
      if (response.data?.message) {
        const errorMessage = response.data.message;

        // Check if the message contains "sector already allocated"
        if (errorMessage.includes("sector already allocated")) {
          // Extract rider name and sector from the message
          const match = errorMessage.match(
            /\{'rider': '([^']*)', 'society': '([^']*)'\}/
          );
          if (match) {
            const riderName = match[1];
            const sector = match[2];
            // Display a customized error message

            toast.error(
              `Sector already allocated to ${riderName} in ${sector}`
            );
            handleChange("assigned_area", rowData?.assigned_area);
          } else {
            // If unable to extract rider name and sector, display original message
            toast.error(errorMessage);
            handleChange("assigned_area", rowData?.assigned_area);
          }
        } else {
          // Display original message if it doesn't contain "sector already allocated"
          toast.error(errorMessage);
          handleChange("assigned_area", rowData?.assigned_area);
        }
      } else {
        setEditable(false);
        refetch();
        toast.success("Successfully Edited");
      }
    } catch (error) {
      toast.error("Error Occurred");
      handleChange("assigned_area", rowData?.assigned_area);
    }
  };
  // useEffect(() => {
  //   getSocieties().then((res) => {
  //     let list = res?.data?.data?.map((x) => ({
  //       label: x.sector,
  //       value: x.id,
  //     }));
  //     setSocitiesList(list);
  //   });
  // }, []);

  // const issueDts = [
  //   "dl_i_date",
  //   "adhar_i_date",
  //   "veh_n_pl_im_i_date",
  //   "veh_rc_i_date",
  //   "poll_ch_i_date",
  // ];

  // const expDts = [
  //   "dl_ex_date",
  //   "adhar_ex_date",
  //   "veh_n_pl_im_ex_date",
  //   "veh_rc_ex_date",
  //   "poll_ch_ex_date",
  // ];

  // const dateFormat = "YYYY-MM-DD";

  // function disabledFutureDate(current) {
  //   return current && current > moment().endOf("day");
  // }

  // function disabledPastDate(current) {
  //   return current && current < moment().startOf("day");
  // }

  const statusOptions = [
    { value: "NOT AVAILABLE", label: "Not Available" },
    { value: "VERIFICATION PENDING", label: "Verification Pending" },
    { value: "REJECTED", label: "Rejected" },
    { value: "AVAILABLE", label: "Available" },
  ];

  return (
    <>
      <div>
        {/* Tabs for Page 1 and Page 2 */}
        <Tabs defaultActiveKey="1" started>
          {/* Page 1 - Agent Information */}
          <Tabs.TabPane tab="Agent Info" key="1">
            <div className="w-full flex justify-end ">
              <Button
                btnName={!isDisable ? "Disable" : "Edit"}
                onClick={() => {
                  setIsDisable(!isDisable);
                  toast.success(!isDisable ? "Edit disabled" : "Edit Enabled");
                }}
              />
              <Button btnName={"Verify"} onClick={handleVerifyAgent} />
              <Button
                btnName={"Reject"}
                onClick={() => {
                  setRejectionModel(true);
                }}
              />
            </div>

            <div className="flex space-x-5 w-full justify-start">
              <div className="w-[40%] space-y-2">
                <div className="">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg border-select__control p-2"
                    value={agentInfo.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    disabled={isDisable}
                  />
                </div>
                <div className="">
                  <label>Phone Number (example: 8130067178)</label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg border-select__control p-2"
                    value={agentInfo.mobile_number}
                    onChange={(e) =>
                      handleChange("mobile_number", e.target.value)
                    }
                    disabled={isDisable}
                  />
                </div>
                <div className="">
                  <label>Status</label>
                  <select
                    className="w-full h-12 rounded-lg border-select__control p-2"
                    value={agentInfo.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    disabled={isDisable}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-[40%]">
                <div className={isDisable && `pointer-events-none`}>
                  <label>Assigned Area</label>
                  <Select
                    options={socitiesList}
                    isMulti={true}
                    placeholder="Please select areas"
                    onChange={handleSelectOption}
                    className="w-full"
                    classNamePrefix="border-select"
                    value={socitiesList.filter((society) =>
                      agentInfo?.assigned_areas?.includes(society.label)
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex w-[100%] justify-between">
              <div className="bg-[#FEF2F7] w-[30%] border-2 border-gray rounded-lg shadow-xs pt-4 space-y-3 px-4 pb-4">
                <p className="font-bold text-lg">Work Details</p>
                <div className={isDisable && `pointer-events-none`}>
                  <label className="text-[#878787] py-1">
                    WAREHOUSE ALLOCATED *
                  </label>
                  <Select
                    options={wareHouseList} // The array of warehouse objects
                    getOptionLabel={(option) => option.name} // Display warehouse name in dropdown
                    getOptionValue={(option) => option.id} // Use the warehouse id as the value
                    value={wareHouseList.find(
                      (ware) => ware.id === agentInfo?.warehouse?.id
                    )} // Display selected warehouse by matching id
                    onChange={(selectedOption) =>
                      handleOptionChange(selectedOption, "warehouse")
                    }
                    classNamePrefix="border-select"
                    placeholder="Please select warehouse"
                    isMulti={false} // Assuming single selection
                    disabled={isDisable}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#878787]">REFFERED BY *</label>
                  <Select
                    options={referenceList}
                    isMulti
                    classNamePrefix="border-select"
                    placeholder="Please select reference"
                    getOptionLabel={(option) => option.full_name} // Display warehouse name in dropdown
                    getOptionValue={(option) => option.id} // Use the warehouse id as the value
                    value={referenceList.find(
                      (list) => list.id === agentInfo?.referred_by?.id
                    )}
                    onChange={(selectedOption) =>
                      handleOptionChange(selectedOption, "referred_by")
                    }
                    disabled={isDisable}
                  />
                </div>

                <div className="font-medium">Joining Date *</div>
                <DatePicker
                  format={"DD-MM-YYYY"}
                  placeholder="Select date"
                  allowClear={false}
                  onChange={(date) => handleChange("joining_date", date)}
                  disabled={isDisable}
                />

                <div className="flex justify-between">
                  <p>VEHICAL TYPE *</p>
                  <p
                    className={`px-8 border rounded-md ${
                      agentInfo.vehicle_type === "Petrol"
                        ? "bg-[#FF80B4] border-[#FF80B4]"
                        : ""
                    } cursor-pointer`}
                    onClick={() => handleVehicleTypeChange("Petrol")}
                  >
                    Petrol
                  </p>
                  <p
                    className={`px-8 border rounded-md ${
                      agentInfo.vehicle_type === "Electric"
                        ? "bg-[#FF80B4] border-[#FF80B4]"
                        : ""
                    } cursor-pointer`}
                    onClick={() => handleVehicleTypeChange("Electric")}
                  >
                    Electric
                  </p>
                </div>
              </div>

              <div className="w-[50%] h-[200px]">
                <div className="ml-4">Action History</div>
                <div className="border border-gray border-2 w-[69%] h-72 p-3">
                  {riderActions?.map((val) => (
                    <div key={val.created_date}>
                      <div className="font-medium text-md underline">
                        Date:{" "}
                        <span className="underline">
                          {new Date(val.created_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>{" "}
                        | Delivery TL Name:{" "}
                        <span className="underline">
                          {val.feedback_by.first_name +
                            " " +
                            val.feedback_by.last_name}
                        </span>
                      </div>
                      <ul className="list-disc list-inside ml-5">
                        <li>{val?.feedback}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bank details */}
            <div className="w-[40%] bg-[#FEF2F7] mt-4 border-2 border-gray rounded-lg shadow-xs pb-2">
              <div className="px-4 space-y-2 py-2">
                <p className="font-bold text-lg">Bank Details</p>
                <div className="">
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                    value={agentInfo.bank_account_number}
                    placeholder="Bank account number *"
                    onChange={(e) =>
                      handleChange("bank_account_number", e.target.value)
                    }
                    disabled={isDisable}
                  />
                </div>
                <div className="">
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                    value={agentInfo.account_holder_name}
                    placeholder="Account Holder's number *"
                    onChange={(e) =>
                      handleChange("account_holder_name", e.target.value)
                    }
                    disabled={isDisable}
                  />
                </div>
                <div className="flex justify-between">
                  <div className="w-[48%]">
                    <input
                      type="text"
                      className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                      value={agentInfo.ifsc_code}
                      placeholder="IFSC Code *"
                      onChange={(e) =>
                        handleChange("ifsc_code", e.target.value)
                      }
                      disabled={isDisable}
                    />
                  </div>
                  <div className="w-[48%]">
                    <input
                      type="text"
                      className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                      value={agentInfo.branch_name}
                      placeholder="Branch Name *"
                      onChange={(e) =>
                        handleChange("branch_name", e.target.value)
                      }
                      disabled={isDisable}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tabs.TabPane>

          {/* Page 2 - Documents */}
          <Tabs.TabPane tab="Documents" key="2">
            <AgentDoc
              formData={formData}
              setFormData={setFormData}
              // handleUpload={handleUpload}
              handleInputChange={handleInputChange}
              handleDateChange={handleDateChange}
              isDisable={isDisable}
            />
          </Tabs.TabPane>
          {/* Page 3 -  Delivery History*/}
          {rowData && (
            <Tabs.TabPane tab="Delivery History" key="3">
              <RiderHistory rowData={rowData} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
      <Modal
        open={rejectionModel}
        onCancel={() => setRejectionModel(false)}
        footer={null}
        title="Action History"
        centered
      >
        <form>
          <div className="flex flex-col">
            <textarea
              onChange={(e) => setRiderFeedback(e.target.value)}
              placeholder="Enter rejection Feedback"
              className="border border-gray-300 rounded-lg p-4 shadow-md h-72"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleRiderFeedback}
              className="bg-[#DF4584] px-8 text-white p-2 mr-2 rounded-3xl relative top-2"
            >
              submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AgentCreation;
