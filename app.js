const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
require("dotenv").config(); // accessing env file
//user imports
const routes = require("./routes/routes");

app.use(express.json());

app.use(cors());
app.use(routes);

app.get("/", (req, res) => {
  res.status(200).json({ status: true });
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.httpStatusCode || 500);
  res.json({ message: error.message, status: false });
});

mongoose.connect(process.env.DB_URI, { autoIndex: false }, (err) => {
  if (!err) {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`conected to http://localhost:8080`);
    });
  } else {
    console.log(`err`, err);
  }
});
