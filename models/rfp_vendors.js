module.exports = (sequelize, DataTypes) => {
  const RfpVendors = sequelize.define(
    "RfpVendors",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      vendor_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      rfp_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      item_price: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: true,
      },
      total_cost: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("open", "closed", "applied"),
        allowNull: false,
        defaultValue: "open",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // foreign key of tenant
      tenant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "rfp_vendors",
      timestamps: false, // To prevent Sequelize from automatically adding `createdAt` and `updatedAt` fields
    }
  );

  RfpVendors.associate = (models) => {
    RfpVendors.belongsTo(models.Users, {
      foreignKey: "vendor_id",
      as: "vendor",
    });

    RfpVendors.belongsTo(models.Rfps, {
      foreignKey: "rfp_id",
      as: "rfp",
    });

    RfpVendors.belongsTo(models.Tenants, {
      foreignKey: "tenant_id",
      as: "tenant",
    });
  };

  return RfpVendors;
};
