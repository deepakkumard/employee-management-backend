const { AssignTeamMember, User } = require("../models");

exports.createAssignTeamMember = async (req, res) => {
  try {
    const { user_id, approver_user_id, approver_level, status } = req.body;
    const user = await User.findByPk(approver_user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAssign = await AssignTeamMember.create({
      user_id,
      approver_user_id,
      approver_level,
      status,
    });

    res.status(201).json({
      message: "Team member assigned successfully",
      newAssign,
    });
  } catch (error) {
    console.error("Error assigning team member:", error);
    res.status(500).json({ error: error.message });
  }
};
