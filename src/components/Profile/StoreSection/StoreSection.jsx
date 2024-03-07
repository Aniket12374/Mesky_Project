import { Modal } from "antd";
import DataTable from "../../Common/DataTable/DataTable";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BoxShadowInput } from "../utils";
import moment from "moment/moment";
import {
  addHoliday,
  updateHoliday,
  holidayList,
  deleteHoliday,
} from "../../../services/profile/profileService";
import { toast } from "react-hot-toast";
import { MdCreate } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";

const StoreSection = () => {
  const [colData, setColData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);

  const {
    register: registerHoliday,
    handleSubmit: handleSubmitHoliday,
    formState: { errors: errorsHoliday },
    setValue: setHolidayValue,
    getValues: getHolidayValues,
  } = useForm();

  const HolidayColumns = [
    {
      title: "START DATE",
      dataIndex: "start_date",
      key: "start_date",
      align: "center",
    },
    {
      title: "END DATE",
      dataIndex: "end_date",
      key: "end_date",
      align: "center",
    },
    {
      title: "REASON FOR HOLIDAY",
      dataIndex: "description",
      key: "description",
      align: "center",
      width: 600,
    },
    {
      title: "EDIT",
      dataIndex: "edit",
      key: "edit",
      align: "center",
      render: (_, record) => (
        <div
          className="flex justify-center"
          onClick={() => {
            const {
              start_date: startDate,
              end_date: endDate,
              description,
              id,
            } = record;
            let dateFormat = (date) => {
              let dateSplit = date.split("-");
              return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
            };
            setUpdate(true);
            setIsModalOpen(true);
            setHolidayValue("startDate", dateFormat(startDate));
            setHolidayValue("endDate", dateFormat(endDate));
            setHolidayValue("holidayReason", description);
            setHolidayValue("holidayId", id);
          }}
        >
          <MdCreate size={30} />
        </div>
      ),
    },
    {
      title: "DELETE",
      dataIndex: "delete",
      key: "delete",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center">
          <button onClick={() => handleDelete(record.id)}>
            <VscTrash size={30} />
          </button>
        </div>
      ),
    },
  ];

  const getHolidaysList = () => {};

  const handleDelete = (id) => {
    deleteHoliday(id)
      .then((res) => {
        toast.success("Deleted Successfully!", {
          position: "bottom-center",
        });
        setDeleteItem(true);
      })
      .catch((err) => {
        toast.error("Error occured, please try again after sometime!", {
          position: "bottom-center",
        });
        setDeleteItem(true);
      });
  };

  const handleAddHoliday = (data) => {
    const { endDate, startDate, holidayReason } = data;

    let holidayData = {
      end_date: moment(endDate).format("D-MM-yyyy"),
      start_date: moment(startDate).format("D-MM-yyyy"),
      reason: holidayReason,
    };
    let updateHolidayData = {
      ...holidayData,
      holiday_id: getHolidayValues("holidayId"),
    };

    let api = !update
      ? addHoliday(holidayData)
      : updateHoliday(updateHolidayData);
    api
      .then((res) => {
        toast.success(!update ? "Added Successfully" : "Update Successfully", {
          position: "bottom-center",
        });
        setIsModalOpen(false);
      })
      .catch((err) => {
        toast.error("Something went wrong, please try again after something", {
          position: "bottom-center",
        });
        setIsModalOpen(false);
      });
  };

  useEffect(() => {
    holidayList().then((res) => {
      setColData(res?.data);
      setDeleteItem(false);
    });
  }, [isModalOpen, deleteItem]);

  return (
    <section>
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="text-3xl fredoka-700 my-5">Add a holiday</div>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmitHoliday(handleAddHoliday)}
        >
          <BoxShadowInput
            register={registerHoliday}
            fieldName="startDate"
            label="Start date"
          />
          <BoxShadowInput
            register={registerHoliday}
            fieldName="endDate"
            label="End date"
          />
          <BoxShadowInput
            register={registerHoliday}
            fieldName="holidayReason"
            label="Reason for holiday"
            type="text"
          />
          <button
            type="submit"
            className="btn btn-block drop-shadow-lg text-white fredoka-600 bg-pink-600 border-0 rounded-3xl"
          >
            Save
          </button>
        </form>
      </Modal>

      <div className="flex float-right">
        <div className="my-5 md:mt-0 flex justify-center md:items-start">
          <button
            className="py-2 px-10 rounded-3xl drop-shadow-lg text-white fredoka-600 bg-pink-600 float-right"
            onClick={() => {
              setHolidayValue("startDate", "");
              setHolidayValue("endDate", "");
              setHolidayValue("holidayReason", "");
              setHolidayValue("holidayId", null);
              setIsModalOpen(true);
              setUpdate(false);
            }}
          >
            Add a Holiday
          </button>
        </div>
      </div>

      <div>
        <DataTable
          data={colData}
          navigateTo={null}
          columns={HolidayColumns}
          rowclassName="h-24"
        />
      </div>
    </section>
  );
};

export default StoreSection;
