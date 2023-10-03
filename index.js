const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const helmet = require("helmet");
const mongoose = require("mongoose");
const User = require("./routes/UserRouter");
const Categorie = require("./routes/CategorieRoute");
const SousCategorie = require("./routes/SousCatRoute");
const Product = require("./routes/ProductRouter");
const coupon = require("./routes/couponRouter");
const Order = require("./routes/OrderRoute");
const port = process.env.PORT || 3000;
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () => console.log("app working on port " + port + "..."))
  )
  .then(() => console.log("connected to db"))
  .catch((e) => console.log("check ur database server :" + e));

app.use(express.json());
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://e-commercepfe.vercel.app/",
      "https://www.rezgui-aziz.me",
    ],
  })
);


app.use(helmet());
app.use("/auth", User);
app.use("/categorie", Categorie);
app.use("/sousCat", SousCategorie);
app.use("/Product", Product);
app.use("/coupon", coupon);
app.use("/order", Order);
// page not found
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "false ",
    message: "Page Note Found !",
  });
});
