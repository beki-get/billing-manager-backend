const SubscriptionPlan = require('../models/SubscriptionPlan');

// Create plan
const createPlan = async (req, res) => {
    const { name, price, duration, features, businessId } = req.body;
    const plan = await SubscriptionPlan.create({
        businessId,
        name,
        price,
        duration,
        features: features || []
    });
    res.status(201).json(plan);
};

// Get all plans of a business
const getPlans = async (req, res) => {
    const plans = await SubscriptionPlan.find({ businessId: req.params.businessId });
    res.json(plans);
};

// Update plan
const updatePlan = async (req, res) => {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if(!plan) return res.status(404).json({ message: 'Plan not found' });

    const { name, price, duration, features } = req.body;
    plan.name = name || plan.name;
    plan.price = price || plan.price;
    plan.duration = duration || plan.duration;
    plan.features = features || plan.features;

    await plan.save();
    res.json(plan);
};

// Delete plan
const deletePlan = async (req, res) => {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if(!plan) return res.status(404).json({ message: 'Plan not found' });

    await plan.deleteOne();
    res.json({ message: 'Plan deleted' });
    
};

module.exports = { createPlan, getPlans, updatePlan, deletePlan };
