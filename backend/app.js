const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRoute");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);

app.use(errorMiddleware);

module.exports = app;
