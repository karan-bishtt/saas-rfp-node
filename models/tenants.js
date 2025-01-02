module.exports = (sequelize, DataTypes) => {
  const Tenants = sequelize.define(
    "Tenants",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "closed"),
        allowNull: false,
        defaultValue: "active",
      },
      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
    },
    {
      tableName: "tenants",
      timestamps: false,
    }
  );

  Tenants.associate = (models) => {
    // Relationships
    Tenants.hasMany(models.Users, {
      foreignKey: "tenant_id",
      as: "tenants",
    });

    Tenants.hasMany(models.Category, {
      foreignKey: "tenant_id",
      as: "categories",
    });

    Tenants.hasMany(models.Rfps, {
      foreignKey: "tenant_id",
      as: "rfps",
    });

    Tenants.hasMany(models.RfpVendors, {
      foreignKey: "tenant_id",
      as: "rfpvendors",
    });
  };

  return Tenants;
};
