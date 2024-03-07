import NavBar from "../NavBar/NavBar";

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="p-4 sm:ml-64 sm:mt-20">{children}</div>
    </>
  );
};

export default Layout;
