require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

console.log('PORT =', process.env.PORT);
console.log('MONGO_URI exists =', !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, '0.0.0.0', () => {
            console.log('Server running on port', process.env.PORT);
        });
    })
    .catch(err => console.error(err));
