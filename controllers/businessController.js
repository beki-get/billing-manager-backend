const Business = require('../models/Business');
const User = require('../models/User');

// Create a new business
const createBusiness = async (req, res) => {
    const { name, currency } = req.body;
    const business = await Business.create({
        name,
        currency: currency || 'USD',
        owner: req.user._id
    });

    // Add business to user
    req.user.businesses.push(business._id);
    await req.user.save();

    res.status(201).json(business);
};

// Get all businesses of logged-in user
const getUserBusinesses = async (req, res) => {
    const businesses = await Business.find({ owner: req.user._id });
    res.json(businesses);
};

module.exports = { createBusiness, getUserBusinesses };
