const allProducts = require("../data/productList.json");

module.exports.getAllProducts = () => allProducts;
module.exports.getProductById = (id) => allProducts.find((p) => p.id === id);
