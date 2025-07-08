import React from "react";
import { assets } from "../../assets/assets";

function Navbar() {
  return (
    <div>
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      <button>ເຂົ້າສູ່ລະບົບ</button>
    </div>
  );
}

export default Navbar;
