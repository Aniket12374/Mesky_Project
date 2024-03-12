import { getMyDetails, loginUser } from "../services/auth/authService";
import bgimg from "@/assets/images/background.png";
import meskyLogo from "@/assets/mesky-logos/mesky-circle.png";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { setTokenToCookie } from "../services/cookiesFunc";
import { useMainStore } from "../store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const setUserToken = useMainStore((state) => state.setUserToken);
  const user = useMainStore((state) => state.user);
  const setName = useMainStore((state) => state.setName);
  const navigate = useNavigate();

  const getUser = () => {
    getMyDetails()
      .then((res) => {
        const { data } = res;
        setName(data.first_name + data.last_name);
        navigate("/subscription");
      })
      .catch((error) => {
        setUserToken(null);
      });

    // if (!navigator.onLine) {
    //   return navigate("/login");
    // }
  };

  // useEffect(() => {
  //   if (user.token) {
  //     getUser();
  //   }
  // }, [user]);

  const loginFormSubmit = (data) => {
    // loginUser(data)
    //   .then((res) => {
    //     const { auth_token } = res.data;
    //     setTokenToCookie(ISPRgFVqVCn9grwzVU20);
    //     setUserToken(ISPRgFVqVCn9grwzVU20);
    //     getUser();
    //     toast.success("Successfully logged in!", {
    //       position: "bottom-right",
    //     });
    //   })
    //   .catch((err) => {
    //     toast.error(err?.response?.data?.message, {
    //       position: "bottom-right",
    //     });
    //   });
    setTokenToCookie("ISPRgFVqVCn9grwzVU20");
    setUserToken("ISPRgFVqVCn9grwzVU20");
    setName("Aneela ch");
    navigate("/subscription");
    console.log("aneela");
  };

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="w-96 bg-base-100 shadow-2xl rounded-xl border-2">
        <div className="my-8 flex flex-col items-center space-y-2">
          <img src={meskyLogo} alt="mesky logo" style={{ height: "50px" }} />
          <div className="fredoka-600 text-4xl ">MESKY Delivery</div>
        </div>
        <div>
          <form
            className="flex flex-col justify-center items-center space-y-4"
            onSubmit={handleSubmit(loginFormSubmit)}
          >
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="input input-bordered w-full max-w-xs"
            />

            <div className="card-body items-center text-center">
              <div className="card-actions">
                <button className="btn btn-primary" type="submit">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
