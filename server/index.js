const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const logger = require("./lib/logger");
const Logs = require('./routes/logs');


app.use(express.json());

app.get('/', (_,__, next) => {
    console.log('Test first middlware');
    next();
}, (req, res, next) => {
    res.send('Hello World!');
}
);

// app.use(HttpCodes);
app.use(Logs);

app.listen(port, () => {
    Logger.log("Server is running on port ", port);
});
