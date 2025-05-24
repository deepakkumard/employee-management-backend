const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const LeaveType = sequelize.define(
    "LeaveType",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "leave_types",
      timestamps: true,
    }
  );

  return LeaveType;
};
