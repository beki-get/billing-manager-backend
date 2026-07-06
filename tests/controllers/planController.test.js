import planController from '../../controllers/planController.js';
import SubscriptionPlan from '../../models/Plan.js';

jest.mock('../../models/Plan.js', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

describe('planController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('creates a plan', async () => {
    req.body = { name: 'Basic', price: 10, duration: 30, features: ['email'], businessId: 'business-1' };
    SubscriptionPlan.create.mockResolvedValue({ _id: 'plan-1' });

    await planController.createPlan(req, res);

    expect(SubscriptionPlan.create).toHaveBeenCalledWith({
      businessId: 'business-1',
      name: 'Basic',
      price: 10,
      duration: 30,
      features: ['email'],
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns plans for a business', async () => {
    const plans = [{ _id: 'plan-1' }];
    req.params.businessId = 'business-1';
    SubscriptionPlan.find.mockResolvedValue(plans);

    await planController.getPlans(req, res);

    expect(SubscriptionPlan.find).toHaveBeenCalledWith({ businessId: 'business-1' });
    expect(res.json).toHaveBeenCalledWith(plans);
  });

  it('updates a plan when it exists', async () => {
    const plan = { name: 'Basic', price: 10, duration: 30, features: ['email'], save: jest.fn().mockResolvedValue(true) };
    req.params.id = 'plan-1';
    req.body = { name: 'Pro' };
    SubscriptionPlan.findById.mockResolvedValue(plan);

    await planController.updatePlan(req, res);

    expect(plan.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(plan);
  });

  it('returns 404 when updating a missing plan', async () => {
    req.params.id = 'missing';
    SubscriptionPlan.findById.mockResolvedValue(null);

    await planController.updatePlan(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Plan not found' });
  });

  it('deletes a plan when it exists', async () => {
    const plan = { deleteOne: jest.fn().mockResolvedValue(true) };
    req.params.id = 'plan-1';
    SubscriptionPlan.findById.mockResolvedValue(plan);

    await planController.deletePlan(req, res);

    expect(plan.deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Plan deleted' });
  });
});
