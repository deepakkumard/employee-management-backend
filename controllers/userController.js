const db = require("../config/db");
const bcrypt = require("bcrypt");
const { User, Role } = require("../models");

// Fetch all users details
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "createdAt"],
      include: {
        model: Role,
        as: "roles",
        attributes: ["name"],
      },
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Fetch logged in users details
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        as: "roles",
        attributes: ["name"],
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role_id,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role_id } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role_id = role_id || user.role_id;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
