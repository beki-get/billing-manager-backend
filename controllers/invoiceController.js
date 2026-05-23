import Invoice from '../models/Invoice.js';
import invoiceService from '../services/invoiceService.js';

// Create a new invoice
const createInvoice = async (req, res) => {
    try {
    const { customerName, customerEmail, amount, dueDate,businessId } = req.body;
    if (!customerName || !customerEmail || !amount || !dueDate ) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    let selectedBusinessid = businessId;
        if (businessId) {
            if (!req.user.businesses.includes(businessId)) {
                return res.status(403).json({ error: 'Unauthorized to create invoice for this business' });
            }
        } else {
            selectedBusinessid = req.user.businesses[0]; 
        }
    const invoiceNumber = `INV-${Date.now()}`;  
    const invoice=await invoiceService.createInvoice({
        subscriptionId: null,
        businessId: selectedBusinessid,
        customerName,
        customerEmail,    
        amount,
        dueDate,
       invoiceNumber
    });
    res.status(201).json({message: 'Invoice created successfully', invoice});

}catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
}   
}

// Get all invoices for a business  
const getInvoices = async (req, res) => {
    try {
        const { businessId } = req.params;
        if (!businessId) {
            return res.status(400).json({ error: 'Business ID is required' });
        }
        if (!req.user.businesses.includes(businessId)) {
            return res.status(403).json({ error: 'Unauthorized to view invoices for this business' });
        }
        const invoices = await invoiceService.getInvoices(businessId)
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Update invoice status
const updateInvoiceStatus = async (req, res) => {
    try {
        const {id}= req.params;
        const { status } = req.body;
        let allowedStatuses = [ 'paid', 'overdue'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const invoice=await invoiceService.updateInvoiceStatus(id,status);
        if (!req.user.businesses.includes(invoice.businessId.toString())) {
            return res.status(403).json({ error: 'Unauthorized to update this invoice' });
        }
      
        res.json({ message: 'Invoice status updated successfully', invoice });  
 
}  catch (error) {
        console.error('Error updating invoice status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    

}
export default { createInvoice, getInvoices ,updateInvoiceStatus};

