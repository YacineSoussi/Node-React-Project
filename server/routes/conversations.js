const Conversation = require("../models/postgres/entities/Conversation");
const checkAuthentication = require("../middlewares/checkAuthentication");
const { Message } = require("../models/postgres");
const Participant = require("../models/postgres/entities/Participant");
const { ValidationError } = require("sequelize");
const { Router } = require("express");

const router = new Router();

router.get("/conversations", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.findAll(
            {
                include: [
                    { model: Message, as: "messages", attributes: ["id", "content", "createdAt", "authorId"] },
                    { model: Participant, as: "participants" }
                ]
            }
        );
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.post("/conversations", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof ValidationError) {
            console.error(error);
            res.status(422).json(formatError(error));
        } else {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
);

router.put("/conversations/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.update(req.body, { where: { id: req.params.id } });
        res.json(result);
    } catch (error) {
        if (error instanceof ValidationError) {
            console.error(error);
            res.status(422).json(formatError(error));
        } else {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
);

router.get("/conversations/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.findByPk(req.params.id, {
            include: [
                { model: Message, as: "messages", attributes: ["id", "content", "createdAt", "authorId"] },
                { model: Participant, as: "participants" }
            ]
        });
        if (!result) {
            res.sendStatus(404);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.delete("/conversations/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.destroy({ where: { id: req.params.id } });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

module.exports = router;