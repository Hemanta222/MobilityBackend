const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_KEY;
module.exports = {
  signAccessToken: (id) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { userId: id }, //payload
        ACCESS_TOKEN_SECRET,
        {
          // options
          expiresIn: "3h",
          issuer: "localhost",
          audience: id.toString(),
        },
        function (err, token) {
          if (!err) {
            return resolve(token);
          } else {
            return reject(false);
          }
        }
      );
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"])
      return next(new Error("varification failed"));
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" "); // Bearer Token
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(message);
      }
      req.userId = payload.userId;
      next();
    });
  },
};
