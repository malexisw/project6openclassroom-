const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require('express-rate-limit')
const { dbUrl } = require("./config");
const { port } = require("./config");
const userRouter = require("./routes/Users");
const saucesRouter = require("./routes/Sauces");

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const mongoDB = dbUrl;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRouter);
app.use(saucesRouter);
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => {
  console.log("Server is running at port " + port);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
