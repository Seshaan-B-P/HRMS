const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  recordPayment,
  deleteInvoice,
  generateInvoicePDF,
  getFinanceStats
} = require('../controllers/invoiceController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Stats overview (Admin)
router.get('/stats/overview', authorizeRoles('ADMIN'), getFinanceStats);

// Invoices CRUD & Access
router.route('/')
  .get(getInvoices)
  .post(authorizeRoles('ADMIN'), createInvoice);

router.route('/:id')
  .get(getInvoiceById)
  .delete(authorizeRoles('ADMIN'), deleteInvoice);

// Download PDF
router.get('/:id/pdf', generateInvoicePDF);

// Record payment (Offline bank transfer / UPI)
router.post('/:id/record-payment', recordPayment);

module.exports = router;
