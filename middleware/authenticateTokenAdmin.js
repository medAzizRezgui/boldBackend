const jwt = require("jsonwebtoken");

module.exports = function authenticateTokenAdmin(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    req.user = jwt.verify(token, process.env.ACCES_TOKEN);
    const decoded = jwt.decode(token, process.env.ACCES_TOKEN);
    if (decoded.isAdmin === false) {
      return res.status(401).send("Unauthorized");
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
