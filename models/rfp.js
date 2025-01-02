module.exports = (sequelize, DataTypes) => {
  const Rfps = sequelize.define(
    "Rfps",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      admin_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      item_name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      item_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      last_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("open", "closed", "applied"),
        allowNull: false,
        defaultValue: "open",
      },
      minimum_price: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: false,
      },
      maximum_price: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: false,
      },
      category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
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
      tableName: "rfps",
      timestamps: false,
    }
  );

  Rfps.associate = (models) => {
    Rfps.hasMany(models.RfpVendors, {
      foreignKey: "rfp_id",
      as: "vendorsForRfp",
    });

    Rfps.belongsTo(models.Users, {
      foreignKey: "admin_id",
      as: "admin",
    });

    Rfps.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });

    Rfps.belongsTo(models.Tenants, {
      foreignKey: "tenant_id",
      as: "tenant",
    });
  };

  return Rfps;
};
