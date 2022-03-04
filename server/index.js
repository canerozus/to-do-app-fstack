const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const indexRouter = require("./routes/indexRouter");
const app = express();
const cors = require("cors");
app.use(cors({origin:'localhost:3000', credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongo connected!");
  })
  .catch((err) => console.log(err));

app.use("/api", indexRouter);

app.listen(5000, () => {
  console.log("backend server is running!");
});
