const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const LeaveRequest = sequelize.define(
    "LeaveRequest",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
      leave_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "leave_requests",
      timestamps: true,
    }
  );

  LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    // LeaveRequest.hasMany(models.LeaveApproval, {
    //   foreignKey: "leave_request_id",
    //   as: "approvals",
    // });
    LeaveRequest.belongsTo(models.LeaveType, {
      foreignKey: "leave_type_id",
      as: "leaveType",
    });

    LeaveRequest.hasMany(models.LeaveApproverAssignment, {
      foreignKey: "leave_request_id",
      as: "approvals",
    });
  };

  return LeaveRequest;
};
