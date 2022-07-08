const { Router } = require("express");
const { Message } = require("../models/postgres");
const { ValidationError } = require("sequelize");
const checkAuthentication = require("../middlewares/checkAuthentication");

const router = new Router();

function formatError(error) {
    return error.errors.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
    }, {});
}

router.get("/messages", checkAuthentication, async(req, res) => {
    try {
        const result = await Message.findAll({ where: req.query });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

router.post("/messages", async(req, res) => {
    try {
        const result = await Message.create(req.body);
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
});

router.delete("/messages/:id", async(req, res) => {
    console.log(req.message);
    if (req.message.id !== parseInt(req.params.id, 10)) {
        return res.sendStatus(403);
    }
    try {
        const nbline = await Message.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!nbline) {
            res.sendStatus(404);
        } else res.sendStatus(204);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

router.put("/messages/:id", checkAuthentication, async(req, res) => {
    try {
        const [, rows] = await Message.update(req.body, {
            where: { id: parseInt(req.params.id, 10) },
            returning: true,
            individualHooks: true,
        });
        if (!rows[0]) {
            res.sendStatus(404);
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(422).json(formatError(error));
        } else {
            res.sendStatus(500);
            console.error(error);
        }
    }
});

router.get("/messages/:id", checkAuthentication, async(req, res) => {
    try {
        const result = await Message.findByPk(req.params.id);
        if (!result) {
            res.sendStatus(404);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

module.exports = router;