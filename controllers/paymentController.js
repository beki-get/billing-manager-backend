import stripe from 'stripe';
import Invoice from '../models/Invoice.js';
import Subscription from '../models/Subscription.js';
import PaymentLog from '../models/PaymentLog.js';

const payInvoiceStripe = async (req, res) => {
    const { invoiceId } = req.body;

    // 1. Check if the environment variable exists before using it
    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({ 
            message: 'Payment configuration error. Please add STRIPE_SECRET_KEY to your .env file.' 
        });
    }

    const invoice = await Invoice.findById(invoiceId);
    if(!invoice) return res.status(404).json({ message: 'Invoice not found' });

    try {
        // 2. Initialize Stripe safely only when this endpoint is called
        const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: Math.round(invoice.amount * 100), // in cents
            currency: invoice.currency,
            metadata: { invoiceId: invoice._id.toString() },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
};

export default { payInvoiceStripe };
