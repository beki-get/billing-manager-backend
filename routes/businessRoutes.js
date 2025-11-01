const express = require('express');
const router = express.Router();
const { createBusiness, getUserBusinesses } = require('../controllers/businessController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, createBusiness);
router.get('/', protect, getUserBusinesses);

module.exports = router;
