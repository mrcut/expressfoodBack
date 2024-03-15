const mongoose = require("mongoose");

// Composition d'un schéma mongoDb

const ProductsModel = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  type: String,
  price: Number,
  quantity: Number,
  available: Boolean,
});

module.exports = mongoose.model("products", ProductsModel, "Products");
