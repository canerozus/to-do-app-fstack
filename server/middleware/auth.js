const jwt = require('jsonwebtoken');
const express = require('express');
const User = require("../models/user");

;
const tokenSecret = process.env.TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_SECRET;

function authenticateJWT(req, res, next) {

     const authHeader = req.headers.authorization;

     if (authHeader) {
          const token = authHeader.split(" ")[1];

          jwt.verify(token, tokenSecret, (err, user) => {
               if (err) {
                    res.status(403).send('forbidden')
               }
               req.user = user
               next()
          })

     } else {
          res.status(401).send('unauthorized')
     }
}
module.exports = authenticateJWT






