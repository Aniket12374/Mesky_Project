import NavBar from "../NavBar/NavBar";
import { useMainStore } from "../../store/store";

const Layout = ({ children }) => {
  const close = useMainStore((state) => state.sidebarOpen);

  const notCloseStyle = {
    left: "230px",
    width: "calc(-245px + 100vw)",
    top: "90px",
    height: "calc(-130px + 100vh)",
  };

  const closeStyle = {
    left: "105px",
    width: "calc(-105px + 100vw)",
    top: "90px",
    height: "calc(-130px + 100vh)",
  };

  return (
    <>
      <NavBar />
      <div
        // className={`absolute p-4 ${close ? "sm:ml-64" : "sm:ml-28"} sm:mt-20`}
        className={`absolute p-4 overflow-y-auto`}
        // style={{
        //   left: !close ? "120px" : "218px",
        //   width: !close ? "calc(100vw - 150px)" : "calc(100vw - 270px)",
        //   top: "90px",
        //   height: "calc(100vh - 100px)",
        // }}
        style={!close ? closeStyle : notCloseStyle}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
