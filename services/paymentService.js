const PaymentLog = require('../models/PaymentLog');

const processPayment = async ({ invoiceId, subscriptionId, amount, currency, gateway }) => {
    // Simulate payment success
    const status = 'success';
    const transactionId = `TXN-${Date.now()}`;

    const log = await PaymentLog.create({
        invoiceId,
        subscriptionId,
        amount,
        currency,
        status,
        paymentGateway: gateway,
        transactionId
    });

    return log;
};

module.exports = { processPayment };
