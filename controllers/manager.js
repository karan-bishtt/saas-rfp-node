const { response } = require("express");
const db = require("../models/index");
const { getMessage } = require("../lang");
const { approveUserStatusValidator } = require("../validators/common");
const { sendMails } = require("../helpers/mailer");
const { ROLES, USERSTATUS } = require("../helpers/constant");
const Users = db.Users;

// This method is used to get the managers
const getManagers = async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const managers = await Users.findAll({
      attributes: ["id", "name", "email", "mobile", 'status'],
      where: {
        roles: "manager",
        tenant_id: tenant_id,
      },
    });
    const result = managers.map((manager) => {
      return {
        name: manager.name,
        email: manager.email,
        mobile: manager.mobile,
        user_id: manager.id,
        status: manager.status,
      };
    });
    res.json({
      status: true,
      data: { managers: result },
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: getMessage("manager.errorFetchingmanagers"),
    });
  }
};

// This method is used to approve the manager
const approveManager = async (req, res) => {
  try {
    const { error, value } = approveUserStatusValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { user_id, status, tenant_id } = value;

    // Check if user is present in the database
    const user = await Users.findOne({
      where: { id: user_id, tenant_id: tenant_id, roles: ROLES.manager },
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: getMessage("common.userNotFound"),
      });
    } else if (user.status == USERSTATUS.approved) {
      return res.status(400).json({
        status: false,
        message: getMessage("manager.alreadyApproved"),
      });
    }
    // updating the user status
    user.status = status;
    await user.save();
    let name = user.name || user.email;
    // Sending mail
    if (status === USERSTATUS.approved) {
      sendMails(
        user.email,
        "Registration Request Approved",
        `Hi ${name}, \n Your registration request has been approved. please click on the link ${process.env.LOGIN_URL} for login.`
      );
    }

    res.json({
      status: true,
      message: getMessage("manager.approveSuccess"),
      user_id: user.id,
    });
  } catch {
    res.status(400).json({
      status: false,
      message: getMessage("manager.approveFailed"),
    });
  }
};

module.exports = { getManagers, approveManager };
