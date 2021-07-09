import allProducts from "../data/productList.json";

export const getProducts = () => allProducts;
export const getProductById = (id) => allProducts.find((p) => p.id === id);
