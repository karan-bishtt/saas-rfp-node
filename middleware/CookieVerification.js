const jwt = require("jsonwebtoken");
const { USERSTATUS } = require("../helpers/constant");

/**
 * This method is used when user to check user role
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 */
const authenticateCookieToken = (req, res, next) => {
  try {
    const token =
      req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.redirect(`/`);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (
      !decoded ||
      req.user.status === USERSTATUS.pending ||
      req.user.status === USERSTATUS.rejected
    ) {
      return res.redirect(`/`);
    }
    next();
  } catch (err) {
    return res.redirect(`/`);
  }
};

/**
 * This method is used when user is logged in but try to access not login routes
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 */
const nonAuthenticateRoutes = (req, res, next) => {
  try {
    const token =
      req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      const route = req.originalUrl.split("/")[1];
      if (route == "api") {
        return next();
      } else if (
        decoded ||
        req.user.status != USERSTATUS.pending ||
        req.user.status != USERSTATUS.rejected
      ) {
        return res.redirect(`/${req.user.roles}`);
      }
    }
    next();
  } catch (err) {
    next();
  }
};

/**
 * This method is used to set cookie token
 * @param {object} res
 * @param {string} token
 */
const setCookieToken = (res, token) => {
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
};

/**
 * This method is used to clear cookie token
 * @param {object} res
 */
const clearCookieToken = (res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
};

module.exports = {
  authenticateCookieToken,
  nonAuthenticateRoutes,
  setCookieToken,
  clearCookieToken,
};
