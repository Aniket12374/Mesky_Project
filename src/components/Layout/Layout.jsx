import NavBar from "../NavBar/NavBar";
import { useMainStore } from "../../store/store";

const Layout = ({ children }) => {
  const close = useMainStore((state) => state.sidebarOpen);

  return (
    <>
      <NavBar />
      <div className={`p-4 ${close ? "sm:ml-64" : "sm:ml-28"} sm:mt-20`}>
        {children}
      </div>
    </>
  );
};

export default Layout;
