module.exports = (sequelize, DataTypes) => {
  const VendorDetails = sequelize.define(
    "VendorDetails",
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
      no_of_employees: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      last_three_year_revenue: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      gst_no: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      pancard_no: {
        type: DataTypes.STRING(191),
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
    },
    {
      tableName: "vendor_details",
      timestamps: false, // To prevent Sequelize from automatically adding `createdAt` and `updatedAt` fields
    }
  );

  VendorDetails.associate = (models) => {
    VendorDetails.belongsTo(models.Users, {
      foreignKey: "vendor_id",
      as: "vendor",
    });

    VendorDetails.belongsToMany(models.Category, {
      through: models.VendorCategories, // Specify the join table
      foreignKey: "vendor_id",
      otherKey: "category_id",
      as: "categories",
    });
  };
  return VendorDetails;
};
