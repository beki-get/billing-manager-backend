import Business from '../models/Business.js';
import User from '../models/User.js';

const createBusiness = async ({ name, currency, ownerId, user }) => {
  const business = await Business.create({
    name,
    currency: currency || 'ETB',
    owner: ownerId,
  });

  if (user) {
    user.businesses.push(business._id);
    await user.save();
  }

  return business;
};

const getBusinessesByOwner = async (ownerId) => {
  return Business.find({ owner: ownerId });
};

export default { createBusiness, getBusinessesByOwner };
