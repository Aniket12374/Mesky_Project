import { useEffect, useState } from "react";
import Button from "../Common/Button";
import { httpVendor, httpVendorUpload } from "../../services/api-client";
import { addRider, getSocieties } from "../../services/riders/riderService";
import toast from "react-hot-toast";
import Select from "react-select";
import { DatePicker } from "antd";

const dateFormat = "YYYY/MM/DD";

const AgentCreation = ({ setShowAgentCreation }) => {
  const [agent, setAgent] = useState({});
  const [socitiesList, setSocitiesList] = useState([]);

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
      "mobile_number",
      "full_name",
      "society"
    );

    if (Object.keys(agent).length < fields.length) {
      console.log(Object.keys(agent));
      return toast.error("Please fill all the fields");
    }

    addRider(agent)
      .then((res) => {
        toast.success("Saved successfully");
        setShowAgentCreation(false);
      })
      .catch((err) => {
        console.log({ err });
        toast.error("Error occured!!");
      });
  };

  const handleSelectOption = (selectedOption) => {
    console.log({ selectedOption });
    handleChange(
      "society",
      selectedOption.map((x) => x.value)
    );
  };

  useEffect(() => {
    getSocieties().then((res) => {
      let list = res?.data?.data?.map((x) => ({
        label: x.name,
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

  console.log({ agent });

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
              className="w-full h-12 rounded-lg  shadow-inner shadow-fuchsia-400 p-2"
              value={agent?.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
            />
          </div>
          <div className="">
            <label>Phone Number</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg  shadow-inner shadow-fuchsia-400 p-2"
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
              <div className="text-lg font-medium">DOCUMENT</div>

              <div>
                <input
                  type="file"
                  id="driving-license"
                  name="driving-license"
                  onChange={(e) => handleUpload(e, "dl")}
                />
              </div>
              <div>
                <input
                  type="file"
                  id="aadhar-card"
                  name="aadhar-card"
                  onChange={(e) => handleUpload(e, "adhar")}
                />
              </div>
              <div>
                <input
                  type="file"
                  id="vehicle-name-plate"
                  name="vehicle-name-plate"
                  onChange={(e) => handleUpload(e, "veh_n_pl_im")}
                />
              </div>
              <div>
                <input
                  type="file"
                  id="vehicle-rc"
                  name="vehicle-rc"
                  onChange={(e) => handleUpload(e, "veh_rc")}
                />
              </div>
              <div>
                <input
                  type="file"
                  id="vehicle-insurance"
                  name="vehicle-insurance"
                  onChange={(e) => handleUpload(e, "veh_is")}
                />
              </div>
              <div>
                <input
                  type="file"
                  id="vehicle-puc"
                  name="vehicle-puc"
                  onChange={(e) => handleUpload(e, "poll_ch")}
                />
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-evenly">
            <div className="space-y-4">
              <div className="text-lg font-medium">ISSUE DATE</div>
              {issueDts.map((x) => (
                <div key={x}>
                  <DatePicker
                    placeholder={"select date"}
                    format={dateFormat}
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
                <div key={x}>
                  <DatePicker
                    format={dateFormat}
                    placeholder={"select date"}
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
