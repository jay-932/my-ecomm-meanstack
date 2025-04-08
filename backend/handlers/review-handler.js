const Review = require("./../db/review");
const User = require("./../db/user");

const addReview = async (productId, comment, rating, userId) => {
  if (!comment || !rating) throw new Error("Comment and rating are required");

  const review = new Review({
    product: productId,
    comment,
    rating,
    user: userId
  });

  await review.save();
  return review;
};

const getReviews = async (productId) => {
  const reviews = await Review.find({ product: productId }).populate("user", "name");
  return reviews;
};

const deleteReview = async (reviewId) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }
  return review;
};

module.exports = { addReview, getReviews, deleteReview };
