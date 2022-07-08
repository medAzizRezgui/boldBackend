const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv/config");
const morgan = require('morgan'); 
const mongoose = require("mongoose");
const User = require("./routes/UserRouter");
const Categorie = require("./routes/CategorieRoute");
const SousCategorie = require("./routes/SousCatRoute");
const Product = require("./routes/ProductRouter");

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((e) => console.log("check ur database server :" + e));

app.use(express.json());
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: ['http://localhost:4200','http://localhost:3000'],
  })
);
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use("/iiiijaMena", User);
app.use("/categorie", Categorie);
app.use("/sousCat", SousCategorie);
app.use("/Product", Product);
// page not found
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "false ",
    message: "Page Note Found !",
  });
});

if(process.env.NODE_ENV === 'development'){
app.use(morgan('tiny'));
} 

const port = process.env.port || 3000;
app.listen(3000, () => console.log("app working on port " + port + "..."));
