const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      client_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      client_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estimated_budget: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      project_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      project_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      project_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending",
      },
    },
    {
      tableName: "projects",
      timestamps: true,
    }
  );

  return Project;
};
