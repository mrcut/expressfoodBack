const mongoose = require("mongoose");

// Composition d'un schéma mongoDb

const DeliverersModel = new mongoose.Schema({
  lastname: String,
  firstname: String,
  status: String,
  position: String,
});

module.exports = mongoose.model("deliverers", DeliverersModel, "Deliverers");
