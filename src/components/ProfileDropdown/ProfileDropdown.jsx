import { toast } from "react-hot-toast";
import meskyLogoCircle from "@/assets/mesky-logos/mesky-circle.png";
import { MdArrowDropDown } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { removeTokenFromCookie } from "../../services/cookiesFunc";
import { useMainStore } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useEffect } from "react";
import Cookies from "js-cookie";

const ProfileDropdown = () => {
  const logoutUser = useMainStore((state) => state.logoutUser);
  const user = useMainStore((state) => state.user);
  let queryClient = useQueryClient();
  let navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Successfully logged out!", {
      position: "bottom-right",
    });
    removeTokenFromCookie();
    logoutUser();
    queryClient.removeQueries();
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <div className="dropdown">
        <div
          tabIndex={0}
          className="btn m-1 w-56 h-8 rounded-3xl text-black border-none shadow-xl hover:bg-white bg-white justify-between"
        >
          <div className="box-border rounded-3xl flex flex-row h-8 w-8 mask mask-squircle">
            <img src={meskyLogoCircle} alt="user image" />
          </div>
          {user.name}
          <MdArrowDropDown />
        </div>

        <ul
          tabIndex={0}
          className="dropdown-content menu ml-2 p-2 shadow-2xl bg-slate-100 border w-52 rounded-2xl"
        >
          {/* <li>
            <Link to="/profile">
              <BsPersonCircle />
              Profile
            </Link>
          </li> */}

          <li onClick={handleLogout}>
            <a>
              <BiLogOut />
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
