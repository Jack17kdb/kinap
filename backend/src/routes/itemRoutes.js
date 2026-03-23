import express from 'express';
import protect from '../middleware/protect.js';
import itemController from '../controllers/itemController.js';

const router = express.Router();

router.post('/create', protect, itemController.createItem);
router.get('/items', protect, itemController.getItems);
router.get('/search', protect, itemController.searchItems);
router.get('/:id', protect, itemController.getItemById);
router.put('/:id/status', protect, itemController.updateItemStatus);
router.delete('/:id', protect, itemController.deleteItem);

export default router;