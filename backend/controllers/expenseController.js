const Expense = require('../models/Expense');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get user expenses
// @route   GET /api/expenses
// @access  Private (Worker Only)
exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ workerId: req.user.id }).sort('-date');
        
        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add new expense
// @route   POST /api/expenses/add
// @access  Private (Worker Only)
exports.addExpense = async (req, res, next) => {
    try {
        const { title, amount, date } = req.body;
        
        if (!title || !amount) {
            return res.status(400).json({ success: false, message: 'Please provide title and amount' });
        }

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.wallet || user.wallet.balance < Number(amount)) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance to cover this expense' });
        }

        // Deduct from wallet
        user.wallet.balance -= Number(amount);
        user.markModified('wallet');
        await user.save();

        // Log the expense
        const expense = await Expense.create({
            workerId: req.user.id,
            title,
            amount: Number(amount),
            date: date || Date.now()
        });

        // Log the transaction history so it shows in Wallet Page
        await Transaction.create({
            userId: req.user.id,
            amount: -Number(amount),
            type: 'debit',
            status: 'completed',
            description: `Expense: ${title}`
        });

        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (Worker Only)
exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Verify worker
        if (expense.workerId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const user = await User.findById(req.user.id);
        
        // Refund wallet
        if (user && user.wallet) {
            user.wallet.balance += Number(expense.amount);
            user.markModified('wallet');
            await user.save();

            // Log refund transaction
            await Transaction.create({
                userId: req.user.id,
                amount: Number(expense.amount),
                type: 'credit',
                status: 'completed',
                description: `Refund for deleted expense: ${expense.title}`
            });
        }

        await expense.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Expense removed and refunded to wallet'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
