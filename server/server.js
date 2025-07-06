import express from "express";
import cors from "cors";
import "dotenv/config";
import cookiePaser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoute.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();
app.use(express.json());
app.use(cookiePaser());
app.use(cors({ credentials: true }));

app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);

app.listen(port, () => console.log(`Server run on PORT:${port}`));
