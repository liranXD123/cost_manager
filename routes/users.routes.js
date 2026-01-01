const router = require('express').Router();
const User = require('../models/user.model');
const Cost = require('../models/cost.model');

router.post('/add', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (e) {
        res.status(400).json({ id: 1, message: e.message });
    }
});

router.get('/users', async (req, res) => {
    res.json(await User.find());
});

router.get('/users/:id', async (req, res) => {
    const id = Number(req.params.id);
    const user = await User.findOne({ id });
    const costs = await Cost.find({ userid: id });
    const total = costs.reduce((s, c) => s + c.sum, 0);

    res.json({
        first_name: user.first_name,
        last_name: user.last_name,
        id: user.id,
        total
    });
});

module.exports = router;
