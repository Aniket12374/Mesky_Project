import Select from "react-select";
import Button from "../Common/Button";
import DataTable from "../Common/DataTable/DataTable";
import { useEffect, useState } from "react";
import {
  getRiderData,
  getRiderHistory,
  getSocieties,
  modifyRider,
} from "../../services/riders/riderService";
import toast from "react-hot-toast";
import { DatePicker, Tabs } from "antd";
import FileAction from "../shared/FileAction";

const colorStatus = {
  DELIVERED: "#9c29c1",
  "IN PROGRESS": "#FFD700",
  CANCELLED: "#FF0028",
  RECIEVED: "#9c29c1",
  "NOT RECEIVED": "#FFD700",
};

const AgentDetail = ({
  rowData,
  setShowAgentCreation,
  setSelectedRowData,
  refetch,
}) => {
  const [socitiesList, setSocitiesList] = useState([]);
  const [agent, setAgent] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [editable, setEditable] = useState(false);
  const [documents, setDocuments] = useState({
    "Pollution Chalan": "",
    "Vehicle Insurance": "",
    "Vehicle No Plate Image": "",
    "Vehicle RC": "",
    "Driver License": "",
  });
  const { TabPane } = Tabs;

  useEffect(() => {
    getSocieties().then((res) => {
      let list = res?.data?.data?.map((x) => ({
        label: x.sector,
        value: x.id,
      }));
      setSocitiesList(list);
    });

    handleChange("rider_id", rowData?.s_no);

    Object.keys(rowData).map((row) => {
      setAgent((prev) => ({ ...prev, ...{ [row]: rowData[row] } }));
    });

    let agentAssignedAreas = rowData?.assigned_area?.map((x) =>
      x.replace(", ", "")
    );

    setAgent((prev) => ({
      ...prev,
      ...{ assigned_area: agentAssignedAreas },
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

      setHistoryData(list);
    });
  }, []);

  useEffect(() => {
    getRiderData(rowData?.s_no)
      .then((res) => {
        const data = res?.data;
        const { poll_ch, veh_ins, veh_n_pl_im, veh_rc, dl } = data;
        setDocuments({
          "Pollution Chalan": poll_ch,
          "Vehicle Insurance": veh_ins,
          "Vehicle No Plate Image": veh_n_pl_im,
          "Vehicle RC": veh_rc,
          "Driver License": dl,
        });
      })
      .catch((err) => console.log({ err }));
  }, []);

  const handleChange = (key, value) => {
    setAgent((prev) => ({ ...prev, ...{ [key]: value } }));
  };

  const handleSelectOption = (selectedOption) => {
    handleChange(
      "society_ids",
      selectedOption.map((x) => x.value)
    );

    handleChange(
      "assigned_area",
      selectedOption.map((x) => x.label)
    );
  };

  const handleChangePhoneNum = (e) => {
    setAgent({ ...agent, phone_number: e.target.value });
  };

  const statusOptions = [
    {
      label: "AVAILABLE",
      value: "AVAILABLE",
    },
    {
      label: "NOT AVAILABLE",
      value: "NOT AVAILABLE",
    },
  ];

  const HistoryHeaders = [
    {
      title: "ORDER DATE",
      dataIndex: "order_date",
      // align: "center",
      key: "order_date",
      width: 100,
    },
    {
      title: "ORDER ID",
      dataIndex: "order_id",
      key: "order_id",
      // align: "center",
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customer_name",
      // align: "center",
      key: "customer_name",
    },
    {
      title: "SOCIETY NAME",
      dataIndex: "society_name",
      // align: "center",
      key: "society_name",
    },

    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      // align: "center",
      key: "delivery",
    },

    {
      title: "AGENT NAME",
      dataIndex: "agent_name",
      key: "agent_name",
      // align: "center",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      // align: "center",
      render: (status) => (
        <div style={{ color: colorStatus[status] }}>{status}</div>
      ),
    },
    {
      title: "IMAGE LOG",
      dataIndex: "image_log",
      key: "image_log",
      // align: "center",
      render: (image_log) => (
        <div style={{ color: colorStatus[image_log] }}>{image_log}</div>
      ),
    },
  ];

  const handleEditAgent = async () => {
    try {
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

  //status
  const handleOptionChange = (selectedOption, key) => {
    setAgent((prev) => ({
      ...prev,
      ...{ [key]: selectedOption.value },
    }));
  };

  const handleCancel = () => {
    setSelectedRowData(null);
    refetch();
  };

  const AgentDetailsComponent = () => (
    <div>
      {/* <div className="text-3xl font-semibold">{rowData?.agent_name}</div> */}
      <div className="flex justify-end">
        {!editable && (
          <Button
            btnName={"Edit"}
            onClick={() => setEditable(true)}
            className="w-32"
          />
        )}
        {editable && (
          <Button btnName={"Save"} onClick={handleEditAgent} className="w-32" />
        )}
        <Button btnName={"Cancel"} onClick={handleCancel} className="w-32" />
      </div>

      <div className="flex space-x-5 w-full justify-start">
        <div className="w-[40%] space-y-2">
          <div>
            <label>Name</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg border-select__control p-2"
              value={agent?.agent_name}
              disabled={!editable}
              onChange={handleChangePhoneNum}
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg border-select__control  p-2"
              value={agent?.phone_number}
              disabled={!editable}
              onChange={handleChangePhoneNum}
            />
          </div>
          <label>Status</label>
          <Select
            options={statusOptions}
            className="w-full"
            value={{ label: agent?.status, value: agent?.status }}
            onChange={(option) => handleOptionChange(option, "status")}
            classNamePrefix="border-select"
            isDisabled={!editable}
          />
        </div>
        <div className="w-[40%]">
          <label>Assigned Area</label>
          <Select
            options={socitiesList}
            isMulti={true}
            placeholder="Please select areas"
            onChange={handleSelectOption}
            className="w-full"
            classNamePrefix="border-select"
            value={socitiesList.filter((society) =>
              agent?.assigned_area.includes(society.label)
            )}
            isDisabled={!editable}
          />
        </div>
      </div>
      {/* work details */}
      <div className="mt-4 flex w-[100%] justify-between">
        <div className="bg-[#FEF2F7] w-[30%] border-2 border-gray rounded-lg shadow-xs pt-4 space-y-3 px-4 pb-4">
          <p className="font-bold text-lg">Work Details</p>
          <div className="space-y-1">
            <label className="text-[#878787] py-1">WAREHOUSE ALLOCATED *</label>
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
            <p className="border border-[#FF80B4] px-8 rounded-md">Electric</p>
          </div>
        </div>
        <div className="w-[50%] h-[200px]">
          <div className="ml-4">Action History</div>
          <div className="border border-gray border-2 w-[69%] h-72">
            <div className="p-2">Rejected Reasons....</div>
          </div>
        </div>
      </div>
      {/* bank details */}
      <div className="w-[40%] bg-[#FEF2F7] mt-4 border-2 border-gray rounded-lg shadow-xs pb-2">
        <div className="px-4 space-y-2 py-2">
          <p className="font-bold text-lg">Bank Details</p>
          <div className="">
            <input
              type="text"
              className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
              value={agent?.mobile_number}
              placeholder="Bank account number *"
              onChange={(e) => handleChange("mobile_number", e.target.value)}
            />
          </div>
          <div className="">
            <input
              type="text"
              className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
              value={agent?.mobile_number}
              placeholder="Account Holder's number *"
              onChange={(e) => handleChange("mobile_number", e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <div className="w-[48%]">
              <input
                type="text"
                className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                value={agent?.mobile_number}
                placeholder="IFSC Code *"
                onChange={(e) => handleChange("mobile_number", e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <input
                type="text"
                className="w-full h-12 rounded-lg shadow-xs border-2 border-gray p-2"
                value={agent?.mobile_number}
                placeholder="Branch Name *"
                onChange={(e) => handleChange("mobile_number", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AgentDocumentsComponent = () => (
    <div>
      {/* <div>
        {Object.entries(documents)?.map(([documentName, documentVal]) => (
          <div className="flex space-x-2 my-3" key={documentName}>
            <div>{documentName} :</div>
            {documentVal ? (
              <a href={documentVal} download>
                <button className="bg-red-400 text-white p-2 rounded-md">
                  Download
                </button>
              </a>
            ) : (
              <div className="text-red-300 ml-3">No Document Present</div>
            )}
          </div>
        ))}
      </div> */}
      <div>
        {/* Adhar details */}
        <div className="">
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
    </div>
  );

  const DeliveryHistoryComponent = () => (
    <div>
      <div className="font-bold text-2xl pt-5">Delivery History</div>
      <div>
        <DataTable
          data={historyData}
          columns={HistoryHeaders}
          pagination={false}
          fileName={`${rowData?.agent_name}_Agent_Past_Trips.csv`}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Agent Details" key="1">
          <AgentDetailsComponent />
        </TabPane>
        <TabPane tab="Agent Documents" key="2">
          <AgentDocumentsComponent />
        </TabPane>
        <TabPane tab="Delivery History" key="3">
          <DeliveryHistoryComponent />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AgentDetail;
