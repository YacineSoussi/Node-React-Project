const { Router } = require("express");
const { User, Participant } = require("../models/postgres");
const { ValidationError, Op } = require("sequelize");
const checkAuthentication = require("../middlewares/checkAuthentication");

const router = new Router();

function formatError(error) {
    return error.errors.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
    }, {});
}
router.get("/users-list", checkAuthentication, async(req, res) => {
    try {
        const result = await User.findAll({ where: req.query });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});
router.get("/users", checkAuthentication, async(req, res) => {
    try {
        const result = await User.findAll({
            include: {
                model: Participant,
                as: "participants",
                attributes: ["conversationId"],
            }
        });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

router.get("/users-signaled", checkAuthentication, async(req, res) => {
    try {
       
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

router.post("/users", async(req, res) => {
    try {
        const result = await User.create(req.body);
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

router.delete("/users/:id", checkAuthentication, async(req, res) => {
    if (req.user.id !== parseInt(req.params.id, 10)) {
        return res.sendStatus(403);
    }
    try {
        const nbline = await User.destroy({
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

router.put("/users/:id", checkAuthentication, async(req, res) => {
    const emailFromBody = req.body.email;
    const userExists = await User.findOne({
        where: {
            email: {
                [Op.eq]: emailFromBody,

            },
            id: {
                [Op.ne]: req.params.id,
            }
        },
    });
    if (userExists && emailFromBody !== userExists.email) {
        res.sendStatus(401);
    } else {
        try {
            const [, rows] = await User.update(req.body, {
                where: { id: parseInt(req.params.id, 10) },
                returning: true,
                individualHooks: true,
            });
            if (!rows[0]) {
                res.sendStatus(404);
            } else {
                res.json(rows[0]);
                res.status = 200;
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(422).json(formatError(error));
            } else {
                res.sendStatus(500);
                console.error(error);
            }
        }
    }


});

router.get("/users/:id", checkAuthentication, async(req, res) => {
    try {
        const result = await User.findByPk(req.params.id);
        if (!result) {
            res.sendStatus(404);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

router.put("/resetPassword/:id", checkAuthentication, async(req, res) => {
    const userId = req.params.id;
    const userPasswordFromBody = req.body.password;

    try {
        const [, rows] = await User.update({
                password: userPasswordFromBody
            },
            {
                where: { id: userId },
                returning: true,
                individualHooks: true,
            }
        );

        if (!rows[0]) {
            res.sendStatus(404);
        } else {
            res.json(rows[0]);
        }
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



module.exports = router;