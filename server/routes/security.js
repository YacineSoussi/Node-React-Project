const { Router } = require("express");
const express = require("express");
const { User } = require("../models/postgres");
const { ValidationError } = require("sequelize");
const { createToken } = require("../lib/tokenManager.js");
const bcryptjs = require("bcryptjs");

const router = new Router();

function formatError(error) {
    return error.errors.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
    }, {});
}

router.post("/register", async(req, res) => {
    try {
        req.body["role"] = "user";
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

router.post("/login", async(req, res) => {
    try {
        const result = await User.findOne({ where: { email: req.body.email } });
        console.log(result)
        if (
            result &&
            (await bcryptjs.compare(req.body.password, result.password))
        ) {
            res.json({
                token: await createToken(result),
                userData: await User.findAll({ where: { email: req.body.email } })
            });

        } else {
            res.sendStatus(401);
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