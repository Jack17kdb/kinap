import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
