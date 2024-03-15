const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Composition d'un schéma mongoDb

const UsersModel = new mongoose.Schema({
  firstname: String,
  lastname: String,
  phone: String,
  email: String,
  address: String,
  password: String,
  role: { type: String, default: "client" },
});

UsersModel.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("users", UsersModel, "Users");
