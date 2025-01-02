// login user
const { response } = require("express");
const { generateToken } = require("../helpers/jwt_helper");
const bcrypt = require("bcryptjs");
let db = require("../models/index");
const { sendMails } = require("../helpers/mailer");
const { getMessage } = require("../lang");
const { ROLES, USERSTATUS, SUPERUSERTENANT } = require("../helpers/constant");
const { Op } = require("sequelize");

const {
  adminValidator,
  accountantValidator,
  managerValidator,
  vendorValidator,
  resetPasswordValidator,
  confirmPasswordValidator,
  loginValidator,
} = require("../validators/auth");
let Users = db.Users;
let VendorDetails = db.VendorDetails;
let Accountant = db.Accountant;
let Tenants = db.Tenants;
let Category = db.Category;
let VendorCategories = db.VendorCategories;

// This method is used to login the user
const login = async (req, res) => {
  try {
    // Fetch the user by email from the database

    const { error, value } = loginValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = value;

    const user = await Users.findOne({
      where: { email: email },
    });

    // Check if user exists and password is correct
    if (!user) {
      return res
        .status(400)
        .json({ status: false, error: getMessage("auth.useNotPresent") });
    }
    is_matched = await bcrypt.compare(password, user.password);
    if (!is_matched) {
      return res
        .status(400)
        .json({ status: false, error: getMessage("auth.invalidCredentials") });
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
    // generate token
    const token = await generateToken(user);
    const response = {
      status: true,
      token: token,
      email: email,
      user_id: user.id,
      name: user.name,
      type: user.type,
      roles: user.roles,
    };
    res.json(response);
  } catch (error) {
    res
      .status(400)
      .json({ status: false, error: getMessage("auth.invalidCredentials") });
  }
};

// This method is used to register the admins
const registerAdmin = async (req, res) => {
  let tenant = null;
  try {
    const { error, value } = adminValidator.validate(req.body);
    // Check if the required fields except lastname are present
    if (error) {
      return res.status(400).json({
        status: false,
        message:
          error.details[0].message || getMessage("auth.allFieldsRequired"),
      });
    }
    const { firstname, lastname, email, password, mobile, tenant_name } = value;

    // Check if the admin already exists
    const existingAdmin = await Users.findOne({ where: { email } });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ status: false, error: getMessage("auth.emailAlreadyExist") });
    }
    // Check if the tenant already exists
    const doesExist = await Tenants.findOne({
      where: { name: tenant_name },
    });

    if (doesExist) {
      return res.status(400).json({
        status: false,
        message: getMessage("auth.tenantAlreadyExist"),
      });
    }
    // Create a new admin and save to DB
    const roles = ROLES.admin;
    tenant = new Tenants({
      name: tenant_name,
    });
    await tenant.save();
    const admin = new Users({
      name: firstname + " " + lastname || "",
      email,
      password,
      mobile,
      roles,
      tenant_id: tenant.id,
    });
    await admin.save();
    // Sending mail
    sendMails(
      email,
      "Welcome to the RFP",
      "You registration request has been submitted you will receive a mail once your request will be processed"
    );
    res.json({
      status: true,
      message: getMessage("auth.registerSuccess"),
    });
  } catch (error) {
    res.send({
      status: false,
      message: getMessage("error.somethingWentWrong"),
    });

    if (tenant) {
      tenant.destroy();
    }
  }
};

// This method is used to register the accountant
const registerAccount = async (req, res) => {
  try {
    const { error, value } = accountantValidator.validate(req.body);
    // Check if the required fields except lastname are present
    if (error) {
      return res.status(400).json({
        status: false,
        message:
          error.details[0].message || getMessage("auth.allFieldsRequired"),
      });
    }
    const {
      firstname,
      lastname,
      email,
      password,
      mobile,
      license_no,
      tenant_id,
    } = value;

    // Check if the account already exists
    const existingAccountant = await Users.findOne({ where: { email } });
    if (existingAccountant) {
      return res
        .status(400)
        .json({ status: false, error: getMessage("auth.emailAlreadyExist") });
    }

    // Check if the tenant already exists
    const doesExist = await Tenants.findOne({
      where: { id: tenant_id },
    });

    if (!doesExist) {
      return res.status(400).json({
        status: false,
        message: getMessage("auth.tenantIdNotExist"),
      });
    }
    // Create a new accountant and save to DB
    const roles = ROLES.accountant;
    const accountant = new Users({
      name: firstname + " " + lastname || "",
      email,
      password,
      mobile,
      roles,
      tenant_id,
    });
    await accountant.save();
    const details = new Accountant({
      accountant_id: accountant.id,
      licence_number: license_no,
    });
    await details.save();

    // Sending mail
    sendMails(
      email,
      "Welcome to the RFP",
      "You registration request has been submitted you will receive a mail once your request will be processed"
    );

    res.json({
      status: true,
      message: getMessage("auth.registerSuccess"),
    });
  } catch (error) {
    res.send({
      status: false,
      message: getMessage("error.somethingWentWrong"),
    });
  }
};

// This method is used to register the MANAGER
const registerManager = async (req, res) => {
  try {
    const { error, value } = managerValidator.validate(req.body);
    // Check if the required fields except lastname are present
    if (error) {
      return res.status(400).json({
        status: false,
        message:
          error.details[0].message || getMessage("auth.allFieldsRequired"),
      });
    }
    const { firstname, lastname, email, password, mobile, tenant_id } = value;

    // Check if the account already exists
    const existingManager = await Users.findOne({ where: { email } });
    if (existingManager) {
      return res
        .status(400)
        .json({ status: false, error: getMessage("auth.emailAlreadyExist") });
    }

    // Check if the tenant already exists
    const doesExist = await Tenants.findOne({
      where: { id: tenant_id },
    });

    if (!doesExist) {
      return res.status(400).json({
        status: false,
        message: getMessage("auth.tenantIdNotExist"),
      });
    }
    // Create a new accountant and save to DB
    const roles = ROLES.manager;
    const manager = new Users({
      name: firstname + " " + lastname || "",
      email,
      password,
      mobile,
      roles,
      tenant_id,
    });
    await manager.save();

    // Sending mail
    sendMails(
      email,
      "Welcome to the RFP",
      "You registration request has been submitted you will receive a mail once your request will be processed"
    );
    res.send({
      status: true,
      message: getMessage("auth.registerSuccess"),
    });
  } catch (error) {
    res.send({
      status: false,
      message: getMessage("error.somethingWentWrong"),
    });
  }
};

// This method is used to register the vendors
const registerVendor = async (req, res) => {
  try {
    const { error, value } = vendorValidator.validate(req.body);

    // Check if the required fields except lastname are present
    if (error) {
      return res.status(400).json({
        status: false,
        message:
          error.details[0].message || getMessage("auth.allFieldsRequired"),
      });
    }

    const {
      firstname,
      lastname,
      email,
      password,
      mobile,
      revenue,
      no_of_employees,
      category,
      pancard_no,
      gst_no,
      tenant_id,
    } = value;

    const existingVendor = await Users.findOne({ where: { email } });
    if (existingVendor) {
      return res
        .status(400)
        .json({ status: false, error: getMessage("auth.emailAlreadyExist") });
    }

    // Check if the tenant already exists
    const doesExist = await Tenants.findOne({
      where: { id: tenant_id },
    });

    if (!doesExist) {
      return res.status(400).json({
        status: false,
        message: getMessage("auth.tenantIdNotExist"),
      });
    }

    // Validate categories for the tenant
    const categories = await Category.findAll({
      where: {
        id: category,
        tenant_id,
      },
    });

    if (!categories || categories.length !== category.length) {
      return res.status(400).json({
        status: false,
        error: getMessage("rfps.invalidCategoryForTenant"),
      });
    }

    // Create a new vendor and save to DB
    const roles = ROLES.vendor;
    const vendor = new Users({
      name: firstname + " " + lastname || "",
      email,
      password,
      mobile,
      roles,
      tenant_id,
    });
    await vendor.save();
    const details = new VendorDetails({
      vendor_id: vendor.id,
      last_three_year_revenue: revenue,
      no_of_employees,
      pancard_no,
      gst_no,
    });
    await details.save();

    // Adding vendor categories
    // Associate categories with the vendor
    const vendorCategories = category.map((catId) => ({
      vendor_id: details.id,
      category_id: catId,
    }));
    await VendorCategories.bulkCreate(vendorCategories);

    // Sending mail
    sendMails(
      email,
      "Welcome to the RFP",
      "You registration request has been submitted you will receive a mail once your request will be processed"
    );

    res.send({ status: true, message: getMessage("auth.registerSuccess") });
  } catch (error) {
    console.log(error); // Added for better error tracking
    res.status(400).send({
      status: false,
      message: getMessage("error.somethingWentWrong"),
    });
  }
};

// This method is used to send the otp to user email for resetting the password
// TODO: As of now no use copy from the existing code if required can be used when i do the frontend part
const resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message:
          error.details[0].message ||
          getMessage("auth.emailOldNewPasswordRequired"),
      });
    }
    const { email, old_password, new_password } = value;
    // Check if the user exists
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: getMessage("auth.userNotFound") });
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: getMessage("auth.invalidOldCredentials"),
      });
    }

    // Validate new password (optional, could include complexity requirements)
    if (new_password.length < 6) {
      return res.status(200).json({
        status: false,
        message: getMessage("auth.passwordLeqSix"),
      });
    }

    // Hash the new password
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    user.update({ otp });
    // Send OTP to user's email
    sendMails(
      email,
      "Forgot Password OTP",
      "Please use the following OTP to reset your password: " + otp
    );
    res.json({
      status: true,
      message: getMessage("auth.otpSent"),
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: getMessage("error.somethingWentWrong"),
    });
  }
};

// This method is used to confirm the otp and reset the password
const confirmotpresetPassword = async (req, res) => {
  try {
    const { error, value } = confirmPasswordValidator.validate(req.body);
    // Check if the user exists
    if (error) {
      return res.status(400).json({
        status: true,
        message: error.details[0].message || getMessage("auth.optRequired"),
      });
    }
    const { email, otp, new_password } = value;
    const otpRecord = await Users.findOne({
      where: { email, otp },
    });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ status: false, message: getMessage("auth.invalidOTP") });
    }

    // Validate new password (optional, could include complexity requirements)
    if (new_password.length < 6) {
      return res.status(200).json({
        status: false,
        message: getMessage("auth.passwordLeqSix"),
      });
    }

    // Update the user's password
    const updatedUser = await otpRecord.update({
      password: new_password,
      otp: null,
    });

    res.json({
      status: true,
      message: getMessage("auth.passwordResetSuccess"),
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: false,
      message: getMessage("error.somethingWentWrong"),
    });
  }
};

// This method is used to set the otp upon forget password
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: getMessage("auth.userNotFound") });
    }

    // Hash the new password
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    user.update({ otp });

    // Send OTP to user's email
    const isEmailSent = sendMails(
      email,
      "Forgot Password OTP",
      "Please use the following OTP to reset your password: " + otp
    );

    if (!isEmailSent) {
      return res
        .status(400)
        .json({ status: false, message: getMessage("auth.failedToSendOTP") });
    }

    res.json({
      status: true,
      message: getMessage("auth.otpSent"),
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: false,
      message: getMessage("error.somethingWentWrong"),
    });
  }
};

// This method is used to get the tenants
const getTenants = async (req, res) => {
  try {
    const tenant = await Tenants.findAll({
      where: {
        name: {
          [Op.not]: SUPERUSERTENANT,
        },
      },
    });

    const formattedData = {};

    // Format the tenant data
    tenant.forEach((tenants) => {
      formattedData[tenants.id] = {
        id: tenants.id,
        name: tenants.name,
        status: tenants.status,
      };
    });

    res.send({ status: true, data: { tenants: formattedData } });
  } catch (error) {
    res.send({
      status: false,
      message: getMessage("error.somethingWentWrong"),
    });
  }
};

// Check if the user exists
module.exports = {
  login,
  registerAdmin,
  registerVendor,
  resetPassword,
  confirmotpresetPassword,
  forgetPassword,
  registerManager,
  registerAccount,
  getTenants,
};
