const { AuditLog } = require("../models/index");

const createAuditLog = async ({
  user_id,
  resource_type,
  resource_id,
  action,
  changes,
  tenant_id,
}) => {
  try {
    await AuditLog.create({
      user_id,
      resource_type,
      resource_id,
      action,
      changes: changes ? JSON.stringify(changes) : null, // Store changes as JSON string
      tenant_id,
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
};

module.exports = { createAuditLog };
