const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const Invoice = require('../models/Invoice');
const Subscription = require('../models/Subscription');
const PaymentLog = require('../models/PaymentLog');

router.post('/stripe', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch(err){
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if(event.type === 'payment_intent.succeeded'){
        const paymentIntent = event.data.object;
        const invoiceId = paymentIntent.metadata.invoiceId;

        const invoice = await Invoice.findById(invoiceId);
        if(invoice){
            invoice.status = 'paid';
            await invoice.save();

            const subscription = await Subscription.findById(invoice.subscriptionId);
            subscription.retries = 0; // reset retry counter
            subscription.status = 'active';
            await subscription.save();

            await PaymentLog.create({
                invoiceId: invoice._id,
                subscriptionId: subscription._id,
                amount: invoice.amount,
                currency: invoice.currency,
                status: 'success',
                paymentGateway: 'stripe',
                transactionId: paymentIntent.id
            });
             await logAction('PAYMENT_SUCCESS', 'Invoice', invoice._id, { status: invoice.status });
        }
   

    }

    if(event.type === 'payment_intent.payment_failed'){
        const paymentIntent = event.data.object;
        const invoiceId = paymentIntent.metadata.invoiceId;

        const invoice = await Invoice.findById(invoiceId);
        if(invoice){
            invoice.status = 'failed';
            await invoice.save();

            const subscription = await Subscription.findById(invoice.subscriptionId);
            subscription.retries += 1;
            await subscription.save();

            await PaymentLog.create({
                invoiceId: invoice._id,
                subscriptionId: subscription._id,
                amount: invoice.amount,
                currency: invoice.currency,
                status: 'failure',
                paymentGateway: 'stripe',
                transactionId: paymentIntent.id
            });
             await logAction('PAYMENT_SUCCESS', 'Invoice', invoice._id, { status: invoice.status });
        }
    }

    res.json({ received: true });
});

module.exports = router;
