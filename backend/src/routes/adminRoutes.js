import express from 'express';
import adminController from '../controllers/adminController.js';
import protect from '../middleware/protect.js';
import admin from '../middleware/admin.js';

const router = express.Router();

router.get("/users", protect, admin, adminController.getUsers);
router.get("/users/search", protect, admin, adminController.searchUsers);
router.get("/stats/items", protect, admin, adminController.getItemStats);
router.get("/stats/locations", protect, admin, adminController.getLostLocations);
router.post("/locations", protect, admin, adminController.addLocations);
router.post("/categories", protect, admin, adminController.addCategories);
router.get("/posts/:userId", protect, admin, adminController.getUserPosts);
router.get("/post/:id", protect, admin, adminController.getUserPost);
router.delete("/post/:id", protect, admin, adminController.deleteUserPost);

export default router;
