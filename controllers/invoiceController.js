import { create, find, findById } from '../models/Invoice';

// Create a new invoice
const createInvoice = async (req, res) => {
    try {
    const { clientName, clientEmail, amount, dueDate,businessId } = req.body;
    if (!clientName || !clientEmail || !amount || !dueDate ) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    let selectedBusinessid;
    if (businessId) {
        if (!req.user.businesses.includes(businessId)) {
            return res.status(403).json({ error: 'Unauthorized to create invoice for this business' });
        }
        selectedBusinessid = businessId;
    } else {
        selectedBusinessid = req.user.businesses[0]; // Default to first business if not provided
    }
    const invoiceNumber = `INV-${Date.now()}`;  
    const invoice=await create({
        clientName,
        clientEmail,    
        amount,
        dueDate,
        businessId: selectedBusinessid, 
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
        const { businessId } = req.query;   
        if (!businessId) {
            return res.status(400).json({ error: 'Business ID is required' });
        }
        if (!req.user.businesses.includes(businessId)) {
            return res.status(403).json({ error: 'Unauthorized to view invoices for this business' });
        }
        const invoices = await find({ businessId })
        .sort({ dueDate: -1 });;
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
        const invoice=await findById(id);
       
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        if (!req.user.businesses.includes(invoice.businessId.toString())) {
            return res.status(403).json({ error: 'Unauthorized to update this invoice' });
        }
        invoice.status=status;
        await invoice.save();
        res.json({ message: 'Invoice status updated successfully', invoice });  
 



    }  catch (error) {
        console.error('Error updating invoice status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    

}
export default { createInvoice, getInvoices ,updateInvoiceStatus};

