import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "ກະລຸນາເຂົ້າສູ່ລະບົບອີກຄັ້ງ" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      //   req.body.userId = tokenDecode.id;
      req.user = { id: tokenDecode.id };
    } else {
      return res.json({ success: false, message: "ເຂົ້າສູ່ລະບົບອີກຄັ້ງ" });
    }

    next();
  } catch (err) {
    res.clearCookie("token");
    res.json({ success: false, message: err.message });
  }
};

export default userAuth;
