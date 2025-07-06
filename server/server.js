import express from "express";
import cors from "cors";
import "dotenv/config";
import cookiePaser from "cookie-parser";

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cookiePaser());
app.use(cors({ credentials: true }));

app.get("/", (req, res) => res.send("API working"));

app.listen(port, () => console.log(`Server run on PORT:${port}`));
