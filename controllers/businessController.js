// controllers/businessController.js
import { create, find } from '../models/Business';
import User from '../models/User';

// Create a new business
const createBusiness = async (req, res) => {
    const { name, currency } = req.body;
    const business = await create({
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
    const businesses = await find({ owner: req.user._id });
    res.json(businesses);
};

export default { createBusiness, getUserBusinesses };
