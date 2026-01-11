const router = require('express').Router();

router.get('/about', (req, res) => {
    res.json([
        { first_name: 'Liran', last_name: 'Cordova' },
        { first_name: 'Daniel', last_name: 'Lev' }
    ]);
}); //getting the names of the project developers

module.exports = router;
