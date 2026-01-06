const Cost = require('../models/cost.model');

const CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

function monthRange(year, month) {
    // month is 1-12
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0)); // next month
    return { start, end };
}

async function getMonthlyReport(userid, year, month) {
    const { start, end } = monthRange(year, month);

    // pull only the relevant month's costs
    const costs = await Cost.find({
        userid,
        createdAt: { $gte: start, $lt: end }
    }).lean();

    const grouped = CATEGORIES.map(cat => ({
        [cat]: costs
            .filter(c => (c.category || '').toLowerCase() === cat)
            .map(c => {
                const d = new Date(c.createdAt);
                return {
                    sum: c.sum,
                    description: c.description,
                    day: d.getUTCDate()
                };
            })
    }));

    return { userid, year, month, costs: grouped };
}

module.exports = { getMonthlyReport };
