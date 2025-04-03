const Product = require("./../db/product");
const mongoose = require("mongoose");

async function getProducts(){

    let products = await Product.find();
    return products.map((c)=>c.toObject());
    
}

async function getProductById(id){
    let product = await Product.findById(id);

    return product.toObject();
}
async function addProduct(model) {
    try {
        console.log("🔍 Validating Data:", model); // Debugging ke liye

        // ✅ Ensure all required fields are present
        if (!model.name || !model.shortDescription || !model.description || 
            !model.price || !model.categoryId || !model.brandId) {
            return { error: "❌ All required fields must be provided." };
        }

        // ✅ Ensure `images` is an array
        model.images = model.images?.filter(img => img) || [];

        const product = new Product(model);
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        console.error("❌ Error adding product:", error);
        return { error: "Failed to add product", details: error };
    }
}
async function updateProduct(id,model){
    await Product.findOneAndUpdate({_id:id}, model);
    return;
}

async function deleteProduct(id){
    await Product.findByIdAndDelete(id);
    return;
}

async function getAllProducts(){

    let products = await Product.find();
    return products.map((c)=>c.toObject());
    
}

async function getProduct(id){
    if (!mongoose.Types.ObjectId.isValid(id)) {  
        throw new Error("Invalid Product ID Format");  // ✅ Invalid ID ke liye check
    }

    let product = await Product.findById(id);  // ✅ Correct: findById() ek single object return karega
    return product ? product.toObject() : null;
}

async function getNewProducts(){
    let newProducts = await Product.find({
        isNewProducts:true,
    });

    return newProducts.map((x) =>x.toObject());
}
async function getFeaturedProducts(){
    let featuredProducts = await Product.find({
        isFeatured:true,
    });

    return featuredProducts.map((x) =>x.toObject());
}


async function getProductForListing(searchTerm, categoryId, page, pageSize, sortBy, sortOrder, brandId) {
    if (!sortBy) {
        sortBy = 'price';
    }
    if (!sortOrder) {
        sortOrder = -1;
    }

    let queryFilter = {};
    if (searchTerm) {
        queryFilter.$or = [
            { name: { $regex: ".*" + searchTerm + ".*", $options: "i" } }, // Case insensitive search
            { shortDescription: { $regex: ".*" + searchTerm + ".*", $options: "i" } }
        ];
    }

    if (categoryId) {
        queryFilter.categoryId = categoryId;
    }
    if (brandId) {
        queryFilter.brandId = brandId;
    }

    // ✅ `paze` की जगह `page` का उपयोग किया
    const products = await Product.find(queryFilter)
        .sort({ [sortBy]: +sortOrder })
        .skip((+page - 1) * +pageSize)
        .limit(+pageSize);

    return products.map(x => x.toObject());
}




module.exports = {addProduct, updateProduct,deleteProduct, getProducts, getProductById,getNewProducts,getFeaturedProducts,
    getProductForListing,getAllProducts,getProduct
}