const express = require("express");
const categories_router = require("./Routes/category-routes").router;
const items_router = require("./Routes/item-routes").router;

// init app and middleware
const app = express();

// set the view engine to ejs
app.set("view engine", "ejs");

//use middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(categories_router);
app.use(items_router);

// app listens
app.listen(3000, () => {
  console.log("App is running on port 3000.");
});
