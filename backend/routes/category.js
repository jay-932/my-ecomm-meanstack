const express = require("express");
const router = express.Router();
const Category = require("../db/category"); // ✅ Category Model Import Kiya

// ✅ Ab `getCategoryById` ko import karein
const { addCategory, updateCategory, deleteCategory, getCategories, getCategoryById } = require("../handlers/category-handler");

// ✅ Add Category
router.post("", async (req, res) => {
    console.log("here");
    let model = req.body;
    let result = await addCategory(model);
    res.send(result);
});

// ✅ Get All Categories
router.get("", async (req, res) => {
    let result = await getCategories();
    res.send(result);
});

// ✅ Get Category by ID (Fix Applied)
router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let result = await getCategoryById(id);
        
        if (!result) {
            return res.status(404).send({ message: "Category Not Found" });
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
    await updateCategory(id, model);
    res.send({ message: "Updated" });
});

// ✅ Delete Category
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    await deleteCategory(id);
    res.send({ message: "Deleted" });
});

module.exports = router;
