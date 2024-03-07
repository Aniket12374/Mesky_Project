import React, { useState, useEffect } from "react";
import { Checkbox } from "antd";
import classNames from "classnames";
import { toast } from "react-hot-toast";
import { Header } from "../../utils";
import {
  getCamapignDetails,
  readyToCollaborate,
  updateCommission,
} from "../../services/campaign/campaignService";

const CampaignDetail = () => {
  const defaultCommisionValues = {
    commission1: "",
    commission2: "",
    commission3: "",
    commission4: "",
  };
  const [isChecked, setChecked] = useState(false);
  const [isEnabled, setEnabled] = useState(false);
  const [aggrementText, setAggrementText] = useState("");
  const [isAccepted, setAccepted] = useState(false);
  const [priceValue, setPriceValue] = useState(defaultCommisionValues);
  const [collaborateData, setCollaborateData] = useState({});

  useEffect(() => {
    getCamapignDetails().then((res) => {
      let result = res.data;
      if (result && Object.keys(result).includes("message")) {
        setChecked(false);
        setEnabled(true);
      } else {
        const commissionData = result.commission_structure;
        const commissionPrice = commissionData.map((data) => data.commission);
        setAccepted(true);

        if (result.status === "EXPIRED") setChecked(false);
        else setChecked(true);

        setCollaborateData(result);
        setEnabled(result.checkbox_disabled);
        setPriceValue({
          commission1: commissionPrice[0],
          commission2: commissionPrice[1],
          commission3: commissionPrice[3],
          commission4: commissionPrice[4],
        });
      }
    });
  }, []);

  const handleAccept = () => {
    setAccepted(true);
  };

  const handleChecked = () => {
    isChecked === true &&
      readyToCollaborate(false).then((res) => {
        if (res?.data?.message === "Can't deativate before 30 days.") {
          toast.error(res.data.message, {
            position: "top-center",
          });
        } else {
          setChecked(!isChecked);
          setAccepted(false);
        }
      });
  };

  const handleCancel = () => {
    setAccepted(false);
    setChecked(false);
  };

  const submitCommission = () => {
    let data = {
      commission1: Number(priceValue["commission1"]),
      commission2: Number(priceValue["commission2"]),
      commission3: Number(priceValue["commission3"]),
      commission4: Number(priceValue["commission4"]),
    };
    readyToCollaborate(true).then((res) => {
      console.log(res);
    });

    updateCommission(data).then((res) => {
      toast.success("Updated Successfully", {
        position: "bottom-right",
      });
    });
  };

  return (
    <div>
      <div className="campaigns">
        <Header HeaderText="Campaigns" className="mb-10" />
        <div className="campaign-checkbox flex items-center space-x-3">
          <Checkbox
            checked={isChecked}
            onChange={handleChecked}
            disabled={!isEnabled}
          ></Checkbox>
          <div className="text-3xl font-semibold">
            I want to collaborate with creators
          </div>
        </div>
        {isChecked ? (
          <>
            {!isAccepted ? (
              <>
                <div className="campaign-aggrement text-center">
                  <textarea
                    className="border-2 border-sky-400 rounded-lg mt-5 p-3"
                    cols={100}
                    rows={15}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellendus reiciendis quae incidunt, repudiandae possimus
                    voluptatibus placeat. Fugit cum est quidem consequuntur,
                    quia vitae, similique itaque dolores harum in velit fuga.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellendus reiciendis quae incidunt, repudiandae possimus
                    voluptatibus placeat. Fugit cum est quidem consequuntur,
                    quia vitae, similique itaque dolores harum in velit fuga.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellendus reiciendis vitae, similique itaque dolores harum
                    in velit fuga. Lorem ipsum
                  </textarea>
                  <div className="campaign-aggrement-buttons text-center space-x-4 mt-3">
                    <button
                      className="bg-sky-500 hover:bg-sky-700 text-white rounded-lg p-2"
                      onClick={handleAccept}
                    >
                      I ACCEPT THE AGREEMENT
                    </button>
                    <button
                      className="bg-gray-400 text-white rounded-lg p-2"
                      onClick={handleCancel}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="set-commision-prices">
                <div className="text-3xl font-semibold  w-7/12 text-center mt-10">
                  {priceValue["commission1"]
                    ? "Current Commission by Product Price"
                    : "Set Commission by Product Price"}
                </div>
                <div className="prices">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitCommission();
                    }}
                  >
                    <div className="w-7/12 justify-center items-center text-center my-10">
                      <div
                        className="flex items-center space-x-5 
                      mb-5"
                      >
                        <div className="w-1/2">Below ₹ 500</div>
                        <input
                          value={priceValue["commission1"]}
                          onChange={(e) =>
                            setPriceValue((prev) => ({
                              ...prev,
                              commission1: e.target.value,
                            }))
                          }
                          disabled={!isEnabled}
                          type="number"
                          placeholder="E.g. 5%"
                          className="w-1/2 border-2 p-3 rounded-2xl bg-gradient-to-l from-[#E7EDF2] to-[#F5F7FA]"
                        />
                      </div>
                      <div
                        className="flex items-center space-x-5 
                      mb-5"
                      >
                        <div className="w-1/2">₹ 500 - ₹ 1,000</div>
                        <input
                          value={priceValue["commission2"]}
                          type="number"
                          onChange={(e) =>
                            setPriceValue((prev) => ({
                              ...prev,
                              commission2: e.target.value,
                            }))
                          }
                          disabled={!isEnabled}
                          placeholder="E.g. 5%"
                          className="w-1/2 border-2 p-3 rounded-2xl bg-gradient-to-l from-[#E7EDF2] to-[#F5F7FA]"
                        />
                      </div>
                      <div
                        className="flex items-center space-x-5 
                      mb-5"
                      >
                        <div className="w-1/2">₹ 1,000 - ₹ 2,000</div>
                        <input
                          value={priceValue["commission3"]}
                          type="number"
                          onChange={(e) =>
                            setPriceValue((prev) => ({
                              ...prev,
                              commission3: e.target.value,
                            }))
                          }
                          disabled={!isEnabled}
                          placeholder="E.g. 5%"
                          className="w-1/2 border-2 p-3 rounded-2xl bg-gradient-to-l from-[#E7EDF2] to-[#F5F7FA]"
                        />
                      </div>
                      <div
                        className="flex items-center space-x-5 
                      mb-5"
                      >
                        <div className="w-1/2">Above ₹ 2,000</div>
                        <input
                          type="number"
                          value={priceValue["commission4"]}
                          onChange={(e) =>
                            setPriceValue((prev) => ({
                              ...prev,
                              commission4: e.target.value,
                            }))
                          }
                          disabled={!isEnabled}
                          placeholder="E.g. 5%"
                          className="w-1/2 border-2 p-3 rounded-2xl bg-gradient-to-l from-[#E7EDF2] to-[#F5F7FA]"
                        />
                      </div>
                      <button
                        className={classNames(
                          "bg-sky-500 hover:bg-sky-700 text-white rounded-lg p-2 w-36 mt-2",
                          {
                            "bg-slate-400 hover:bg-slate-300": !isEnabled,
                          }
                        )}
                        disabled={!isEnabled}
                      >
                        {priceValue["commission1"] ? "Edit" : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-3xl font-semibold  w-7/12 m-auto text-center my-20">
            Your Brand is no longer open for collaborations with Creators.
            Please select the checkbox to <br />
            enable the collaborations.{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
