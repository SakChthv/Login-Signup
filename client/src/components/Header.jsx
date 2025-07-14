import React from "react";
import { assets } from "../../assets/assets.js";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const Header = () => {
  const { userData } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center ttext-gray-800">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        ສະບາຍດີ {userData ? userData.name : "Dev ທຸກໆທ່ານ"}!
        <img src={assets.hand_wave} className="w-8 aspect-square" alt="" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-simibold mb-4">
        ຍີນດີຕ້ອນຮັບເຂົ້າສູ່ພື້ນທີ່ຂອງ Web Dev
      </h2>
      <p className="mb-8 max-w-md">
        ຂ້ອຍເປັນຄົນໜື່ງທີ່ມັກພັດທະນາ, ແລະຮຽນຮູ້ສີ່ງໃໝ່ໆ
        ໂດຍສະເພາະແມ່ນທາງດ້ານເຕັກໂນໂລຊີ ແລະ ການພັດທະນາ Software
      </p>
      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;
