const { verifyToken } = require("../services/authentication");

function checkforAuthentication(cookieName) {
  return (req, res, next) => {
    const tokenCookie = req.cookies[cookieName];

    if (!tokenCookie || typeof tokenCookie !== "string") {
      return next();
    }

    try {
      const userPayload = verifyToken(tokenCookie);
      req.user = userPayload;
    } catch (err) {
      console.log("Token verification failed:", err.message);
    }

    next();
  };
}

module.exports = checkforAuthentication;