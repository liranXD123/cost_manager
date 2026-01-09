const router = require('express').Router();
const Cost = require('../models/cost.model');
const User = require('../models/user.model');

// POST /api/add  (costs process only)
router.post('/add', async (req, res) => {
    try {
        const b = req.body || {};

        const description = b.description;
        const category = b.category;
        const userid = Number(b.userid);
        const sum = Number(b.sum);

        // validation
        if (
            typeof description !== 'string' ||
            description.trim().length === 0 ||
            typeof category !== 'string' ||
            isNaN(userid) ||
            isNaN(sum)
        ) {
            return res.status(400).json({ id: 200, message: 'Invalid cost body' });
        }

        // must be one of required categories
        const allowed = ['food', 'health', 'housing', 'sports', 'education'];
        if (!allowed.includes(category)) {
            return res.status(400).json({ id: 201, message: 'Invalid category' });
        }

        // Q&A #11: user must exist
        const u = await User.findOne({ id: userid });
        if (!u) {
            return res.status(400).json({ id: 202, message: 'User does not exist' });
        }

        // optional createdAt (spec: if not passed, server uses request time)
        let createdAt = new Date();
        if (b.createdAt !== undefined) {
            const d = new Date(b.createdAt);
            if (isNaN(d.getTime())) {
                return res.status(400).json({ id: 203, message: 'Invalid createdAt' });
            }
            createdAt = d;
        }

        // server doesn't allow adding costs in the past
        if (createdAt.getTime() < Date.now()) {
            return res.status(400).json({ id: 204, message: 'Costs in the past are not allowed' });
        }

        const cost = await Cost.create({
            description: description.trim(),
            category,
            userid,
            sum,
            createdAt
        });

        return res.json(cost);
    } catch (e) {
        return res.status(400).json({ id: 205, message: e.message });
    }
});

module.exports = router;
