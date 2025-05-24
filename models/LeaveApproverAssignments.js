module.exports = (sequelize, DataTypes) => {
  const LeaveApproverAssignment = sequelize.define(
    "LeaveApproverAssignment",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
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
      object_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      object_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
    },
    {
      tableName: "leave_approver_assignments",
      timestamps: true,
    }
  );

  LeaveApproverAssignment.associate = (models) => {
    LeaveApproverAssignment.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    LeaveApproverAssignment.belongsTo(models.User, {
      foreignKey: "approver_id",
      as: "approver",
    });

    LeaveApproverAssignment.belongsTo(models.LeaveRequest, {
      foreignKey: "leave_request_id",
      as: "leaveRequest",
    });
  };

  return LeaveApproverAssignment;
};
