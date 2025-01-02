module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      resource_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      resource_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      changes: {
        type: DataTypes.TEXT,
        allowNull: true, // Optional: JSON string describing changes
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      tenant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "audit_logs",
      timestamps: false,
    }
  );

  return AuditLog;
};
