module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      // foreign key of tenant
      tenant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "category",
      timestamps: false,
    }
  );

  Category.associate = (models) => {
    Category.belongsTo(models.Tenants, {
      foreignKey: "tenant_id",
      as: "tenant",
    });

    Category.hasMany(models.Rfps, {
      foreignKey: "category_id",
      as: "rfps",
    });

    Category.belongsToMany(models.VendorDetails, {
      through: models.VendorCategories, // Specify the join table
      foreignKey: "category_id",
      otherKey: "vendor_id",
      as: "vendors",
    });
  };

  return Category;
};
