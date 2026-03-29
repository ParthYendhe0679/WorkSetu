const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const DailyWorkLog = require('./models/DailyWorkLog');
const Transaction = require('./models/Transaction');

async function testBackendLogic() {
    try {
        await mongoose.connect('mongodb+srv://sharmapushpa138:Qf1vIofee8d53Q3Q@cluster0.puk87.mongodb.net/worksetu?retryWrites=true&w=majority');
        
        const projectId = '69c862bf12739189a7c416b4'; 
        // We need to know whoever created it, but let's assume bat man -> search db
        const project = await Project.findById(projectId);
        console.log("Project:", project);

        if (!project) return console.log("No project");

        const presentWorkerIds = project.assignedWorkers.map(w => w.toString());
        console.log("Worker IDs:", presentWorkerIds);

        const contractorUser = await User.findById(project.createdBy);
        console.log("Contractor Wallet:", contractorUser.wallet);
        
        let dailyWage = project.wagePerDay || 0;
        let totalPayout = dailyWage * presentWorkerIds.length;
        console.log("Daily Wage:", dailyWage, "Total Payout:", totalPayout);

        if(!contractorUser.wallet) contractorUser.wallet = {balance:0, pending:0};
        
        if (contractorUser.wallet.balance < totalPayout) {
            console.log("INSUFFICIENT FUNDS. NEED:", totalPayout, "HAVE:", contractorUser.wallet.balance);
            return;
        }
        
    } catch(e) {
        console.error("Test crash:", e);
    } finally {
        mongoose.disconnect();
    }
}
testBackendLogic();
