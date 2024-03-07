import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Spinner = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return <Spin size="large" indicator={antIcon} />;
};

export default Spinner;
