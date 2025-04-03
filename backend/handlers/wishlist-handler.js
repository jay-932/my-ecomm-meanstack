const mongoose = require("mongoose");
const Wishlist = require("./../db/wishlist");

async function addToWishlist(userId, productId) {
    console.log("Received userId:", userId);
    console.log("Received productId:", productId);
    const wishlist = new Wishlist({
        userId: userId,
        productId: productId
    });

    await wishlist.save();
    return wishlist.toObject();
}
async function removeFromWishlist(userId, productId) {
    await Wishlist.deleteMany({
        userId: userId,
        productId: productId
    });
}

async function getWishlist(userId) {
    let wishlists = await Wishlist.find({ userId: userId }).populate("productId");
    return wishlists.map(x => x.toObject().productId);
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
