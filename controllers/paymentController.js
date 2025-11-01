//controller 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Invoice = require('../models/Invoice');
const Subscription = require('../models/Subscription');
const PaymentLog = require('../models/PaymentLog');

const payInvoiceStripe = async (req, res) => {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findById(invoiceId);
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

module.exports = { payInvoiceStripe };
