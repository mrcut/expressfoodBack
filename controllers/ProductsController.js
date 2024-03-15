const ProductsModel = require("../models/ProductModels");
const HomeModel = require("../models/HomeModels");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;


const addHomeProducts = async () => {
    try {
        const randomPlates = await ProductsModel.aggregate([
            { $match: { type: 'plat' } },
            { $sample: { size: 2 } }
        ]);

        const randomDesserts = await ProductsModel.aggregate([
            { $match: { type: 'dessert' } },
            { $sample: { size: 2 } }
        ]);

        const randomProducts = [...randomPlates, ...randomDesserts];

        // Convertir les produits aléatoires en format correspondant au schéma HomeProductsModel
        const homeProductsData = randomProducts.map(product => ({
            name: product.name,
            image: product.image,
            description: product.description,
            type: product.type,
            price: product.price,
            quantity: product.quantity,
            available: product.available

        }));

        // Insérer les données dans la collection spéciale HomeProducts
        await HomeModel.insertMany(homeProductsData);

    } catch (error) {
        console.error('Erreur lors de l\'ajout des produits à la collection spéciale:', error);
    }
};



// Fonction pour supprimer tous les produits de la collection spéciale pour la page d'accueil
const deleteHomeProducts = async () => {
  try {
    await HomeModel.deleteMany();
  } catch (error) {
    console.error(
      "Erreur lors de la suppression des produits spéciaux pour la page d'accueil :",
      error
    );
    throw error;
  }
};

// Récupérer tous les products

const getHomeProducts = async (req, res) => {
    const homeproducts = await HomeModel.find();
    res.status(200).json(homeproducts);
  };

// Récupérer tous les products

const getProducts = async (req, res) => {
  const products = await ProductsModel.find();
  res.status(200).json(products);
};

// Récupérer un product par son ID

const getProduct = async (req, res) => {
  let id = req.params.id;
  let objectId = new ObjectId(id);
  try {
    const product = await ProductsModel.findById(objectId);
    if (!product) {
      return res.status(404).json({ message: "Product non trouvé" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

// Ajouter product

const addProduct = async (req, res) => {
  const newProduct = new ProductsModel(req.body);
  try {
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modfifier product

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updateProduct = await ProductsModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateProduct) {
      return res.status(404).json({ message: "Film not found" });
    }
    res.json(updateProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Suprimmer product

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await ProductsModel.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Product introuvable" });
    }
    res.status(200).json({ message: "Product suprimmé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  addHomeProducts,
  deleteHomeProducts,
  getHomeProducts
};
