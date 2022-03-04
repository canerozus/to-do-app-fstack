const express = require("express");
const router = express.Router();
const Todo = require("../models/todos");
const authenticateJWT = require('../middleware/auth')

router.post("/", async (req, res) => {
  try {
    const todo = await new Todo({
      title: req.body.title,
      desc: req.body.desc
    });
    await todo.save();
    res.status(200).json(todo)
  } catch (error) {
      res.status(500).send(error)
  }
});


router.get('/',authenticateJWT, async(req,res)=>{
    try {
        const todos = await Todo.find()
        res.status(200).json(todos)
    } catch (error) {
        res.status(404).send(error)
    }
});

router.get('/:id', async(req,res)=>{
    try {
        const todo = await Todo.findById(req.params.id)
        res.status(200).json(todo)
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = router;
