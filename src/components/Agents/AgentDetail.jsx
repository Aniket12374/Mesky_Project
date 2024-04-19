import Select from "react-select";
import Button from "../Common/Button";
import DataTable from "../Common/DataTable/DataTable";
import { useEffect, useState } from "react";
import {
  getRiderHistory,
  getSocieties,
  modifyRider,
} from "../../services/riders/riderService";
import toast from "react-hot-toast";

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
          order_date: x.order.uid,
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

  return (
    <div>
      <div className="text-3xl font-semibold">{rowData?.agent_name}</div>
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
          <div className="">
            <label>Phone Number</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg border-select__control  p-2"
              value={agent?.phone_number}
              disabled={!editable}
              //   placeholder="Warehouse Name"
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
};

export default AgentDetail;
