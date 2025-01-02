module.exports = (sequelize, DataTypes) => {
  const Accountant = sequelize.define(
    "Accountant",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      licence_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      accountant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "accountants",
      timestamps: false,
    }
  );

  Accountant.associate = (models) => {
    // Relationships
    Accountant.belongsTo(models.Users, {
      foreignKey: "accountant_id",
      as: "accountant",
    });
  };

  return Accountant;
};
