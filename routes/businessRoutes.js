const express = require('express');
const router = express.Router();
const { createBusiness, getUserBusinesses } = require('../controllers/businessController').default;
const { protect } = require('../middlewares/auth').default;

router.post('/', protect, createBusiness);
router.get('/', protect, getUserBusinesses);

module.exports = router;
