const express = require('express');
const { 
    getWallet, 
    addFunds, 
    withdrawFunds,
    getTransactions 
} = require('../controllers/walletController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWallet);
router.post('/add', protect, addFunds);
router.post('/withdraw', protect, withdrawFunds);
router.get('/transactions', protect, getTransactions);

module.exports = router;
