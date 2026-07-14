import businessService from '../services/businessService.js';

const createBusiness = async (req, res) => {
  try {
    const { name, currency } = req.body;
    const business = await businessService.createBusiness({
      name,
      currency,
      ownerId: req.user._id,
      user: req.user,
    });

    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create business' });
  }
};

const getUserBusinesses = async (req, res) => {
  try {
    const businesses = await businessService.getBusinessesByOwner(req.user._id);
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch businesses' });
  }
};

export default { createBusiness, getUserBusinesses };
