const { Router } = require('express');
const router = Router();
const Log = require('../models/mongo/index').Log;
const { Error: { ValidationError } } = require("mongoose");
const logger = require("../lib/logger");


function formatError (error) {
    return Object.values(error).reduce(
        (acc, err) => {
            acc[err.path] = err.message;
            return acc;
        },
        {}
    );
};

router.get('/logs', async (req, res) => {
    try {
        const result = await Log.find(req.query);
        res.status(200).json(result);
    }
    catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.post('/logs', async (req, res) => {
    try {
        const result = await Log.create(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        if (error instanceof ValidationError) {
            res.status(422).json(formatError(Object.values(error.errors)));
            logger.error(Object.values(error.errors));
        }
        res.sendStatus(500);
        logger.error(formatError(formatError(Object.values(error.errors))));
        console.error(error);
    }
});

router.delete('/logs/:id', async (req, res) => {
    try {
        const result = await Log.deleteOne({ _id: req.params.id });
        if (!result) {
            res.status(404).json(result);
        }
        res.status(204).json(
            [
                {
                    code: 204,
                    message: 'No Content'
                }
            ]
        );
    }
    catch (error) {
        res.sendStatus(500);
        logger.error(formatError(formatError(Object.values(error.errors))));
        console.error(error);
    }
});

router.put('/logs/:id', async (req, res) => {
    try {
        const result = await Log.updateOne({ _id: req.params.id }, req.body, { new: true });
        if (!result) {
            res.status(404).json([
                {
                    code: 404,
                    message: 'Not Found'
                }
            ]);
        } else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        if (error instanceof ValidationError) {
            res.status(422).json(formatError(formatError(Object.values(error.errors))));
        }
        res.sendStatus(500);
        logger.error(formatError(formatError(Object.values(error.errors))));
        console.error(error);
    }
}
);

router.get('/logs/:id', async (req, res) => {
    try {
        const result = await Log.findOne({ _id: req.params.id });
        if (!result) {
            res.status(404).json([{
                code: 404,
                message: 'Not Found'
            }
            ]);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.sendStatus(500);
        console.error(formatError(formatError(Object.values(error.errors))));
        logger.error(formatError(formatError(Object.values(error.errors))));
    }
});

module.exports = router;