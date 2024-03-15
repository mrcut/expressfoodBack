const OrdersModel = require("../models/OrdersModels");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Récupérer tous les Orders

const getOrders = async (req, res) => {
  const orders = await OrdersModel.find();
  res.status(200).json(orders);
};

// Récupérer un commande par son ID

const getOrder = async (req, res) => {
  let id = req.params.id;
  let objectId = new ObjectId(id);
  try {
    const order = await OrdersModel.findById(objectId);
    if (!order) {
      return res.status(404).json({ message: "commande non trouvé" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
    console.log(req.params.id);
  }
};

const getOrdersByEMail = async (req, res) => {
  let userEmail = req.params.userEmail;

  try {
    const orders = await OrdersModel.find({ email: userEmail });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune commande trouvée pour cet email." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

// Ajouter commande

const addOrder = async (req, res) => {
  const newOrder = new OrdersModel(req.body);
  try {
    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modfifier commande

const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const updateOrder = await OrdersModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updateOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Suprimmer commande

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteOrder = await OrdersModel.findByIdAndDelete(id);
    if (!deleteOrder) {
      return res.status(404).json({ message: "Commande introuvable" });
    }
    res.status(200).json({ message: "Commande suprimmé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getOrders,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
  getOrdersByEMail,
};
