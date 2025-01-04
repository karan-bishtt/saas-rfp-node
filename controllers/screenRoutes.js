const express = require("express");
const {
  REGISTER_COMPANY_URL,
  REGISTER_ACCOUNTANT_URL,
  REGISTER_PROCUREMENT_MANAGER_URL,
  REGISTER_VENDOR_URL,
  FORGOT_PASSWORD_URL,
} = require("../helpers/constant");

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
  res.render("dashboard");
};

module.exports = {
  loginScreen,
  registerAdminScreen,
  registerManagerScreen,
  registerAccountantScreen,
  registerVendorScreen,
  forgotPasswordScreen,
  dashboardScreen,
};
