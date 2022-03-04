const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (err) {
    res.status(500).send(err)
  }
});



const tokenSecret = process.env.TOKEN_SECRET; 
//LOGIN
router.post("/login", async (req, res) => {
  try {
    //matching user
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(404).json("user not found");
    //securing password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    !validPassword && res.status(400).json("wrong password");
    //generate acces token
    const accestoken = jwt.sign({ username: User.username, password: validPassword }, tokenSecret);

    res.status(200).json(accestoken)

  } catch (error) {
    res.status(500).send(err)
  }
});



module.exports = router;
