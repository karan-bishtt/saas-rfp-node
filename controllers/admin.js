const { response } = require("express");
const db = require("../models/index");
const { getMessage } = require("../lang");
const {
  approveUserStatusValidator,
  approveAdminStatusValidator,
} = require("../validators/common");
const { ROLES, USERSTATUS, TENANT_STATUS } = require("../helpers/constant");
const { sendMails } = require("../helpers/mailer");
const Users = db.Users;
const Tenants = db.Tenants;

// This method is used to get the admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Users.findAll({
      attributes: ["id", "name", "email", "mobile", "status"],
      where: {
        roles: "admin",
      },
    });
    const result = admins.map((admin) => {
      return {
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        user_id: admin.id,
        status: admin.status,
      };
    });
    res.json({
      status: true,
      data: { admins: result },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(400).json({
      status: false,
      message: getMessage("admin.errorFetchingadmins"),
    });
  }
};

// This method is used to approve the admin
async function adminStatusChange(req, res) {
  try {
    const { error, value } = approveAdminStatusValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { user_id, status } = value;

    // Check if user is present in the database
    const user = await Users.findOne({
      where: { id: user_id, roles: ROLES.admin },
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: getMessage("common.userNotFound"),
      });
    } else if (user.status == status && status == USERSTATUS.approved) {
      return res.status(400).json({
        status: false,
        message: getMessage("admin.alreadyApproved"),
      });
    } else if (user.status == status && status == USERSTATUS.rejected) {
      return res.status(400).json({
        status: false,
        message: getMessage("admin.alreadyRejected"),
      });
    }
    is_registration_request = user.status == USERSTATUS.pending;
    // updating the user status
    user.status = status;
    await user.save();

    let name = user.name || user.email;
    // Sending mail
    if (status == USERSTATUS.approved) {
      // activating the tenant
      await Tenants.update(
        { status: TENANT_STATUS.active },
        { where: { id: user.tenant_id } }
      );
      if (is_registration_request) {
        sendMails(
          user.email,
          "Registration Request Approved",
          `Hi ${name}, \n Your registration request has been approved. please click on the link ${process.env.LOGIN_URL} for login.`
        );
      } else {
        sendMails(
          user.email,
          "Account Status Change",
          `Hi ${name}, \n Your account has been activated. please click on the link ${process.env.LOGIN_URL} for login.`
        );
      }
    } else if (status == USERSTATUS.rejected) {
      // activating the tenant
      await Tenants.update(
        { status: TENANT_STATUS.closed },
        { where: { id: user.tenant_id } }
      );

      if (is_registration_request) {
        sendMails(
          user.email,
          "Registration Request Rejected",
          `Hi ${name}, \n Your registration request has been rejected.`
        );
      } else {
        sendMails(
          user.email,
          "Account Status Change",
          `Hi ${name}, \n Your account has been deactivated by the super admin.`
        );
      }
    }
    res.json({
      status: true,
      message: getMessage("admin.approveSuccess"),
      user_id: user.id,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(400).json({
      status: false,
      message: getMessage("admin.approveFailed"),
    });
  }
}

module.exports = { getAdmins, adminStatusChange };
