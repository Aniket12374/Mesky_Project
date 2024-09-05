import NavBar from "../NavBar/NavBar";
import { useMainStore } from "../../store/store";

const Layout = ({ children }) => {
  const close = useMainStore((state) => state.sidebarOpen);

  return (
    <>
      <NavBar />
      <div
        // className={`absolute p-4 ${close ? "sm:ml-64" : "sm:ml-28"} sm:mt-20`}
        className={`absolute p-4`}
        style={{
          left: !close ? "120px" : "250px",
          width: !close ? "calc(100vw - 150px)" : "calc(100vw - 300px)",
          top: "90px",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
