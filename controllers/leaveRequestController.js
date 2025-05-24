const {
  LeaveRequest,
  LeaveApproval,
  ApprovalLevel,
  User,
} = require("../models");

// Create a new leave request
exports.createLeaveRequest = async (req, res) => {
  try {
    const { user_id, leave_type, start_date, end_date } = req.body;
    console.log("LeaveRequest Model:", LeaveRequest);
    const leaveRequest = await LeaveRequest.create({
      user_id,
      leave_type,
      start_date,
      end_date,
    });

    res
      .status(201)
      .json({ message: "Leave request created successfully", leaveRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all leave requests
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.findAll({
      include: [
        { model: User, as: "user" },
        { model: LeaveApproval, as: "approvals" },
      ],
    });

    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single leave request by ID
exports.getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findByPk(id, {
      include: [
        { model: User, as: "user" },
        { model: LeaveApproval, as: "approvals" },
      ],
    });

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a leave request (e.g., status)
exports.updateLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leaveRequest.status = status;
    await leaveRequest.save();

    res
      .status(200)
      .json({ message: "Leave request updated successfully", leaveRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a leave request
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    await leaveRequest.destroy();
    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a leave approval
exports.createLeaveApproval = async (req, res) => {
  try {
    const { leave_request_id, approval_level_id, approver_id, status } =
      req.body;

    const leaveApproval = await LeaveApproval.create({
      leave_request_id,
      approval_level_id,
      approver_id,
      status,
    });

    res
      .status(201)
      .json({ message: "Leave approval created successfully", leaveApproval });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all approvals for a specific leave request
exports.getApprovalsByLeaveRequest = async (req, res) => {
  try {
    const { leave_request_id } = req.params;

    const leaveApprovals = await LeaveApproval.findAll({
      where: { leave_request_id },
      include: [
        { model: ApprovalLevel, as: "approvalLevel" },
        { model: User, as: "approver" },
      ],
    });

    res.status(200).json(leaveApprovals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
