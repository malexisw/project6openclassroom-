const jwt = require("jsonwebtoken");
const { tokenConfig } = require("../config");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, tokenConfig);
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    // See if the userId of the webPage and the userId of the request is the same
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
