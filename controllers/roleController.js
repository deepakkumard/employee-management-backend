const { Role } = require("../models");

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRole = async (req, res) => {
  const { name } = req.body;
  try {
    const role = await Role.create({ name });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
