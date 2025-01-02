const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const db = require("../models/index");
const { getMessage } = require("../lang");
const { USERSTATUS, ROLES } = require("./constant");
const Users = db.Users;

// This method is used to generate the token
const generateToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.role,
      tenant_id: user.tenant_id,
      status: user.status,
    };
    const option = {
      expiresIn: process.env.TOKEN_EXPIRY,
      issuer: process.env.ISSUER,
    };
    const secret = process.env.JWT_SECRET;
    // Sign the token using JWT.sign()
    jwt.sign(payload, secret, option, (err, token) => {
      if (err) {
        console.log(err);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const verifyToken = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res
      .status(401)
      .json({ status: false, message: getMessage("auth.noToken") });
  }

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  try {
    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database
    const user = await Users.findOne({ where: { id: payload.id } });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: getMessage("auth.userNotFound"),
      });
    } else if (user.status === USERSTATUS.pending) {
      return res.status(401).json({
        status: false,
        message: getMessage("auth.pendingRequest"),
      });
    } else if (user.status === USERSTATUS.rejected) {
      let isAdmin = user.roles === ROLES.admin;
      return res.status(401).json({
        status: false,
        message: isAdmin
          ? getMessage("auth.rejectedRequestAdmin")
          : getMessage("auth.rejectedRequest"),
      });
    }
    // Attach user information to the request for further use
    req.user = user;
    next();
  } catch (err) {
    const message =
      err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
    return res.status(401).json({ status: false, message: message });
  }
};

module.exports = { generateToken, verifyToken };
