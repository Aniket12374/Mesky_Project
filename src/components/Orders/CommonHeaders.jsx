import { Tooltip } from "antd";

const modifyDate = (date) => {
  const year = date ? date.split("-").pop() : " ";
  let modifiedyr = date ? year.slice(2) : "";
  let modifiedDate = date ? date.replace(year, modifiedyr) : "";
  return modifiedDate;
};

const CommonHeaders = (data, names) => {
  const cols = [
    {
      title: "ORDER DATE",
      dataIndex: "accept_date",
      key: "accept_date",
      align: "center",
      width: 90,

      onCell: (value, index) => {
        const obj = {
          children: value,
          props: {},
        };

        let key = value.key;

        if (data[key - 1] && data[key - 1]["order_uid"] == value.order_uid) {
          obj.props.rowSpan = 0;
          obj.props.colSpan = 0;
          return { rowSpan: 0 };
        } else {
          const occurCount = data.filter(
            (data) => data.order_uid === value.order_uid
          ).length;

          obj.props.rowSpan = occurCount;

          names.add(value);
          return { rowSpan: occurCount };
        }
      },
      render: (accept_date) => modifyDate(accept_date),
    },
    {
      title: "ORDER UID",
      dataIndex: "order_uid",
      key: "order_uid",
      align: "center",
      width: 150,

      onCell: (value, index) => {
        const obj = {
          children: value,
          props: {},
        };

        let key = value.key;

        if (data[key - 1] && data[key - 1]["order_uid"] == value.order_uid) {
          obj.props.rowSpan = 0;
          obj.props.colSpan = 0;
          return { rowSpan: 0 };
        } else {
          const occurCount = data.filter(
            (data) => data.order_uid === value.order_uid
          ).length;

          obj.props.rowSpan = occurCount;

          names.add(value);
          return { rowSpan: occurCount };
        }
      },
    },
    {
      title: "WAY BILL",
      dataIndex: "waybill_number",
      key: "waybill_number",
      align: "center",
      width: 150,

      onCell: (value, index) => {
        const obj = {
          children: value,
          props: {},
        };

        let key = value.key;

        if (data[key - 1] && data[key - 1]["order_uid"] == value.order_uid) {
          obj.props.rowSpan = 0;
          obj.props.colSpan = 0;
          return { rowSpan: 0 };
        } else {
          const occurCount = data.filter(
            (data) => data.order_uid === value.order_uid
          ).length;

          obj.props.rowSpan = occurCount;

          names.add(value);
          return { rowSpan: occurCount };
        }
      },
    },
    {
      title: "SKU ID",
      dataIndex: "sku_id",
      key: "sku_id",
      align: "center",
      width: 100,
    },
    {
      title: "NAME",
      dataIndex: "product_name",
      key: "product_name",
      align: "center",
      width: 200,

      render: (_, record) => {
        const { ps_name, product_name } = record;
        const name = ps_name ? ps_name : product_name;
        return (
          <Tooltip title={name}>
            {name ? (
              name.length > 65 ? (
                <div className="text-left">{name.slice(0, 65) + "..."}</div>
              ) : (
                <div className="text-left">{name}</div>
              )
            ) : (
              ""
            )}
          </Tooltip>
        );
      },
    },
    {
      title: "VARIANT",
      dataIndex: "product_unit_quantity",
      key: "product_unit_quantity",
      align: "center",
      width: 100,
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 80,
    },
    {
      title: "SIZE",
      dataIndex: "product_size",
      key: "product_size",
      align: "center",
      width: 80,
    },
    {
      title: "ORDER VALUE",
      dataIndex: "order_value",
      key: "order_value",
      width: 100,
      align: "center",
      render: (_, order) => "₹" + order.total_price,
    },
  ];
  return cols;
};

export default CommonHeaders;
