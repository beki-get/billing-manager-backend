//controller 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { findById } from '../models/Invoice';
import Subscription from '../models/Subscription';
import PaymentLog from '../models/PaymentLog';

const payInvoiceStripe = async (req, res) => {
    const { invoiceId } = req.body;

    const invoice = await findById(invoiceId);
    if(!invoice) return res.status(404).json({ message: 'Invoice not found' });

    try {
        const paymentIntent = await stripe.paymentIntents.create({
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
