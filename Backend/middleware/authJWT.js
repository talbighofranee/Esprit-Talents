const jwt = require("jsonwebtoken");
const config = require("../Config/auth.config");
const db = require("../Models/user");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
  });
};



const authJwt = {
  verifyToken,
  isAdmin,
  
};
module.exports = authJwt;
