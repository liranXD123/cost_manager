const router = require('express').Router();
const Cost = require('../models/cost.model');

/*router.post('/add', async (req, res) => {
    try {
        const cost = await Cost.create(req.body);
        res.json(cost);
    } catch (e) {
        res.status(400).json({ id: 2, message: e.message });
    }
});*/

module.exports = router;
