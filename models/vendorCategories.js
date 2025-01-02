module.exports = (sequelize, DataTypes) => {
  const VendorCategories = sequelize.define(
    "VendorCategories",
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
      category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "vendor_categories",
      timestamps: false,
    }
  );

  VendorCategories.associate = (models) => {
    VendorCategories.belongsTo(models.VendorDetails, {
      foreignKey: "vendor_id",
      as: "vendor",
    });
    VendorCategories.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  };

  return VendorCategories;
};
