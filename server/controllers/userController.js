import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    // const { userId } = req.body;
    const { id: userId } = req.user;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "ບໍ່ພົບຜູ້ໃຊ້ງານ!" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
