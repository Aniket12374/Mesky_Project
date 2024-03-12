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

const AgentDetail = ({ rowData, setShowAgentCreation, setSelectedRowData }) => {
  const [socitiesList, setSocitiesList] = useState([]);
  const [agent, setAgent] = useState({});
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    getSocieties().then((res) => {
      let list = res?.data?.data?.map((x) => ({
        label: x.name,
        value: x.id,
      }));
      setSocitiesList(list);
    });

    handleChange("rider_id", rowData?.s_no);

    Object.keys(rowData).map((row) => {
      setAgent((prev) => ({ ...prev, ...{ [row]: rowData[row] } }));
    });

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
      align: "center",
      key: "order_date",
    },
    {
      title: "ORDER ID",
      dataIndex: "order_id",
      key: "order_id",
      align: "center",
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customer_name",
      align: "center",
      key: "customer_name",
    },
    {
      title: "SOCIETY NAME",
      dataIndex: "society_name",
      align: "center",
      key: "society_name",
    },

    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      align: "center",
      key: "delivery",
    },

    {
      title: "AGENT NAME",
      dataIndex: "agent_name",
      key: "agent_name",
      align: "center",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    {
      title: "IMAGE LOG",
      dataIndex: "image_log",
      key: "image_log",
      align: "center",
      render: (record) => (
        <img src={record?.status?.del_img} width={30} height={30} />
      ),
    },
  ];

  const handleEditAgent = () => {
    modifyRider(agent)
      .then((res) => {
        toast.success("Successfully Edited!");
      })
      .catch((err) => {
        toast.error("Error Occured");
      });
  };

  //status
  const handleOptionChange = (selectedOption, key) => {
    setAgent((prev) => ({
      ...prev,
      ...{ [key]: selectedOption.value },
    }));
  };

  return (
    <div>
      <div className="text-3xl font-semibold">{rowData?.agent_name}</div>
      <div className="flex justify-end">
        <Button btnName={"Edit"} onClick={handleEditAgent} className="w-32" />
        <Button
          btnName={"Cancel"}
          onClick={() => setSelectedRowData(null)}
          className="w-32"
        />
      </div>
      <div className="flex space-x-5 w-full justify-start">
        <div className="w-[40%] space-y-2">
          <div className="">
            <label>Phone Number</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg  shadow-inner shadow-fuchsia-400 p-2"
              value={agent?.phone_number}
              //   placeholder="Warehouse Name"
            />
          </div>
          <label>Status</label>
          <Select
            options={statusOptions}
            className="w-full"
            value={{ label: agent?.status, value: agent?.status }}
            onChange={(option) => handleOptionChange(option, "status")}
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
            value={socitiesList.filter((society) =>
              agent?.assigned_area.includes(society.label)
            )}
          />
        </div>
      </div>
      <div className="font-bold text-2xl">Delivery History</div>
      <div>
        <DataTable
          data={historyData}
          columns={HistoryHeaders}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default AgentDetail;
