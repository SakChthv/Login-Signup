import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
// import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  // const { backendUrl, setIsloggedin } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/signup", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsloggedin(true);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsloggedin(true);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0">
      {/* bg-gradient-to-br from-blue-200 to-purple-400 */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shaow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-simibold text-white text-center mb-3">
          {state === "Sign Up" ? "ສ້າງບັນຊີ" : "ເຂົ້າສູ່ລະບົບ"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຖືກຕ້ອງ"
            : "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຖືກຕ້ອງ"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="ຊື່ຜູ້ໃຊ້"
                required
                className="bg-transparent outline-none"
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="ອີເມວ"
              required
              className="bg-transparent outline-none"
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="ລະຫັດຜ່ານ"
              required
              className="bg-transparent outline-none"
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            ລືມລະຫັດຜ່ານ?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>

          {state === "Sign Up" ? (
            <p className="text-gray-400 text-center text-xs mt-4">
              ທ່ານມີບັນຊີແລ້ວບໍ?{" "}
              <span
                onClick={() => setState("ເຂົ້າສູ່ລະບົບ")}
                className="text-blue-400 cursor-pointer underline"
              >
                ເຂົ້າສູ່ລະບົບ
              </span>
            </p>
          ) : (
            <p className="text-gray-400 text-center text-xs mt-4">
              ທ່ານຍັງບໍທັນບັນຊີເທື່ອບໍ?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-400 cursor-pointer underline"
              >
                ສະຫມັກ
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
