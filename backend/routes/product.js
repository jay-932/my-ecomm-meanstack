const express = require("express");
const router = express.Router();
// ✅ Ab `getCategoryById` ko import karein
const { addProduct, updateProduct, deleteProduct, getProducts, getProductById } = require("../handlers/product-handler");

// ✅ Add Category
router.post("", async (req, res) => {
    console.log("here");
    let model = req.body;
    let result = await addProduct(model);
    res.send(result);
});

// ✅ Get All Brands
router.get("", async (req, res) => {
    let result = await getProducts();
    res.send(result);
});

// ✅ Get Category by ID (Fix Applied)
router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let result = await getProductById(id);
        
        if (!result) {
            return res.status(404).send({ message: "Product Not Found" });
        }

        res.send(result);
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Update Category
router.put("/:id", async (req, res) => {
    let model = req.body;
    let id = req.params.id;
    await updateProduct(id, model);
    res.send({ message: "Updated" });
});

// ✅ Delete Category
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    await deleteProduct(id);
    res.send({ message: "Deleted" });
});

module.exports = router;
