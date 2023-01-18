import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoute from "./src/routes/AuthRoute.js";
import UserRoute from "./src/routes/UserRoute.js";
import PostRoute from "./src/routes/PostRoute.js";
import UploadRoute from "./src/routes/UploadRoute.js";

const app = express();

// to serve images public
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();

// MONGOOSE SETUP
const port = process.env.PORT || 4000;
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () => console.log(`Server listening on port ${port}!`))
  )
  .catch((err) => console.log(err.message));

app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/post", PostRoute);
app.use("/api/upload", UploadRoute);
