import { Checkbox, Modal, Radio, Select, Space, DatePicker, Spin } from "antd";
import React, { useEffect, useState, useMemo, useRef } from "react";
import trashBin from "../../assets/delt-bin.png";
import moment from "moment";
import debounce from "lodash/debounce";
import {
  createSubscriptionDeatils,
  searchProductList,
  updateSubscriptionDeatils,
} from "../../services/customerInfo/CustomerInfoService";
import MagnifyingGlass from "../../assets/MagnifyingGlass.png";
import toast from "react-hot-toast";
import {
  getDayOfWeekAndAlternates,
  showWarningToast,
} from "../../utility/common";

const { RangePicker } = DatePicker;
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dateFormat = "DD-MM-YYYY";
const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1);
const deliverySchedule = [
  "Daily",
  "Alternate days",
  "No delivery on weekends",
  "Weekly",
];

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      showSearch
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options?.map((option) => (
        <Option key={option.value} value={option.value} label={option.label}>
          <div className="flex items-center">
            <img
              src={option.img}
              alt={option.label}
              style={{ width: 30, height: 30, marginRight: 10 }} // Adjust image styling as needed
            />
            <span>{option.label}</span>
          </div>
        </Option>
      ))}
    </Select>
  );
}

function SubscriptionEditModal({ modalData, handleEdit, handleOpenClose }) {
  const { data = {}, open, isCreateSubscription } = modalData;
  const {
    product = {},
    subscription_type = {},
    quantity: initialQty,
    dates_range = [],
    start_date,
    id,
    product_id,
  } = data;

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const [editData, setEditData] = useState({
    quantity: initialQty || 1,
    type: capitalizeFirstLetter(subscription_type?.type) || deliverySchedule[0],
    weekdays: subscription_type?.day || [],
    datesRange: dates_range || [],
    startDate: start_date || null,
    newStartDate: null,
    dateRangePicker: false,
    subscriptionId: id || null,
    productId: product_id || null,
    productName: "",
    offerPrice: null,
    sellingPrice: null,
    productImage: null,
    alternateDay: [],
    day: "",
  });
  console.log("editData", editData);

  const addressId = localStorage.getItem("addressId");

  const [value, setValue] = useState([]);
  const [iswarning, setIsWarning] = useState(true);

  const filteredData = value.filter(
    (val) => val.product_id == editData?.productId
  );
  const createData = filteredData[0];
  const alternateDays = getDayOfWeekAndAlternates(editData?.newStartDate);

  useEffect(() => {
    setEditData({
      quantity: initialQty || 1,
      type:
        capitalizeFirstLetter(subscription_type?.type) || deliverySchedule[0],
      weekdays: subscription_type?.day || [],
      datesRange: dates_range || [],
      startDate: start_date || null,
      newStartDate: null,
      dateRangePicker: false,
      subscriptionId: id || null,
      productId: product_id || null,
      day: alternateDays[0],
    });

    if (editData?.type == "Alternate days") {
      setEditData({
        ...editData,
        weekdays: getDayOfWeekAndAlternates(editData?.newStartDate),
        day: alternateDays[0],
      });
    }
  }, [modalData]);

  const handleTypeChange = (e) => {
    if (capitalizeFirstLetter(e.target.value) == "No delivery on weekends") {
      if (editData?.day == "Sun" || editData?.day == "Sat") {
        setIsWarning(true);
      }
      let days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      setEditData({
        ...editData,
        weekdays: days,
      });
    } else if (capitalizeFirstLetter(e.target.value) == "Alternate days") {
      setEditData({
        ...editData,
        weekdays: getDayOfWeekAndAlternates(editData?.newStartDate),
        day: alternateDays[0],
      });
    } else {
      setEditData({
        ...editData,
        weekdays: [],
      });
    }
    setEditData((prev) => ({
      ...prev,
      type: capitalizeFirstLetter(e.target.value),
    }));
  };

  const handleQuantityChange = (qty) =>
    setEditData((prev) => ({ ...prev, quantity: qty }));

  const toggleDaySelection = (day) =>
    setEditData((prev) => ({
      ...prev,
      weekdays: prev.weekdays.includes(day)
        ? prev.weekdays.filter((d) => d !== day)
        : [...prev.weekdays, day],
    }));

  const handlePauseDateChange = (_, dateStrings) => {
    setEditData((prev) => ({
      ...prev,
      datesRange: [
        ...prev.datesRange,
        { start_date: dateStrings[0], end_date: dateStrings[1] },
      ],
    }));
  };

  const handleDeletePauseDate = (index) =>
    setEditData((prev) => ({
      ...prev,
      datesRange: prev.datesRange.filter((_, i) => i !== index),
    }));

  const handleAttachTicket = async () => {
    let newDate = isCreateSubscription && editData?.newStartDate;
    let existingDate =
      !isCreateSubscription == "false" &&
      editData?.alternateDay == "Alternate days"
        ? editData?.newStartDate
        : editData?.startDate;
    try {
      let payload = {
        [isCreateSubscription ? "address_id" : "subscription_id"]:
          editData?.subscriptionId || addressId,
        qty: editData?.quantity,
        del_schedule_type: {
          type: editData.type,
          weekdays: editData.weekdays,
        },
        pause_dates: editData?.datesRange,
        start_date: isCreateSubscription == "true" ? newDate : existingDate,
        product_id: editData?.productId,
      };

      isCreateSubscription
        ? await createSubscriptionDeatils(payload)
        : await updateSubscriptionDeatils(payload);
      handleEdit();
      handleOpenClose();
      toast.success("Successfull");
      console.log("Subscription updated successfully");
    } catch (error) {
      toast.error("Error updating subscription:", error.message);
    }
  };

  const fetchProductOptions = async (search) => {
    try {
      if (search) {
        const res = await searchProductList(search);
        setValue(res?.data.data);

        const data = res.data.data.map((product) => ({
          label: product.product_sn,
          value: product.product_id,
          img: product.default_image,
        }));

        return data;
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
      return [];
    }
  };

  const disabledPastDate = (current) => {
    return current && current < moment().add(1, "day").startOf("day");
  };

  const offerPrice =
    product?.offer_price * editData?.quantity ||
    createData?.offer_price * editData?.quantity;
  const sellingPrice =
    product?.selling_price * editData?.quantity ||
    createData?.offer_price * editData?.quantity;

  useEffect(() => {
    if (
      (iswarning &&
        isCreateSubscription &&
        editData?.type == "No delivery on weekends" &&
        alternateDays[0] == "Sun") ||
      alternateDays[0] == "Sat"
    ) {
      showWarningToast(
        `Are you Sure ? , You Have Selected ${alternateDays[0]}day`
      );
      setIsWarning(false);
    }
  }, [editData, editData?.type]);
  console.log(isCreateSubscription);

  return (
    <Modal
      open={open}
      width={900}
      footer={null}
      onCancel={() => {
        handleOpenClose({ setValue: null }), setEditData({});
      }}
    >
      {isCreateSubscription && (
        <div className="pb-3 flex justify-center">
          <DebounceSelect
            mode="single"
            value={value}
            placeholder="Search product to add..."
            fetchOptions={fetchProductOptions}
            onChange={(newValue) => {
              // setValue(newValue); // Update the selected value
              setEditData((prev) => ({
                ...prev,
                productId: newValue.value,
                productName: newValue.label,
                img: newValue.img,
              }));
            }}
            style={{
              width: "70%",
            }}
          />
        </div>
      )}

      <div className="flex space-x-2 p-2">
        <div className="m-1 p-2 border-2 border-gray-200">
          <img
            src={product?.images_list?.[0] || createData?.default_image || null}
            width={100}
            height={100}
            className="rounded-lg"
            alt="sub_img"
          />
        </div>

        <div>
          <div className="font-semibold">
            {product?.product_sn || editData?.productName}
          </div>
          <div className="flex items-center">
            <span>{product?.dprod_unit_qty || createData?.dprod_unit_qty}</span>
            <Select
              value={editData?.quantity}
              className="w-16 ml-12"
              onSelect={handleQuantityChange}
              options={quantityOptions.map((option) => ({
                label: option,
                value: option,
              }))}
            />
            <span className="ml-10">
              <span>₹ {offerPrice}</span>
              <span className="line-through ml-3">₹ {sellingPrice}</span>
            </span>
          </div>

          <div className="flex py-4 space-x-4">
            <div>
              <div className="font-semibold">Delivery Schedule</div>
              <Radio.Group onChange={handleTypeChange} value={editData?.type}>
                <Space direction="vertical">
                  {deliverySchedule.map((schedule) => (
                    <Radio key={schedule} value={schedule}>
                      {schedule}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>

            <div>
              <div className="flex space-x-2">
                <div>
                  <div>
                    {!isCreateSubscription && editData?.type == "Alternate days"
                      ? "Alternate days"
                      : "Starting from"}
                  </div>

                  <DatePicker
                    {...(!isCreateSubscription
                      ? {
                          value: moment(editData.startDate, dateFormat),
                        }
                      : {})}
                    format={dateFormat}
                    disabledDate={disabledPastDate}
                    onChange={(_, dateString) => {
                      if (editData?.type == "Alternate days") {
                        setEditData((prev) => ({
                          ...prev,
                          newStartDate: dateString,
                          weekdays: getDayOfWeekAndAlternates(
                            editData?.newStartDate
                          ),
                          day: alternateDays[0],
                        }));
                      } else {
                        setEditData((prev) => ({
                          ...prev,
                          newStartDate: dateString,
                        }));
                      }
                    }}
                    placeholder="Select date"
                    disabled={!isCreateSubscription ? true : false}
                  />
                </div>
                {!isCreateSubscription &&
                  editData?.type == "Alternate days" && (
                    <div>
                      <div>Alternate days</div>
                      <DatePicker
                        // value={
                        //   editData?.startDate
                        //     ? moment(editData.startDate, dateFormat)
                        //     : null
                        // }
                        format={dateFormat}
                        disabledDate={disabledPastDate}
                        onChange={(_, dateString) => {
                          if (editData?.type == "Alternate days") {
                            setEditData((prev) => ({
                              ...prev,
                              newStartDate: dateString,
                              weekdays: getDayOfWeekAndAlternates(
                                editData?.newStartDate || dateString
                              ),
                              day: alternateDays[0],
                            }));
                          } else {
                            setEditData((prev) => ({
                              ...prev,
                              newStartDate: dateString,
                              day: alternateDays[0],
                            }));
                          }
                        }}
                        placeholder="Select date"
                      />
                    </div>
                  )}
              </div>

              {!(editData?.type === "Daily") && (
                <>
                  <div className="py-2">Choose Day</div>
                  <div className="flex space-x-2">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        onClick={() => toggleDaySelection(day)}
                        className={`w-10 h-10 pt-2 rounded-full text-center cursor-pointer ${
                          editData?.weekdays?.includes(day)
                            ? "bg-[#FB8171] text-white"
                            : "text-black border-black border"
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-md py-4 rounded-lg px-2">
        <div className="font-medium">Pause Schedule</div>
        <div className="flex justify-end space-x-2">
          <div>
            {editData?.dateRangePicker && (
              <div className="flex py-2">
                <RangePicker
                  format={dateFormat}
                  id={{
                    start: "startInput",
                    end: "endInput",
                  }}
                  disabledDate={disabledPastDate}
                  onChange={handlePauseDateChange}
                  placeholder={["Start Date", "End Date"]}
                  autoFocus={true}
                  open={editData?.dateRangePicker}
                />
              </div>
            )}
          </div>
          <div
            className={`text-white bg-[#FB8171] shadow-md  cursor-pointer ${
              editData?.dateRangePicker
                ? "rounded-full px-2 h-6 relative top-3"
                : "p-1 rounded-md px-2"
            }`}
            onClick={() =>
              setEditData((prev) => ({
                ...prev,
                dateRangePicker: !prev.dateRangePicker,
              }))
            }
          >
            {editData?.dateRangePicker ? "x" : "+ ADD PAUSE"}
          </div>
        </div>

        <div className="flex space-x-2">
          {editData?.datesRange?.map((item, index) => (
            <>
              {item.start_date && (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-2 w-[127px] flex relative"
                >
                  <img
                    src={trashBin}
                    width={15}
                    height={15}
                    alt="delete-bin"
                    onClick={() => handleDeletePauseDate(index)}
                    className="absolute top-1 right-1 cursor-pointer"
                  />
                  <div className="text-center ml-2">
                    <p>{item.start_date}</p>
                    <p>to</p>
                    <p>{item.end_date}</p>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="bg-[#FB8171] text-white px-4 py-2 rounded-md"
          onClick={handleAttachTicket}
        >
          AttachTicket
        </button>
      </div>
    </Modal>
  );
}

export default SubscriptionEditModal;
