const Cost = require('../models/cost.model');
const Report = require('../models/report.model');
const User = require('../models/user.model');
const CATEGORIES = ['food', 'education', 'health', 'housing', 'sports'];

function isPastMonth(year, month) {
    // month is 1..12
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return true;
    if (year > currentYear) return false;
    return month < currentMonth;
}

function buildReport(userid, year, month, costs) {
    const groups = {};
    for (const c of CATEGORIES) groups[c] = [];

    for (const item of costs) {
        const d = new Date(item.createdAt);
        const day = d.getDate();

        groups[item.category].push({
            sum: Number(item.sum),
            description: item.description,
            day
        });
    }

    // format required by spec (array of objects, one per category)
    const costsArr = CATEGORIES.map(cat => ({ [cat]: groups[cat] }));

    return {
        userid,
        year,
        month,
        costs: costsArr
    };
}

async function getMonthlyReport(userid, year, month) {
    // Computed pattern: if requested month is in the past, cache the result
    const past = isPastMonth(year, month);
    const u = await User.findOne({ id: userid });
    if (!u) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    if (past) {
        const cached = await Report.findOne({ userid, year, month });
        if (cached) return cached;
    }

    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 1, 0, 0, 0);

    const costs = await Cost.find({
        userid,
        createdAt: { $gte: start, $lt: end }
    });

    const reportObject = buildReport(userid, year, month, costs);

    if (past) {
        const saved = await Report.create(reportObject);
        return saved;
    }

    return reportObject;
}

module.exports = { getMonthlyReport };
