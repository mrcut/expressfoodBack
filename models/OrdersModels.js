const mongoose = require("mongoose");
const DelivererModels = require("./DelivererModels");

// Composition d'un schéma mongoDb

const OrdersModel = new mongoose.Schema({
  id: String,
  date: Date,
  price: Number,
  email: String,
  delivererName: String,
});

module.exports = mongoose.model("orders", OrdersModel, "Orders");
