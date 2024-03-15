const DeliverersModel = require("../models/DelivererModels");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Récupérer tous les deliverers

const getDeliverers = async (req, res) => {
  const deliverers = await DeliverersModel.find();
  res.status(200).json(deliverers);
};

// Récupérer un deliverer par son ID

const getDeliverer = async (req, res) => {
  let id = req.params.id;
  let objectId = new ObjectId(id);
  try {
    const deliverer = await DeliverersModel.findById(objectId);
    if (!deliverer) {
      return res.status(404).json({ message: "deliverer non trouvé" });
    }
    res.status(200).json(deliverer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

// Ajouter deliverer

const addDeliverer = async (req, res) => {
  const newDeliverer = new DeliverersModel(req.body);
  try {
    await newDeliverer.save();
    res.json(newDeliverer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modfifier deliverer

const updateDeliverer = async (req, res) => {
  const { id } = req.params;
  try {
    const updateDeliverer = await DeliverersModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updateDeliverer) {
      return res.status(404).json({ message: "Deliverer not found" });
    }
    res.json(updateDeliverer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Suprimmer deliverer

const deleteDeliverer = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteDeliverer = await DeliverersModel.findByIdAndDelete(id);
    if (!deleteDeliverer) {
      return res.status(404).json({ message: "Deliverer introuvable" });
    }
    res.status(200).json({ message: "Deliverer suprimmé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDeliverers,
  getDeliverer,
  addDeliverer,
  updateDeliverer,
  deleteDeliverer,
};
