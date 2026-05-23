import invoiceController from "../controllers/invoiceController.js";
import { generateInvoiceNumber } from "../utils/invoiceNumber.js";
import Invoice from "../models/Invoice.js";

const createInvoice = async ({
    subscriptionId, 
    businessId,
    amount,
    dueDate, 
    customerName,
    customerEmail, 
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
        customerName,
        customerEmail

     });
}
const getInvoices=async (businessId)=>{
 return await Invoice.find({businessId}).
 sort({dueDate:-1})
}

const updateInvoiceStatus= async (invoiceId,status)=>{
 const invoice=await Invoice.findById(invoiceId);
 if(!invoice){
     throw new Error("Invoice not found");
 }
    invoice.status=status;
    await invoice.save();
    return invoice;
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
export default {createInvoice, checkAndMarkOverdue,getInvoices,updateInvoiceStatus};