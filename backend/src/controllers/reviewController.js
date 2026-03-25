import Review from '../models/reviewModel.js';

export const postReview = async (req, res) => {
    try {
        const { content, rating } = req.body;

        if (!content || !rating) {
            return res.status(400).json({ message: "Please provide a review and a rating" });
        }

        const newReview = await Review.create({
            username: req.user.username,
            content,
            rating
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.log("Error posting review: ", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.log("Error fetching reviews: ", error);
        res.status(500).json({ message: error.message });
    }
};