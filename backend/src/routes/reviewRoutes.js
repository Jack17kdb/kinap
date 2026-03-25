import express from 'express';
import { postReview, getAllReviews } from '../controllers/reviewController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.get("/", protect, getAllReviews);
router.post("/", protect, postReview);

export default router;
