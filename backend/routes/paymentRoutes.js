const express = require('express');
const { 
    securePayment, 
    releasePayment 
} = require('../controllers/paymentController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/secure', protect, authorize('client', 'contractor'), securePayment);
router.post('/release', protect, authorize('client', 'contractor'), releasePayment);

module.exports = router;
