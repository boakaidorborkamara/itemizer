const { ObjectId } = require("mongodb");
const { connectDB } = require("../dbConfig");
const { dirname } = require("path");

// configure db
let db;
connectDB((db_client, err) => {
  // don't update db variable when there's an err
  if (err) {
    console.log(err);
    return;
  }

  // update db variable when connection is successful
  db = db_client;
});

const getCategories = (req, res) => {
  let categories = [];

  db.collection("category")
    .find()
    .forEach((category) => {
      categories.push(category);
    })
    .then(() => {
      // res.status(200).json({ categories: categories });
      console.log(categories);
    });

  res.render("pages/categories");
};

const getCategoryDetails = (req, res) => {
  let id = req.params.id;
  console.log("id", id);

  if (ObjectId.isValid) {
    db.collection("category")
      .findOne({ _id: new ObjectId(id) })
      .then((result) => {
        // sent category details if category is in db
        if (result !== null) {
          res.status(200).json(result);
        } else {
          res.status(500).json({ msg: "Category doesn't exists." });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res.status(500).json({ msg: "invalid ID" });
  }
};

const displayNewCategoryForm = (req, res) => {
  res.render("pages/add-category");
};

const addCategory = [
  (req, res) => {
    const fs = require("fs");
    const path = require("path");
    const { Buffer } = require("buffer");

    let new_category = req.body;
    // console.log("new_category", new_category);

    let data = new_category.image.file_data;

    data = data.split(";");
    data = data[1];
    data = data.split(",");

    let buff = Buffer.from(data[1], "base64");
    let date = Date.now();
    let file_name = `./Public/images/uploads/${date}-${new_category.image.file_details.name}`;
    console.log("filename", file_name);
    console.log("dir name", path.join(__dirname, "/Public"));
    fs.writeFileSync(file_name, buff);

    // console.log(
    //   "Base64 image data converted to file: stack-abuse-logo-out.png"
    // );

    res.status(200).json({ got: "working" });

    // db.collection("category")
    //   .insertOne(new_category)
    //   .then((result) => {
    //     res.status(201).json(result);
    //   })
    //   .catch((err) => {
    //     res.status(500).json(err);
    //   });
  },
];

const editCategory = (req, res) => {
  let query = { id: req.params.id };
  let new_values = { $set: req.body };

  // console.log("id", req.params.id);
  // console.log("new values", new_values);

  db.collection("category")
    .updateOne(query, new_values)
    .then((err, res) => {
      if (err) {
        console.log("ERR", err);
        res.status(500).json(err);
      } else {
        console.log("RES", res);
      }
    })
    .catch((err) => {
      console.log("ERR", err);
    });
};

const deleteCategory = (req, res) => {
  console.log("deleting...");
  let id = req.params.id;
  db.collection("category")
    .deleteOne({ _id: new ObjectId(id) })
    .then((err) => {
      if (err) {
        console.log("ERR", err);
        res.status(500).json(err);
      } else {
        res.status(200).json({ msg: "Category deleted" });
      }
    });
};

module.exports = {
  getCategories,
  displayNewCategoryForm,
  getCategoryDetails,
  addCategory,
  editCategory,
  deleteCategory,
};
