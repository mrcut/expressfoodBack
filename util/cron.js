const cron = require("node-cron");
const {
  addHomeProducts,
  deleteHomeProducts,
} = require("../controllers/ProductsController");

const updateRandomProductsDaily = () => {
  // */10 * * * * * 
  cron.schedule("0 0 * * *", async () => {
    try {
      await deleteHomeProducts();
      await addHomeProducts();

      console.log("Produits modifié mis à jour avec succès");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des produits aléatoires:",
        error
      );
    }
  });
};

module.exports = updateRandomProductsDaily;
