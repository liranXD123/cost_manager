const router = require('express').Router();
const User = require('../models/user.model');
const Cost = require('../models/cost.model');

// POST /api/add (users process only)
router.post('/add', async (req, res) => {
    try {
        const b = req.body || {};

        const id = Number(b.id);
        const first_name = b.first_name;
        const last_name = b.last_name;
        const birthday = b.birthday;

        if (
            isNaN(id) ||
            typeof first_name !== 'string' ||
            typeof last_name !== 'string' ||
            !birthday
        ) {
            return res.status(400).json({ id: 300, message: 'Invalid user body' });
        }

        const user = await User.create({
            id,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            birthday: new Date(birthday)
        });

        return res.json(user);
    } catch (e) {
        return res.status(400).json({ id: 301, message: e.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        return res.json(await User.find());
    } catch (e) {
        return res.status(500).json({ id: 302, message: e.message });
    }
}); //getting users names

router.get('/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ id: 303, message: 'Invalid user id' });
        }

        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ id: 304, message: 'User not found' });
        }

        const costs = await Cost.find({ userid: id });
        const total = costs.reduce((s, c) => s + Number(c.sum), 0);

        return res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total
        });
    } catch (e) {
        return res.status(500).json({ id: 305, message: e.message });
    }
}); //getting user ID

module.exports = router;
