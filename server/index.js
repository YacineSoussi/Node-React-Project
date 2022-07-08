const express = require("express");
const port = process.env.PORT || 3000;
const UserRouter = require("./routes/users");
const Logger = require("./lib/logger");
const Logs = require('./routes/logs');
const Messages = require('./routes/messages');
const SecurityRouter = require("./routes/security");
const app = express();

app.use(express.json());

app.get("/", (_, res, __) => {
    res.send("Hello World!");
});

app.use(Messages)
app.use(SecurityRouter);
app.use(UserRouter);
app.use(Logs);

app.listen(port, () => {
    Logger.info("Server is running on port " + port);
});
