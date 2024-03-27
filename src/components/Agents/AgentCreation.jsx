import { useEffect, useState } from "react";
import Button from "../Common/Button";
import { httpVendor, httpVendorUpload } from "../../services/api-client";
import { addRider, getSocieties } from "../../services/riders/riderService";
import toast from "react-hot-toast";
import Select from "react-select";
import { DatePicker } from "antd";
import moment from "moment";

const dateFormat = "YYYY/MM/DD";

const AgentCreation = ({ setShowAgentCreation }) => {
  const [agent, setAgent] = useState({});
  const [socitiesList, setSocitiesList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({
    dl: false,
    adhar: false,
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

    const formData = new FormData();
    formData.append("files", files[0], files[0].name);

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
    const fields = [...expDts, ...issueDts];
    fields.push(
      "dl",
      "adhar",
      "veh_n_pl_im",
      "veh_rc",
      "poll_ch",
      "veh_is",
      "mobile_number",
      "full_name",
      "society"
    );

    if (Object.keys(agent).length < fields.length) {
      return toast.error("Please fill all the fields");
    }

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
      <div className="flex justify-end">
        <Button btnName={"Save"} onClick={handleSaveAgent} />
        <Button
          btnName={"Cancel"}
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
            <label>Phone Number</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg  border-select__control  p-2"
              value={agent?.mobile_number}
              onChange={(e) => handleChange("mobile_number", e.target.value)}
            />
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
      <div>
        <div className="font-bold text-2xl">Documents</div>
        <div className="flex justify-evenly w-full">
          <div className="w-1/2 flex justify-evenly">
            <div className="space-y-4">
              <div className="text-lg font-medium">TYPE</div>
              <div>Driving License</div>
              <div>Aadhaar Card</div>
              <div>Vehicle Name Plate Image</div>
              <div>Vehicle RC</div>
              <div>Vehicle Insurance</div>
              <div>Vehicle (PUC) Pollution Check</div>
            </div>
            <div className="space-y-3">
              <div className="text-lg text-center font-medium">DOCUMENT</div>
              <div className="upload-container">
                <label
                  htmlFor="driving-license"
                  className={`w-full block text-center rounded-2xl ${
                    uploadedFiles.dl ? "bg-red-500" : "bg-[#df4584]"
                  } shadow-md shadow-slate-400 text-white py-[2px] text-base`}
                >
                  {uploadedFiles.dl ? "Uploaded" : "Upload"}
                </label>
                <input
                  type="file"
                  id="driving-license"
                  name="driving-license"
                  onChange={(e) => handleUpload(e, "dl")}
                  hidden
                />
              </div>

              <div className="upload-container">
                <label
                  htmlFor="aadhar-card"
                  className={`w-full block text-center rounded-2xl ${
                    uploadedFiles.adhar ? "bg-red-500" : "bg-[#df4584]"
                  } shadow-md shadow-slate-400 text-white py-[2px] text-base`}
                >
                  {uploadedFiles.adhar ? "Uploaded" : "Upload"}
                </label>
                <input
                  type="file"
                  id="aadhar-card"
                  name="aadhar-card"
                  onChange={(e) => handleUpload(e, "adhar")}
                  hidden
                />
              </div>
              <div className="upload-container">
                <label
                  htmlFor="vehicle-name-plate"
                  className={`w-full block text-center rounded-2xl ${
                    uploadedFiles.veh_n_pl_im ? "bg-red-500" : "bg-[#df4584]"
                  } shadow-md shadow-slate-400 text-white py-[2px] text-base`}
                >
                  {uploadedFiles.veh_n_pl_im ? "Uploaded" : "Upload"}
                </label>
                <input
                  type="file"
                  id="vehicle-name-plate"
                  name="vehicle-name-plate"
                  onChange={(e) => handleUpload(e, "veh_n_pl_im")}
                  hidden
                />
              </div>
              <div className="upload-container">
                <label
                  htmlFor="vehicle-rc"
                  className={`w-full block text-center rounded-2xl ${
                    uploadedFiles.veh_rc ? "bg-red-500" : "bg-[#df4584]"
                  } shadow-md shadow-slate-400 text-white py-[2px] text-base`}
                >
                  {uploadedFiles.veh_rc ? "Uploaded" : "Upload"}
                </label>
                <input
                  type="file"
                  id="vehicle-rc"
                  name="vehicle-rc"
                  onChange={(e) => handleUpload(e, "veh_rc")}
                  hidden
                />
              </div>
              <div className="upload-container">
                <label
                  htmlFor="vehicle-insurance"
                  className={`w-full block text-center rounded-2xl ${
                    uploadedFiles.veh_is ? "bg-red-500" : "bg-[#df4584]"
                  } shadow-md shadow-slate-400 text-white py-[2px] text-base`}
                >
                  {uploadedFiles.veh_is ? "Uploaded" : "Upload"}
                </label>
                <input
                  type="file"
                  id="vehicle-insurance"
                  name="vehicle-insurance"
                  onChange={(e) => handleUpload(e, "veh_is")}
                  hidden
                />
              </div>
              <div className="upload-container">
                <label
                  htmlFor="vehicle-puc"
                  className={`w-full block text-center rounded-2xl ${
                    uploadedFiles.poll_ch ? "bg-red-500" : "bg-[#df4584]"
                  } shadow-md shadow-slate-400 text-white py-[2px] text-base`}
                >
                  {uploadedFiles.poll_ch ? "Uploaded" : "Upload"}
                </label>
                <input
                  type="file"
                  id="vehicle-puc"
                  name="vehicle-puc"
                  onChange={(e) => handleUpload(e, "poll_ch")}
                  hidden
                />
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-evenly">
            <div className="space-y-4">
              <div className="text-lg font-medium">ISSUE DATE</div>
              {issueDts.map((x) => (
                <div key={x} className="border-[#808080] border rounded-md">
                  <DatePicker
                    placeholder={"select date"}
                    format={dateFormat}
                    disabledDate={disabledFutureDate}
                    onChange={(date, dateString) => {
                      handleChange(x, dateString);
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="text-lg font-medium">EXPIRY DATE</div>
              {expDts.map((x) => (
                <div key={x} className="border-[#808080] border rounded-md">
                  <DatePicker
                    format={dateFormat}
                    placeholder={"select date"}
                    disabledDate={disabledPastDate}
                    onChange={(date, dateString) => {
                      handleChange(x, dateString);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCreation;
