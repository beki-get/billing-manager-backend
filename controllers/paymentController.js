import Invoice from "../models/Invoice.js";
import paymentService from "../services/paymentService.js";

const initializeInvoicePayment = async (req, res) => {
    const startTime = Date.now();
    const { invoiceId } = req.params
    try {
        if (!invoiceId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_INVOICE_ID',
                    message: 'The provided Invoice ID format is structurally invalid.'
                }
            })
        }

        const invoice = await Invoice.findById(invoiceId)
        if (!invoice) {
            return res.status(404).json({
                error: {
                    code: 'INVOICE_NOT_FOUND',
                    message: 'No invoice found with the provided ID'
                }
            })
        }

        if (invoice.status === 'paid') {
            return res.status(400).json({
                error: {
                    code: 'ALREADY_PAID',
                    message: 'This invoice has already been paid.'
                }
            })
        }

        const chapaPaymentData = {
            amount: invoice.amount,
            currency: invoice.currency,
            email: invoice.customerEmail,
            firstName: invoice.customerName ? invoice.customerName.split(' ')[0] : 'Client',
            lastName: invoice.customerName ? invoice.customerName.split(' ').slice(1).join(' ') || 'Customer' : 'User',
            txRef: `tx-${invoice._id.toString()}-${Date.now()}`,
            invoiceNumber: invoice.invoiceNumber,
            callbackUrl: `${process.env.APP_BASE_URL}/api/payments/success`
        }

        const chapaResponse = await paymentService.initializePaymentSession(chapaPaymentData);
        console.log(`[INFO] Handshake successful. Redirecting user to gateway channel. Duration: ${Date.now() - startTime}ms`);
        return res.redirect(chapaResponse.data.checkout_url);

    } catch (error) {
        console.error(`[ERROR] Payment initialization crashed for Invoice ID ${invoiceId}:`, {
            message: error.message,
            statusCode: error.statusCode,
            duration: `${Date.now() - startTime}ms`
        });

        return res.status(error.statusCode || 500).json({
            error: {
                code: 'PAYMENT_INITIALIZATION_FAILED',
                message: error.message || 'Failed to initialize transaction gateway connection.'
            }
        });
    }
}

const handleChapaWebhook = async (req, res) => {
    const { event, status, reference } = req.body;
    if (event !== 'charge.success' || status !== 'success') {
        return res.status(200).json({ message: 'Event dropped: Non-actionable non-success state payload received.' })
    }
    try {
        const invoice = await Invoice.findById(reference);
        if (!invoice) {
            console.warn(`[WARN] Webhook received for non-existent Invoice ID ${reference}. Event ignored.`)
            return res.status(200).json({ message: 'Event ignored: No matching invoice found for provided reference.' })
        }
        if (invoice.status === 'paid') {
            console.info(`[INFO] Webhook received for already paid Invoice ID ${reference}. No action taken.`)
            return res.status(200).json({ message: 'Event acknowledged: Invoice already marked as paid.' })
        }
       

        invoice.status = 'paid';
        await invoice.save();
        console.log(`[INFO] Invoice ID ${reference} marked as paid successfully.`)
        return res.status(200).json({ message: 'Invoice payment status updated successfully' })
    } catch (error) {
        console.error(`[ERROR] Failed to process webhook for Invoice ID ${reference}:`, error)
        return res.status(500).json({
            error: {
                code: 'WEBHOOK_PROCESSING_ERROR',
                message: 'An error occurred while processing the payment notification'
            }
        })
    }

}

const handlePaymentSuccessView = (req, res) => {
    return res.status(200).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #28a745;">✔ Payment Captured Successfully</h1>
            <p>Thank you for your payment. Your balance transaction context has cleared successfully.</p>
            <p style="color: #666; font-size: 14px;">You may safely close this browser window tab tracking framework now.</p>
        </div>
    `);
};

export default {initializeInvoicePayment,handleChapaWebhook,handlePaymentSuccessView}