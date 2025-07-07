const jwt = require("jsonwebtoken");
const constants = require("./constant");

function authmiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      req.isAuth = false;
      return next();
    }
    const payload = jwt.verify(token,constants.SECRET);
    req.userId = payload.userId;

    req.isAuth = true;
    next();
  } catch (error) {
    req.isAuth = false;
    next();
  }
}

module.exports = {
  Auth: authmiddleware,
};
