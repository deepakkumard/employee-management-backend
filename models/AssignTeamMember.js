const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AssignTeamMember = sequelize.define(
    "AssignTeamMember",
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
      approver_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      approver_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1, // 1 for active, 0 for inactive
      },
    },
    {
      tableName: "assign_team_members",
      timestamps: true,
    }
  );

  // Define associations with other models (if needed)
  AssignTeamMember.associate = (models) => {
    // You can link the approver to the User table (assuming users exist in your database)
    AssignTeamMember.belongsTo(models.User, {
      foreignKey: "approver_user_id",
      as: "approver", // Defining alias for the approver user
    });
  };

  return AssignTeamMember;
};
