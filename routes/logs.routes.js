const router = require('express').Router();
const Log = require('../models/log.model');

router.get('/logs', async (req, res) => {
    try {
        return res.json(await Log.find());
    } catch (e) {
        return res.status(500).json({ id: 400, message: e.message });
    }
}); //getting logs of each action

module.exports = router;
