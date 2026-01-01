const Cost = require('../models/cost.model');
const Report = require('../models/report.model');

/*
-------------------------------------------------
Computed Design Pattern:
If a monthly report already exists, return it.
Otherwise, compute it once, save it, and reuse it.
-------------------------------------------------
*/
async function getMonthlyReport(userid, year, month) {
    const existing = await Report.findOne({ userid, year, month });
    if (existing) return existing;

    const costs = await Cost.find({ userid });
    const categories = ['food', 'education', 'health', 'housing', 'sports'];

    const grouped = categories.map(cat => ({
        [cat]: costs
            .filter(c =>
                c.category === cat &&
                c.createdAt.getFullYear() === year &&
                c.createdAt.getMonth() + 1 === month
            )
            .map(c => ({
                sum: c.sum,
                description: c.description,
                day: c.createdAt.getDate()
            }))
    }));

    const report = await Report.create({ userid, year, month, costs: grouped });
    return report;
}

module.exports = { getMonthlyReport };
