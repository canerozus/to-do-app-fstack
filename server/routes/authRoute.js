const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

//jwt tokens
const tokenSecret = process.env.TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_SECRET;
let refreshTokens = [];
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
    const accestoken = jwt.sign({ username: User.username, password: validPassword }, tokenSecret, { expiresIn: '30s' });
    const refreshtoken = jwt.sign({ username: User.username, password: validPassword }, refreshTokenSecret)
    refreshTokens.push(refreshtoken);

    res.status(200).json({ accestoken, refreshtoken })

  } catch (error) {
    res.status(500).send(err)
  }
});


router.post('/refresh', (req, res) => {

  const createtoken = req.body?.token 

  if (!createtoken) {
    return res.status(401).send('unauthorization')
  }

  if (!refreshTokens.includes(createtoken)) {
    console.log(refreshTokens)
    return res.status(403).send('forbidden')
  }

  jwt.verify(createtoken, refreshTokenSecret, (err) => {
    if (err) return res.status(403).send(err)

    refreshTokens = refreshTokens.filter((token) => token !== createtoken)
    const accestoken = jwt.sign({ username: User.username, password: User.password }, tokenSecret, { expiresIn: "30s" });
    const refreshtoken = jwt.sign({ username: User.username, password: User.password }, refreshTokenSecret)

    refreshTokens.push(refreshtoken)

    res.status(200).json({
      accestoken,
      refreshtoken
    })

  })

})



module.exports = router;
