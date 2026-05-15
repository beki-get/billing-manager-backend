import { Router } from 'express';
import express from 'express'; // Added to get the raw body parser safely
import stripe from 'stripe';
import Invoice from '../models/Invoice.js';
import Subscription from '../models/Subscription.js';
import PaymentLog from '../models/PaymentLog.js';
import logAction from '../utils/auditLogger.js';

const router = Router();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    // 1. Safe guard against missing environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('❌ Webhook keys are missing from environment configuration.');
        return res.status(500).send('Webhook server unconfigured.');
    }

    let event;

    try {
        // 2. Initialize Stripe safely inside the running request block
        const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
        
        event = stripeClient.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
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
            if (subscription) { 
                subscription.retries = 0; 
                subscription.status = 'active';
                await subscription.save();
            }

            await PaymentLog.create({
                invoiceId: invoice._id,
                subscriptionId: invoice.subscriptionId, 
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
            if (subscription) { 
                subscription.retries += 1;
                await subscription.save();
            }

            await PaymentLog.create({
                invoiceId: invoice._id,
                subscriptionId: invoice.subscriptionId, 
                amount: invoice.amount,
                currency: invoice.currency,
                status: 'failure',
                paymentGateway: 'stripe',
                transactionId: paymentIntent.id
            });
           
            await logAction('PAYMENT_FAILURE', 'Invoice', invoice._id, { status: invoice.status });
        }
    }

    res.json({ received: true });
});

export default router;
