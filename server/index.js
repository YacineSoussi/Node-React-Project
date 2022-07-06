const express = require("express");
const port = process.env.PORT || 3000;
const UserRouter = require("./routes/users");
const Logger = require("./lib/logger");
const Logs = require('./routes/logs');
const SecurityRouter = require("./routes/security");
const app = express();

app.use(express.json());

app.get("/", (_, res, __) => {
    res.send("Hello World!");
});

app.use(SecurityRouter);
app.use(UserRouter);
app.use(Logs);

app.listen(port, () => {
    Logger.log("Server is running on port " + port);
});