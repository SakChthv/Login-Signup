import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplate.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "ບໍ່ພົບຂໍ້ມູນ" });
  }
  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "ບັນຊີນີ້ໄດ້ສະຫມັກແລ້ວ" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "ຍີນດີຕ້ອນຮັບ",
      text: `ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ cooperTech, ໄອດີຂອງທ່ານແມ່ນ: ${email}`,
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "ກະລຸນາໃສ່ອີເມວ ຫຼື ລະຫັດຜ່ານ",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "ບໍ່ພົບອີເມວ!, ກະລຸນາລອງອີກຄັ້ງ",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!, ກະລຸນາລອງອີກຄັ້ງ",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "ອອກຈາກລະບົບສຳເລັັດ!" });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Send OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    // const { userId } = req.body;
    const { id: userId } = req.user;

    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "ບັນຊີໄດ້ຖືກຍືນຍັນແລ້ວ!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "ຍືນຍັນລະຫັດດ້ວຍ OTP",
      // text: `ລະຫັດຂອງທ່ານ OTP ແມ່ນ ${otp}, ລະຫັດນີ້ໄດ້ພຽງຄັ້ງດຽວໃນການຍືນຍັນບັນຊີຂອງທ່ານ`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOption);

    res.json({
      success: true,
      message: "ລະຫັດ OTP ຖືກສົ່ງທາງອີເມວຂອງທ່ານແລ້ວ",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verfyEmail = async (req, res) => {
  //   const { userId, otp } = req.body;
  const { id: userId } = req.user;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "ບໍ່ພົບອີເມວ!" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "ບໍ່ພົບຜູ້ໃຊ້!" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({
        success: false,
        message: "OTP ບໍ່ຖືກຕ້ອງ, ກະລຸນາລອງອີກຄັ້ງ",
      });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP ຫມົດອາຍຸ" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = "0";

    await user.save();

    return res.json({ success: true, message: "ຍືນຍັນອີເມວສຳເລັດ!" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// send otp password reset
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "ກະລຸນາໃສ່ອີເມວ!" });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "ບໍ່ພົບຜູ້ໃຊ້ງານ!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "ປ່ຽນລະຫັດຜ່ານ",
      // text: `ກະລຸນາໃສ່ OTP ${otp} ຂອງທ່ານເພື່ອຍືນຍັນໃນການປ່ຽນລະຫັດຜ່ານ, ລະຫັດນີ້ໄດ້ພຽງຄັ້ງດຽວໃນການຍືນຍັນບັນຊີຂອງທ່ານ`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOption);
    return res.json({ success: true, message: "OTP ຖືກສົ່ງໄປຍັງອີເມວຂອງທ່ານ" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// reset user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "ກະລຸນາໃສ່ອີເມວ, ແລະ ລະຫັດປ່ານໃໝ່!",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "ບໍ່ພົບຜູ້ໃຊ້ງານ!" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "OTP ບໍ່ຖືກຕ້ອງ" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "ຂໍອະໄພ OTP ຂອງທ່ານຫມົດອາຍຸແລ້ວ",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "ປ່ຽນລະຫັດຜ່ານສຳເລັດ!" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
