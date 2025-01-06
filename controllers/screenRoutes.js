const express = require("express");
const {
  REGISTER_COMPANY_URL,
  REGISTER_ACCOUNTANT_URL,
  REGISTER_PROCUREMENT_MANAGER_URL,
  REGISTER_VENDOR_URL,
  FORGOT_PASSWORD_URL,
  CREATE_CATEGORY_URL,
} = require("../helpers/constant");

const db = require("../models/index");
const RfpVendors = db.RfpVendors;
const Rfps = db.Rfps;

/**
 * Render Login  Page
 * @param {object} req
 * @param {object} res
 */
const loginScreen = (req, res) => {
  res.render("login", {
    messages: [],
    loginUrl: process.env.LOGIN_URL,
    registerCompanyUrl: REGISTER_COMPANY_URL,
    registerAccountantUrl: REGISTER_ACCOUNTANT_URL,
    registerProcurementManagerUrl: REGISTER_PROCUREMENT_MANAGER_URL,
    registerVendorUrl: REGISTER_VENDOR_URL,
    forgotPasswordUrl: FORGOT_PASSWORD_URL,
  });
};

/**
 * Render Register Admin  Page
 * @param {object} req
 * @param {object} res
 */
const registerAdminScreen = (req, res) => {
  res.render("register-admin", {
    loginUrl: process.env.LOGIN_URL,
  });
};

/**
 * Render Register manager  Page
 * @param {object} req
 * @param {object} res
 */
const registerManagerScreen = (req, res) => {
  res.render("register-manager", {
    loginUrl: process.env.LOGIN_URL,
  });
};

/**
 * Render Register accountant  Page
 * @param {object} req
 * @param {object} res
 */
const registerAccountantScreen = (req, res) => {
  res.render("register-accountant", {
    loginUrl: process.env.LOGIN_URL,
  });
};

/**
 * Render Register Vendor  Page
 * @param {object} req
 * @param {object} res
 */
const registerVendorScreen = (req, res) => {
  res.render("register-vendor", {
    loginUrl: process.env.LOGIN_URL,
  });
};

/**
 * Render forgotPassword  Page
 * @param {object} req
 * @param {object} res
 */
const forgotPasswordScreen = (req, res) => {
  res.render("forgot-password", {
    loginUrl: process.env.LOGIN_URL,
  });
};

const dashboardScreen = (req, res) => {
  res.render("dashboard", { user: req.user });
};

const accountantScreen = (req, res) => {
  res.render("accountant-list", { user: req.user });
};

const managerScreen = (req, res) => {
  res.render("manager-list", { user: req.user });
};

const vendorScreen = (req, res) => {
  res.render("vendor-list", { user: req.user });
};
const rpfScreen = (req, res) => {
  res.render("rfp-list", { user: req.user });
};

const categoryScreen = (req, res) => {
  res.render("category-list", {
    user: req.user,
  });
};

const addCategoryScreen = (req, res) => {
  res.render("create-category", { user: req.user });
};

const addRFPScreen = (req, res) => {
  res.render("create-rfp", { user: req.user });
};

const rfpQuotesScreen = (req, res) => {
  const { rfp_id } = req.params || {};
  res.render("rfp-quotes", { user: req.user, rfp_id: rfp_id });
};

const rfpRequestScreen = (req, res) => {
  res.render("rfp-request", { user: req.user });
};

const applyRfpScreen = (action) => {
  return async (req, res) => {
    const user = req.user;

    try {
      const { rfp_id } = req.params;

      // Fetch the RFP vendor details
      const rfpVendor = await RfpVendors.findOne({
        where: {
          rfp_id,
          vendor_id: user.id,
          tenant_id: user.tenant_id,
        },
        include: [
          {
            model: Rfps,
            as: "rfp",
          },
        ],
      });

      // Handle cases where RFP is not found or invalid
      if (!rfpVendor || !rfpVendor.rfp) {
        return res.redirect(`/${user.roles}/rfp-request`);
      }

      // Redirect based on RFP status
      const rfpStatus = rfpVendor.rfp.status;
      if (rfpStatus === "applied" || rfpStatus !== "open") {
        return res.redirect(`/${user.roles}/rfp-request`);
      }

      // Render the "apply-rfp" view with RFP details
      const page = action === "apply" ? "apply-rfp" : "view-rfp-vendor";
      res.render(page, {
        user,
        rfp: {
          id: rfpVendor.rfp.id,
          max_price: rfpVendor.rfp.maximum_price,
          min_price: rfpVendor.rfp.minimum_price,
          name: rfpVendor.rfp.item_name,
          description: rfpVendor.rfp.item_description,
          quantity: rfpVendor.rfp.quantity,
          last_date: rfpVendor.rfp.last_date,
          item_price: rfpVendor.item_price || null,
          total_cost: rfpVendor.total_cost || null,
          status: rfpVendor.status || "open",
        },
      });
    } catch (error) {
      console.error("Error in applyRfpScreen:", error.message);
      res.redirect(`/${user.roles}/rfp-request`);
    }
  };
};

const getAdminsScreen = (req, res) => {
  res.render("get-admins", { user: req.user });
};

module.exports = {
  loginScreen,
  registerAdminScreen,
  registerManagerScreen,
  registerAccountantScreen,
  registerVendorScreen,
  forgotPasswordScreen,
  dashboardScreen,
  accountantScreen,
  managerScreen,
  vendorScreen,
  rpfScreen,
  categoryScreen,
  addCategoryScreen,
  addRFPScreen,
  rfpQuotesScreen,
  rfpRequestScreen,
  applyRfpScreen,
  getAdminsScreen,
};
