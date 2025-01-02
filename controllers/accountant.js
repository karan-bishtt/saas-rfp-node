const { response } = require("express");
const db = require("../models/index");
const { getMessage } = require("../lang");
const { approveUserStatusValidator } = require("../validators/common");
const { sendMails } = require("../helpers/mailer");
const { ROLES, USERSTATUS } = require("../helpers/constant");
const Users = db.Users;
const AccountantDetails = db.Accountant;

const getAccountant = async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const accountants = await Users.findAll({
      attributes: ["id", "name", "email", "mobile"],
      include: [
        {
          model: AccountantDetails,
          as: "accountants",
          attributes: ["licence_number"],
        },
      ],
      where: {
        roles: "accountant",
        tenant_id: tenant_id,
      },
    });
    const result = accountants.map((accountant) => {
      return {
        name: accountant.name,
        email: accountant.email,
        mobile: accountant.mobile,
        licence_number: accountant.accountants[0].licence_number,
        user_id: accountant.id, // This seems redundant as 'id' is already listed, assuming you might want something else here
        status: accountant.status,
      };
    });
    res.json({
      status: true,
      data: { accountants: result },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(400).json({
      status: false,
      message: getMessage("accountant.errorFetchingaccountants"),
    });
  }
};

// This method is used to approve the accountant
const approveAccountant = async (req, res) => {
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
      where: {
        id: user_id,
        tenant_id: tenant_id,
        roles: ROLES.accountant,
      },
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: getMessage("common.userNotFound"),
      });
    } else if (user.status == USERSTATUS.approved) {
      return res.status(400).json({
        status: false,
        message: getMessage("accountant.alreadyApproved"),
      });
    }
    // updating the user status
    user.status = status;
    await user.save();
    let name = user.name || user.email;
    // Sending mail
    if (status == USERSTATUS.approved) {
      sendMails(
        user.email,
        "Registration Request Approved",
        `Hi ${name}, \n Your registration request has been approved. please click on the link ${process.env.LOGIN_URL} for login.`
      );
    }

    res.json({
      status: true,
      message: getMessage("accountant.approveSuccess"),
      user_id: user.id,
    });
  } catch {
    res.status(400).json({
      status: false,
      message: getMessage("accountant.approveFailed"),
    });
  }
};

module.exports = { getAccountant, approveAccountant };
