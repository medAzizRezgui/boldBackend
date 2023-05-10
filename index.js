const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv/config");
const morgan = require('morgan');
const helmet = require("helmet");
const path = require('path');
const mongoose = require("mongoose");
const User = require("./routes/UserRouter");
const Categorie = require("./routes/CategorieRoute");
const SousCategorie = require("./routes/SousCatRoute");
const Product = require("./routes/ProductRouter");
const discountCode = require("./routes/discountRouter");
const Order = require('./routes/OrderRoute')

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
// app.use(express.static(__dirname + "/public"));
// app.use("/uploads", express.static("uploads"));

// app.use(express.static("public"));
// app.use("/uploads", express.static("uploads"));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('tiny'));
  }

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/client/build')));
//   app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
// } else {
//   app.get('/', (req, res) => { res.send('API is running....'); });
// }

app.use(helmet());
app.use("/auth", User);
app.use("/categorie", Categorie);
app.use("/sousCat", SousCategorie);
app.use("/Product", Product);
app.use("/code", discountCode);
app.use("/order", Order);
// page not found
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "false ",
    message: "Page Note Found !",
  });
});

const port = process.env.port || 3000;
app.listen(port, () => console.log("app working on port " + port + "..."));
