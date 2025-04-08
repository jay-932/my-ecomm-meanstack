const express = require("express");
const {
  getNewProducts,
  getFeaturedProducts,
  getProductForListing,
  getProduct
} = require("../handlers/product-handler");
const { getCategories } = require("../handlers/category-handler");
const { getBrands } = require("../handlers/brand-handler");
const {
  addOrder,
  getCustomerOrders
} = require("../handlers/order-handler");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require("../handlers/wishlist-handler");
const {
  getCartItems,
  addToCart,
  removefromCart,
  clearCart
} = require("../handlers/shopping-cart-handler");

const { addReview, getReviews, deleteReview } = require("../handlers/review-handler");


const router = express.Router();

router.get("/new-products", async (req, res) => {
  const products = await getNewProducts();
  res.send(products);
});

router.get("/featured-products", async (req, res) => {
  const products = await getFeaturedProducts();
  res.send(products);
});

router.get("/categories", async (req, res) => {
  const categories = await getCategories();
  res.send(categories);
});

router.get("/brands", async (req, res) => {
  const brands = await getBrands();
  res.send(brands);
});

router.get("/products", async (req, res) => {
  const {
    searchTerm,
    categoryId,
    sortBy,
    sortOrder,
    brandId,
    pageSize,
    page
  } = req.query;

  const products = await getProductForListing(
    searchTerm,
    categoryId,
    page,
    pageSize,
    sortBy,
    sortOrder,
    brandId
  );

  res.send(products);
});

router.get("/product/:id", async (req, res) => {
  const id = req.params["id"];
  try {
    const product = await getProduct(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/wishlists", async (req, res) => {
  const userId = req.user.id;
  const items = await getWishlist(userId);
  res.send(items);
});

router.post("/wishlists/:id", async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  const item = await addToWishlist(userId, productId);
  res.send(item);
});

router.delete("/wishlists/:id", async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  await removeFromWishlist(userId, productId);
  res.send({ message: "ok" });
});

router.get("/carts", async (req, res) => {
  const userId = req.user.id;
  const items = await getCartItems(userId);
  res.send(items);
});

router.post("/carts/:id", async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  const quantity = req.body.quantity;
  const items = await addToCart(userId, productId, quantity);
  res.send(items);
});

router.delete("/carts/:id", async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  const items = await removefromCart(userId, productId);
  res.send(items);
});

router.post("/order", async (req, res) => {
  const userId = req.user.id;
  const order = req.body;
  await addOrder(userId, order);
  await clearCart(userId);
  return res.send({ message: "Order Created" });
});

router.get("/orders", async (req, res) => {
  const userId = req.user.id;
  const orders = await getCustomerOrders(userId);
  return res.send(orders);
});

/// ✅ Review Routes

router.post("/products/:id/reviews", async (req, res) => {
  const productId = req.params.id;
  const { comment, rating } = req.body;
  const userId = req.user.id;

  try {
    const review = await addReview(productId, comment, rating, userId);
    res.status(201).json(review);
  } catch (error) {
    console.error("❌ Review Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get("/products/:id/reviews", async (req, res) => {
  const productId = req.params.id;

  try {
    const reviews = await getReviews(productId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE review route
router.delete("/reviews/:id", async (req, res) => {
  const reviewId = req.params.id;
  try {
    await deleteReview(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
  

module.exports = router;
