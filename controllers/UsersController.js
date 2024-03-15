const UsersModel = require("../models/UserModels");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Récupérer un utilisateur par son ID

const getUser = async (req, res) => {
  let id = req.params.id;
  const user = await UsersModel.findById(id);
  res.status(200).json(user);
};

// Récupérer la liste des utilisateurs

const getUsers = async (req, res) => {
  const user = await UsersModel.find();
  res.status(200).json(user);
};

// Modifier un utilisateur

const updateUser = async (req, res) => {
  let id = req.params.id;
  let objectId = new ObjectId(id);
  const user = await UsersModel.findByIdAndUpdate(
    objectId,
    {
      $set: req.body,
    },
    { new: true }
  );

  res.status(200).json(user);
};

// Supprimmer un utilisateur 

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUser, getUsers, updateUser, deleteUser };
