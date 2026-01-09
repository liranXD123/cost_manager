const router = require('express').Router();
const { getMonthlyReport } = require('../services/report.service');

router.get('/report', async (req, res) => {
    const userid = Number(req.query.id);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (
        isNaN(userid) ||
        isNaN(year) ||
        isNaN(month) ||
        month < 1 ||
        month > 12
    ) {
        return res.status(400).json({
            id: 3,
            message: 'Invalid or missing id, year, or month'
        });
    }

    try {
        const report = await getMonthlyReport(userid, year, month);
        res.json(report);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            id: 4,
            message: err.message
        });
    }
});

module.exports = router;
