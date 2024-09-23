import {
  Checkbox,
  Modal,
  Radio,
  Select,
  Space,
  DatePicker,
  Spin,
  Button,
} from "antd";
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
  getTomorrowDate,
  showWarningToast,
} from "../../utility/common";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const dateFormat = "DD-MM-YYYY";
const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1);
const deliverySchedule = [
  { Daily: "DAILY" },
  { "Alternate days": "ALTERNATE" },
  { "No delivery on weekends": "NO_WEEKENDS" },
  { Weekly: "WEEKLY" },
];

export function DebounceSelect({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}) {
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
      notFoundContent={fetching ? <Spin size='small' /> : null}
      optionLabelProp='label'
      {...props}
    >
      {options?.map((option) => (
        <Option key={option.value} value={option.value} label={option.label}>
          <div className='flex items-center justify-between'>
            <div className='flex'>
              <img
                src={option.img}
                alt={option.label}
                style={{ width: 30, height: 30, marginRight: 10 }}
              />
              <span>{option.label}</span>
            </div>
            <div>₹{option.price}</div>
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

  const defaultDate = getTomorrowDate();
  // const [pauseDate, setPauseDate] = useState([]);
  const [editData, setEditData] = useState({
    quantity: initialQty || 1,
    type: subscription_type?.type || "DAILY",
    weekdays: subscription_type?.days || [],
    datesRange: dates_range || [],
    startDate: start_date || null,
    pauseDate: [] || null,
    newStartDate: defaultDate,
    dateRangePicker: false,
    subscriptionId: id || null,
    productId: product_id || null,
    productName: "",
    offerPrice: null,
    sellingPrice: null,
    productImage: null,
    alternateDay: [],
    day: "",
    dateRangePickerOpen: true,
  });

  const addressId = localStorage.getItem("addressId");

  const [value, setValue] = useState([]);
  const [iswarning, setIsWarning] = useState(true);

  const filteredData = value.filter(
    (val) => val.product_id == editData?.productId
  );
  const createData = filteredData[0];
  const alternateDays = getDayOfWeekAndAlternates(editData?.newStartDate);

  useEffect(() => {
    editData?.weekdays;
    setEditData({
      quantity: initialQty || 1,
      type: subscription_type?.type || "DAILY",
      weekdays: subscription_type?.days || [],
      datesRange: dates_range || [],
      startDate: start_date || null,
      newStartDate: defaultDate || null,
      dateRangePicker: false,
      subscriptionId: id || null,
      productId: product_id || null,
      day: alternateDays[0],
    });

    // Handle alternate type
    if (editData?.type === "ALTERNATE") {
      setEditData((prevData) => ({
        ...prevData,
        weekdays: getDayOfWeekAndAlternates(prevData?.newStartDate),
        day: alternateDays[0],
      }));
    }

    return () => {
      setEditData({
        quantity: 1,
        type: "DAILY",
        weekdays: [],
        datesRange: [],
        startDate: null,
        newStartDate: null,
        dateRangePicker: false,
        subscriptionId: null,
        productId: null,
        day: null,
      });
    };
  }, [modalData, open]);

  const handleTypeChange = (e) => {
    // if (e.target.value == "NO_WEEKENDS") {
    //   let days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    //   setEditData({
    //     ...editData,
    //     weekdays: days,
    //   });
    // } else if (e.target.value == "ALTERNATE") {
    //   setEditData({
    //     ...editData,
    //     weekdays: getDayOfWeekAndAlternates(editData?.newStartDate),
    //     day: alternateDays[0],
    //   });
    // } else {
    //   setEditData({
    //     ...editData,
    //     weekdays: [],
    //   });
    // }
    setEditData((prev) => ({
      ...prev,
      type: e.target.value,
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
    if (dateStrings[0] && dateStrings[1]) {
      setEditData((prev) => ({
        ...prev,
        pauseDateRange: {
          start_date: dateStrings[0],
          end_date: dateStrings[1],
        },

        dateRangePickerOpen: false,
        // dateRangePicker: false,
      }));
    }
  };
  const handleOpenChange = (open) => {
    setEditData((prev) => ({
      ...prev,
      dateRangePickerOpen: open,
    }));
  };

  const handleOk = () => {
    setEditData((prev) => ({
      ...prev,
      datesRange: [...prev?.datesRange, editData?.pauseDateRange],
      dateRangePickerOpen: false,
      dateRangePicker: false,
    }));
  };

  const handleDeletePauseDate = (index) =>
    setEditData((prev) => ({
      ...prev,
      datesRange: prev.datesRange.filter((_, i) => i !== index),
    }));

  const handleAttachTicket = async () => {
    if (isCreateSubscription && !editData.newStartDate) {
      toast.error("For create Subscription Please add starting date !!");
      return;
    }

    if (!isCreateSubscription && editData?.type == "ALTERNATE") {
      if (!editData?.newStartDate) {
        toast.error(
          "For Update Subscription Please add or Chnage the  Alternate date !!"
        );
        return;
      }
    }

    try {
      let payload = {
        [isCreateSubscription ? "address_id" : "subscription_id"]:
          editData?.subscriptionId || addressId,
        qty: editData?.quantity,
        del_schedule_type: {
          type: editData.type,
          days: editData.weekdays,
        },
        pause_dates: editData?.datesRange,
        start_date: isCreateSubscription
          ? editData?.newStartDate
          : editData?.type == "ALTERNATE"
          ? editData?.newStartDate
          : editData?.startDate,
        product_id: editData?.productId,
      };

      isCreateSubscription
        ? await createSubscriptionDeatils(payload).then((res) => {
            if (
              res?.data?.message ==
              "Already subscription created for this product"
            ) {
              toast.error("Already subscription created for this product");
            } else {
              toast.success("Successfull");
            }
          })
        : await updateSubscriptionDeatils(payload).then((res) => {
            if (res?.status == "200") {
              toast.success("Successfull");
            }
          });
      handleEdit();
      handleOpenClose();
      setEditData({
        quantity: 1,
        type: "DAILY",
        weekdays: [],
        datesRange: [],
        startDate: null,
        newStartDate: null,
        dateRangePicker: false,
        subscriptionId: null,
        productId: null,
        productName: "",
        offerPrice: null,
        sellingPrice: null,
        productImage: null,
        alternateDay: [],
        day: "",
        dateRangePickerOpen: true,
      });
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
          price: product?.selling_price,
        }));

        return data;
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
      return [];
    }
  };

  const parsedPauseDate = moment(editData?.newStartDate, "DD-MM-YYYY");

  const disabledPastDateRangePicker = (current) => {
    return current && current < parsedPauseDate.startOf("day");
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
    if (iswarning && isCreateSubscription) {
      if (editData?.type == "NO_WEEKENDS") {
        if (alternateDays[0] == "Sun" || alternateDays[0] == "Sat") {
          showWarningToast(
            `Are you Sure ? , You Have Selected ${alternateDays[0]}day`
          );
          setIsWarning(false);
        }
      }
    }

    if (isCreateSubscription) {
      setEditData((prev) => ({
        ...prev,
        datesRange: prev.datesRange.filter((dateObj) =>
          moment(dateObj.start_date, "DD-MM-YYYY").isSameOrAfter(
            moment(prev.newStartDate, "DD-MM-YYYY")
          )
        ),
      }));
    }
  }, [editData.type, editData?.newStartDate]);

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
        <div className='pb-3 flex justify-center '>
          <DebounceSelect
            mode='single'
            value={value}
            placeholder='Search product to add...'
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

      <div className='flex space-x-2 p-2 shadow-md  rounded-sx'>
        <div className='m-1 p-2'>
          <img
            src={product?.images_list?.[0] || createData?.default_image || null}
            width={100}
            height={100}
            className='rounded-lg'
            alt='sub_img'
          />
        </div>

        <div>
          <div className='font-semibold font-roboto'>
            {product?.product_sn || editData?.productName}
          </div>
          <div className='flex items-center'>
            <span className='text-[#9DA49E]'>
              {product?.dprod_unit_qty || createData?.dprod_unit_qty}
            </span>
            <Select
              value={`Qty ${editData?.quantity}`}
              className='subscription-edit-modal w-16 ml-12 w-[80px]'
              onSelect={handleQuantityChange}
              options={quantityOptions.map((option) => ({
                label: option,
                value: option,
              }))}
            />
            <span className='ml-10'>
              <span className='font-semibold'>₹ {offerPrice}</span>
              <span className='line-through px-2 text-[#9DA49E]'>
                ₹ {sellingPrice}
              </span>
            </span>
          </div>
          <div className='flex py-4 space-x-4'>
            <div>
              <div className='font-semibold pb-2 font-roboto'>
                Delivery Schedule
              </div>
              <Radio.Group
                onChange={handleTypeChange}
                value={editData?.type}
                className='custom-radio-group'
              >
                <Space direction='vertical'>
                  {deliverySchedule?.map((schedule) => {
                    const label = Object.keys(schedule)[0];
                    const value = schedule[label];
                    return (
                      <Radio
                        key={label}
                        value={value}
                        className='subscription-selector'
                      >
                        <p className='text-[#9DA49E]'>{label}</p>
                      </Radio>
                    );
                  })}
                </Space>
              </Radio.Group>
            </div>

            <div>
              <div className='flex space-x-2'>
                {
                  <div>
                    <div className='text-[#9DA49E]'>Starting from</div>

                    <DatePicker
                      // {...(!isCreateSubscription
                      //   ? {
                      //       value: moment(editData.startDate, dateFormat),
                      //     }
                      //   : {})}
                      // defaultValue={
                      //   !isCreateSubscription
                      //     ? dayjs(editData.startDate, dateFormat)
                      //     : dayjs(defaultDate, dateFormat)
                      // }
                      value={
                        !isCreateSubscription
                          ? dayjs(editData.startDate, dateFormat)
                          : dayjs(editData?.newStartDate, dateFormat)
                      }
                      format={dateFormat}
                      disabledDate={disabledPastDate}
                      onChange={(_, dateString) => {
                        setEditData((prev) => ({
                          ...prev,
                          newStartDate: dateString,
                          // weekdays: getDayOfWeekAndAlternates(dateString),
                          pauseDate: null,
                          day: alternateDays[0],
                        }));
                      }}
                      placeholder='Select date'
                      disabled={!isCreateSubscription ? true : false}
                      allowClear={false}
                    />
                  </div>
                }
                {!isCreateSubscription && editData?.type == "ALTERNATE" && (
                  <div className=''>
                    <div className='text-[#9DA49E]'>Alternate days</div>
                    <DatePicker
                      // value={
                      //   editData?.startDate
                      //     ? moment(editData.startDate, dateFormat)
                      //     : undefined
                      // }
                      format={dateFormat}
                      disabledDate={disabledPastDate}
                      onChange={(_, dateString) => {
                        if (editData?.type == "ALTERNATE") {
                          setEditData((prev) => ({
                            ...prev,
                            newStartDate: dateString,
                            weekdays: getDayOfWeekAndAlternates(dateString),
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
                      placeholder='Select date'
                      allowClear={false}
                    />
                  </div>
                )}
              </div>

              {editData?.type === "WEEKLY" && (
                <>
                  <div className='py-2 text-[#9DA49E]'>Choose Day</div>
                  <div className='flex space-x-2'>
                    {weekDays?.map((day) => (
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

      <div className='shadow-md py-4 rounded-lg px-2'>
        <div className='font-medium'>Pause Schedule</div>
        <div className='flex justify-end space-x-2'>
          <div>
            {editData?.dateRangePicker && (
              <div className=' px-2 py-2'>
                <RangePicker
                  format={dateFormat}
                  id={{
                    start: "startInput",
                    end: "endInput",
                  }}
                  disabledDate={
                    isCreateSubscription
                      ? disabledPastDateRangePicker
                      : disabledPastDate
                  }
                  onChange={handlePauseDateChange}
                  placeholder={["Start Date", "End Date"]}
                  autoFocus={true}
                  open={editData?.dateRangePickerOpen}
                  onOpenChange={handleOpenChange}
                />
                <div className='py-1 flex justify-center'>
                  <Button
                    key='ok'
                    type='primary'
                    onClick={handleOk}
                    disabled={editData?.pauseDateRange == null}
                    // onChange={handlePauseDateChange}
                  >
                    Set Pause Date
                  </Button>
                </div>
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
                pauseDateRange: null,
              }))
            }
          >
            {editData?.dateRangePicker ? "x" : "+ ADD PAUSE"}
          </div>
        </div>

        <div className='w-full overflow-x-auto scrollbar-hide pt-1'>
          <div className='flex space-x-2 min-w-max'>
            {editData?.datesRange?.map((item, index) => (
              <>
                {item.start_date && (
                  <div
                    key={index}
                    className='border border-gray-300 rounded-lg p-2 w-[127px] flex relative'
                  >
                    <img
                      src={trashBin}
                      width={15}
                      height={15}
                      alt='delete-bin'
                      onClick={() => handleDeletePauseDate(index)}
                      className='absolute top-1 right-1 cursor-pointer'
                    />
                    <div className='text-center ml-2'>
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
      </div>

      <div className='flex justify-end mt-4'>
        <button
          className='bg-[#FB8171] text-white py-2 rounded-md px-12'
          onClick={handleAttachTicket}
        >
          AttachTicket
        </button>
      </div>
    </Modal>
  );
}

export default SubscriptionEditModal;
