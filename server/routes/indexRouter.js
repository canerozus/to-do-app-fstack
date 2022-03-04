const express = require("express");
const router = express.Router();
const authRouter = require('./authRoute');
const todoRouter = require('./todoRoute');

router.use('/todos', todoRouter);
router.use('/auth',authRouter);

module.exports = router;