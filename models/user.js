const bcrypt = require("bcryptjs"); // Make sure to require bcryptjs if using password hashing

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        require: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      remember_token: {
        type: DataTypes.STRING(100),
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      roles: {
        type: DataTypes.ENUM(
          "vendor",
          "admin",
          "manager",
          "accountant",
          "super_admin"
        ),
      },
      mobile: {
        type: DataTypes.STRING(10),
      },
      otp: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },
      // foreign key of tenant
      tenant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: false,
      hooks: {
        // Hooks should be included here, inside the options object
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  Users.associate = (models) => {
    // Relationships
    Users.belongsTo(models.Tenants, {
      foreignKey: "tenant_id",
      as: "tenants",
    });

    Users.hasMany(models.Accountant, {
      foreignKey: "accountant_id",
      as: "accountants",
    });

    Users.hasMany(models.VendorDetails, {
      foreignKey: "vendor_id",
      as: "vendorDetails",
    });

    Users.hasMany(models.Rfps, {
      foreignKey: "admin_id",
      as: "rfps",
    });

    Users.hasMany(models.RfpVendors, {
      foreignKey: "vendor_id",
      as: "rfpVendors",
    });
  };

  return Users;
};
