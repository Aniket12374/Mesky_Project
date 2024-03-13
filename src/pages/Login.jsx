import {
  getMyDetails,
  loginUser,
  otpRequest,
  validateOtp,
} from "../services/auth/authService";
import bgimg from "@/assets/images/background.png";
import meskyLogo from "@/assets/mesky-logos/mesky-circle.png";
import reSendIcon from "../assets/resetIcon.svg";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMainStore } from "../store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils";

const Login = () => {
  const { register } = useForm();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [otp, setOtp] = useState(null);
  const [otpReq, setOtpReq] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    otpReq ? setOtp(e.target.value) : setUserInput(e.target.value);
  };

  // have to remove the manual the settings of the token , have to set the token while calling the api
  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(userInput) && !phoneRegex.test(userInput)) {
      setMessage("Please enter a valid email or phone number.");
      return;
    }
    if (otpReq) {
      if (!otp.length > 0) {
        setMessage("Please enter OTP");
        return;
      }
    }

    try {
      if (!otpReq) {
        await otpRequest({ signin_type: userInput });
        setOtpReq(true);
      } else {
        await validateOtp({ otp, signin_type: userInput });
        navigate("/subscription");
      }
    } catch {
      if (otpReq) {
        setMessage("Invalid Code. Please enter the correct code.");
      }
      toast.error("something Went wrong");
    }
  };

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="w-96 bg-base-100 shadow-2xl rounded-xl border-2">
        <div className="my-8 flex flex-col items-center space-y-2">
          <img src={meskyLogo} alt="mesky logo" style={{ height: "50px" }} />
          <div className="fredoka-600 text-4xl ">MESKY Delivery</div>
        </div>
        <div>
          <div className="flex flex-col justify-center items-center space-y-4">
            <input
              {...register("email", { required: true })}
              type={otpReq ? "number" : "email"}
              name="email"
              placeholder={
                otpReq ? "Please enter OTP" : "Enter email/phone number"
              }
              className="input input-bordered w-full max-w-xs"
              value={otpReq ? otp : userInput}
              onChange={handleInputChange}
            />

            <p className="text-[#FF3131] opacity-70 ml-4 sm:ml-6">{message}</p>
            <div className="card-body items-center text-center">
              <div className="card-actions" onClick={handleLogin}>
                <button className="btn btn-primary" type="submit">
                  {otpReq ? "Submit" : "OTP Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
