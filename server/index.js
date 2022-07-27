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
const socketIo = require("socket.io");
const http = require("http");


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

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type, Authorization, X-Requested-With, X-Socket-ID",
    }
});

// we register a middleware which checks the username and allows the connection:
io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
        return next(new Error("invalid userId"));
    }
    // On enregistre l'utilisateur dans la socket avec son id postgresql
    socket.userId = userId;
    socket.join(userId)
    next();
});
io.on("connection", (socket) => {
    console.log("connection", socket.id);

    // we send all existing users to the client:
    const users = [];
    // We are looping over the io.of("/").sockets object, which is a Map of all currently connected Socket instances, indexed by ID.
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            SocketId: id,
            userId: socket.userId,
        });
    }
    socket.emit("users", users);

    //   We also register a catch-all listener, which is very useful during development:
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    // notify existing users / will emit to all connected clients, except the socket itself.
    socket.broadcast.emit("user connected", {
        socketId: socket.id,
        userId: socket.userId,
    });

    // On envoie un message au destinataire de la conversation qui s'est connecté au serveur
    socket.on("private_message", ({ content, to, conversationMAJ, author, allMessages, data }) => {
        io.to(to).emit("private_message", {
            content,
            from: socket.id,
            conversationMAJ, // conversationMAJ is the updated conversation
            to: to,
            author: author,
            allMessages: allMessages,
            data: data
        });
    });

    socket.on("update_message", ({ content, to, conversationAMAJ, newConversation, conversations, author }) => {
        io.to(to).emit("update_message", {
            content,
            from: socket.id,
            conversationAMAJ, // conversationMAJ is the updated conversation
            to: to,
            newConversation: newConversation,
            conversations: conversations,
            author: author
        });
    });

    socket.on("disconnect", (reason) => {
        console.log('User 1 disconnected because ' + reason);
    });
});


server.listen(port, () => console.log(`Server is running on ${port}`));