const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { noteValidation, validate } = require('../middleware/validation');
const noteController = require('../controllers/noteController');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNote);
router.post('/', noteValidation, validate, noteController.createNote);
router.put('/:id', noteValidation, validate, noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.patch('/:id/pin', noteController.togglePin);
router.patch('/:id/archive', noteController.toggleArchive);

module.exports = router;
