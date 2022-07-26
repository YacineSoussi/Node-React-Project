const express = require("express");
const port = process.env.PORT || 3000;
const UserRouter = require("./routes/users");
const Logger = require("./lib/logger");
const Logs = require('./routes/logs');
const Messages = require('./routes/messages');
const Conversations = require('./routes/conversations');
const Participants = require('./routes/participants');
const SecurityRouter = require("./routes/security");
const app = express();
const cors = require("cors");
const compression =  require("compression");
const FriendshipRouter = require('./routes/friendship');


app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.get("/", (_, res, __) => {
    res.json({ data: "je suis la" });
});

app.use(Messages)
app.use(SecurityRouter);
app.use(UserRouter);
app.use(Logs);
app.use(Conversations);
app.use(Participants);
app.use('/friendship', FriendshipRouter);

app.listen(port, () => {
    Logger.info("Server is running on port " + port);
});