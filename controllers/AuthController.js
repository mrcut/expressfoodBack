const User = require("../models/UserModels");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

// Créer un compte

const Signup = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, phone, role, address } =
      req.body;

    console.log(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User existe déjà" });
    }
    const user = await User.create({
      firstname,
      lastname,
      phone,
      email,
      address,
      password,
      role,
    });
    const token = createSecretToken(user._id, user);
    res.set("Authorization", "Bearer " + token);

    res.json({
      message: "Utilisateur enregistré avec succès",
      success: true,
      user,
    });
    next();
  } catch (error) {
    console.error(error);
  }
};

// Se connecter

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "Tous les champs sont requis" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "Utilisateur introuvable" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Mot de passe ou email incorrect" });
    }
    const token = createSecretToken(user._id, user);
    res.set("Authorization", "Bearer " + token);

    const userResponse = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      role: user.role,
      address: user.address,
    };

    res.status(201).json({
      message: "Utilisateur connecté avec succès",
      success: true,
      user: userResponse,
      token,
    });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

module.exports = { Login, Signup };
