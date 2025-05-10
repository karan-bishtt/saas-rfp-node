const ROLES = {
  admin: "admin",
  vendor: "vendor",
  manager: "manager",
  accountant: "accountant",
  super_admin: "super_admin",
};

const USERSTATUS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const ALLOWED_FILE_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const FILE_SIZE = 1024 * 1024 * 10; // 10MB

const SUPERUSERTENANT =
  "$2a$10$gkHidGkmXWMWSAlMzUxpyOv/FetztWOhnpFq/ewykfQsw/BBw6Ch.";

const RFP_STATUS = {
  open: "open",
  closed: "closed",
  applied: "applied",
};

const REGISTER_COMPANY_URL = "/register-admin";
const REGISTER_ACCOUNTANT_URL = "/register-accountant";
const REGISTER_PROCUREMENT_MANAGER_URL = "/register-manager";
const REGISTER_VENDOR_URL = "/register-vendor";
const FORGOT_PASSWORD_URL = "/forgot-password";
const CREATE_CATEGORY_URL = "/create-category";

const TENANT_STATUS = {
  active: "active",
  closed: "closed",
};

module.exports = {
  ROLES,
  USERSTATUS,
  ALLOWED_FILE_TYPES,
  FILE_SIZE,
  SUPERUSERTENANT,
  RFP_STATUS,
  REGISTER_COMPANY_URL,
  REGISTER_ACCOUNTANT_URL,
  REGISTER_PROCUREMENT_MANAGER_URL,
  REGISTER_VENDOR_URL,
  FORGOT_PASSWORD_URL,
  CREATE_CATEGORY_URL,
  TENANT_STATUS,
};
