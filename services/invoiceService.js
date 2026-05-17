import invoiceController from "../controllers/invoiceController.js";
import { generateInvoiceNumber } from "../utils/invoiceNumber.js";
import Invoice from "../models/Invoice.js";

const createInvoice = async ({
    subscriptionId, 
    businessId, 
    amount, 
    dueDate, 
    clientName, 
    clientEmail, 
    customInvoiceNumber = null

   })=>{
     let invoiceNumber=customInvoiceNumber 
     if(!invoiceNumber){
        const invoiceCount = await Invoice.countDocuments({ businessId });
        invoiceNumber = generateInvoiceNumber(businessId, invoiceCount + 1);
     }

     return await Invoice.create({
        subscriptionId,
        businessId,
        invoiceNumber,
        amount,
        currency: 'USD',
        dueDate,
        clientName,
        clientEmail

     });
}
const checkAndMarkOverdue = async () => {
    const today = new Date();
    const overdueInvoices = await Invoice.find({
        status: 'pending',
        dueDate: { $lt: today }
    });

    for (let invoice of overdueInvoices) {
        invoice.status = 'overdue';
        await invoice.save();
    }

    return overdueInvoices;
};
export default {createInvoice, checkAndMarkOverdue};