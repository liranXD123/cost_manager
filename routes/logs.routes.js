const router = require('express').Router();
const Log = require('../models/log.model');

router.get('/logs', async (req, res) => {
    res.json(await Log.find());
});

module.exports = router;
