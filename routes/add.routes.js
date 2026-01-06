const router = require('express').Router();
const User = require('../models/user.model');
const Cost = require('../models/cost.model');

router.post('/add', async (req, res) => {
    try {
        console.log('✅ add.routes.js /api/add HIT', req.body);
        const b = req.body || {};

        const isUser =
            b.id !== undefined &&
            b.first_name !== undefined &&
            b.last_name !== undefined &&
            b.birthday !== undefined;

        const isCost =
            b.description !== undefined &&
            b.category !== undefined &&
            b.userid !== undefined &&
            b.sum !== undefined;

        if (isUser && isCost) {
            return res.status(400).json({ id: 10, message: 'Ambiguous body: looks like both user and cost' });
        }

        if (isUser) {
            const user = await User.create(b);
            return res.json(user);
        }

        if (isCost) {
            const cost = await Cost.create(b);
            return res.json(cost);
        }

        return res.status(400).json({
            id: 11,
            message: 'Invalid body. For user send: id, first_name, last_name, birthday. For cost send: description, category, userid, sum.'
        });
    } catch (e) {
        return res.status(400).json({ id: 12, message: e.message });
    }
});

module.exports = router;
