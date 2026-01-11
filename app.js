const express = require('express');
const app = express();
const loggerMiddleware = require('./services/logger.service');

app.use(express.json());
app.use(loggerMiddleware);


app.use('/api', require('./routes/users.routes'));
app.use('/api', require('./routes/costs.routes'));
app.use('/api', require('./routes/reports.routes'));
app.use('/api', require('./routes/logs.routes'));
app.use('/api', require('./routes/admin.routes'));


console.log("server running on http://localhost:3000/api/about");
module.exports = app;
