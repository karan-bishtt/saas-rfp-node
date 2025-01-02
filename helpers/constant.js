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

module.exports = {
  ROLES,
  USERSTATUS,
  ALLOWED_FILE_TYPES,
  FILE_SIZE,
  SUPERUSERTENANT,
  RFP_STATUS,
};
