const db = require("../models/index");
const { getMessage } = require("../lang");
const { ROLES } = require("../helpers/constant");
const Users = db.Users;

const adminTenantVerification = async (req, res, next) => {
  const admin = req.user;
  const tenant_id =
    req.body.tenant_id || req.query.tenant_id || admin.tenant_id;
  if (admin.roles !== ROLES.admin) {
    return res.status(401).json({
      status: false,
      message: getMessage("auth.unauthorized"),
    });
  } else if (admin.tenant_id != tenant_id) {
    return res.status(401).json({
      status: false,
      message: getMessage("auth.unauthorized"),
    });
  }
  next();
};

const vendorTenantVerification = async (req, res, next) => {
  const vendor = req.user;
  const tenant_id =
    req.body.tenant_id || req.query.tenant_id || vendor.tenant_id;
  if (vendor.roles !== ROLES.vendor) {
    return res.status(401).json({
      status: false,
      message: getMessage("auth.unauthorized"),
    });
  } else if (vendor.tenant_id != tenant_id) {
    return res.status(401).json({
      status: false,
      message: getMessage("auth.unauthorized"),
    });
  }
  next();
};

const managerTenantVerification = async (req, res, next) => {
  const manager = req.user;
  const tenant_id =
    req.body.tenant_id || req.query.tenant_id || manager.tenant_id;
  if (manager.roles !== ROLES.manager) {
    return res.status(401).json({
      status: false,
      message: getMessage("auth.unauthorized"),
    });
  } else if (manager.tenant_id != tenant_id) {
    return res.status(401).json({
      status: false,
      message: getMessage("auth.unauthorized"),
    });
  }
  next();
};

const accountantTenantVerification = async (req, res, next) => {
  const accountant = req.user;
  const tenant_id =
    req.body.tenant_id || req.query.tenant_id || accountant.tenant_id;
  if (accountant.roles !== ROLES.accountant) {
    return res.status(401).json({
      status: false,
      message: getMessage("auth.unauthorized"),
    });
  } else if (accountant.tenant_id != tenant_id) {
    return res.status(401).json({
      status: false,
      message: getMessage("auth.unauthorized"),
    });
  }
  next();
};

const superAdminTenantVerification = async (req, res, next) => {
  const superAdmin = req.user;
  if (superAdmin.roles !== ROLES.super_admin) {
    return res.status(401).json({
      status: false,
      message: getMessage("auth.unauthorized"),
    });
  }
  next();
};

const roleRouteVerification = async (req, res, next) => {
  try {
    const user = req.user;
    const roleFromUrl = req.originalUrl.split("/")[1];

    if (user.roles !== roleFromUrl) {
      // Redirect user only if they are not already on their correct role path
      const redirectUrl = `/${user.roles}`;
      if (req.originalUrl.startsWith(redirectUrl)) {
        return res.redirect("/");
      }
      return res.redirect(redirectUrl);
    }
    next();
  } catch (error) {
    return res.redirect("/");
  }
};

module.exports = {
  adminTenantVerification,
  vendorTenantVerification,
  managerTenantVerification,
  accountantTenantVerification,
  superAdminTenantVerification,
  roleRouteVerification,
};
