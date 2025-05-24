const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const LeaveApproval = sequelize.define(
    "LeaveApproval",
    {
      leave_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "leave_requests",
          key: "id",
        },
      },
      approver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending", // "Pending", "Approved", "Rejected"
      },
    },
    {
      tableName: "leave_approvals",
      timestamps: true,
    }
  );

  LeaveApproval.associate = (models) => {
    LeaveApproval.belongsTo(models.LeaveRequest, {
      foreignKey: "leave_request_id",
      as: "leaveRequest",
    });
    LeaveApproval.belongsTo(models.User, {
      foreignKey: "approver_id",
      as: "approver",
    });
  };

  return LeaveApproval;
};
