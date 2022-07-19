const Conversation = require("../models/postgres/entities/Conversation");
const checkAuthentication = require("../middlewares/checkAuthentication");
const { Message } = require("../models/postgres");
const Participant = require("../models/postgres/entities/Participant");
const { ValidationError } = require("sequelize");
const { Router } = require("express");

const router = new Router();

router.get("/participants", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.findAll({ where: req.query });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.post("/participants", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.create(req.body);
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

router.put("/participants/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.update(req.body, { where: { id: req.params.id } });
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

router.get("/participants/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.findOne({ where: { id: req.params.id } });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.delete("/participants/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.destroy({ where: { id: req.params.id } });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

module.exports = router;