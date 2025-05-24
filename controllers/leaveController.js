const {
  LeaveRequest,
  LeaveType,
  User,
  LeaveApproval,
  LeaveApproverAssignment,
  AssignTeamMember,
} = require("../models");

// exports.createLeaveRequest = async (req, res) => {
//   try {
//     const { user_id, leave_type_id, start_date, end_date, reason } = req.body;

//     const leaveRequest = await LeaveRequest.create({
//       user_id,
//       leave_type_id,
//       start_date,
//       end_date,
//       reason,
//     });

//     res.status(201).json({
//       message: "Leave request created successfully",
//       leaveRequest,
//     });
//   } catch (error) {
//     console.error("Error creating leave request:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// Create Leave Request and Automatically Assign Approvers

// Helper function to get approvers based on user_id (team members)
const getApproversBasedOnUserId = async (userId) => {
  try {
    console.log("Fetching approvers for user_id:", userId);

    const approvers = await AssignTeamMember.findAll({
      where: { user_id: userId },
      attributes: ["approver_user_id", "approver_level"],
    });

    console.log("Approvers fetched:", approvers);

    return approvers;
  } catch (error) {
    console.error("Error fetching approvers:", error);
    throw error;
  }
};

// Create leave request API
exports.createLeaveRequest = async (req, res) => {
  try {
    const { user_id, leave_type_id, start_date, end_date, reason } = req.body;

    console.log("Creating leave request for user_id:", user_id);

    // Step 1: Create the leave request
    const leaveRequest = await LeaveRequest.create({
      user_id,
      leave_type_id,
      start_date,
      end_date,
      reason,
    });

    console.log("Leave request created:", leaveRequest);

    // Step 2: Fetch approvers based on the user_id
    const approvers = await getApproversBasedOnUserId(user_id);

    console.log("Fetched approvers:", approvers);

    // If no approvers found, log it
    if (approvers.length === 0) {
      console.warn("No approvers found for user_id:", user_id);
    }

    // Step 3: Map the approvers
    const approverAssignments = approvers.map((approver) => ({
      leave_request_id: leaveRequest.id,
      approver_user_id: approver.approver_user_id,
      approver_level: approver.approver_level,
    }));

    console.log("Approver assignments:", approverAssignments);

    // Step 4: Insert into leave_approver_assignments table
    await LeaveApproverAssignment.bulkCreate(approverAssignments);

    console.log("Approvers inserted into leave_approver_assignments");

    // Step 5: Respond with success
    res.status(201).json({
      message: "Leave request created and approvers assigned successfully",
      leaveRequest,
    });
  } catch (error) {
    console.error("Error creating leave request:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLeaveRequests = async (req, res) => {
  const leaveRequests = await LeaveRequest.findAll({ include: ["user"] });
  res.json(leaveRequests);
};

// exports.getLeaveRequestById = async (req, res) => {
//   try {
//     const leaveRequestId = req.params.leave_request_id;

//     if (!leaveRequestId) {
//       return res.status(400).json({ error: "leave_request_id is required" });
//     }

//     const leaveRequest = await LeaveRequest.findOne({
//       where: { id: leaveRequestId },
//       include: [{ model: User, as: "user" }],
//     });

//     if (!leaveRequest) {
//       return res.status(404).json({ error: "Leave request not found" });
//     }

//     res.status(200).json(leaveRequest);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.getLeaveRequestById = async (req, res) => {
  const { leave_request_id } = req.params;

  try {
    const leaveRequest = await LeaveRequest.findOne({
      where: { id: leave_request_id },
      include: [
        {
          model: LeaveType,
          as: "leaveType",
          attributes: ["name"], // Fetch only the name of the leave type
        },
        {
          model: LeaveApproval,
          as: "approvals", // Include related leave approvals
          attributes: ["approver_id", "status"], // You can adjust the fields you need
        },
      ],
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    res.status(200).json({ leaveRequest });
  } catch (error) {
    console.error("Error fetching leave request:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
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
      .json({ message: "Leave request status updated", leaveRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelLeaveRequest = async (req, res) => {
  const leaveRequestId = req.params.leave_request_id;

  if (!leaveRequestId) {
    return res.status(400).json({ error: "leave_request_id is required" });
  }

  try {
    const leaveRequest = await LeaveRequest.findByPk(leaveRequestId);
    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }
    leaveRequest.status = "Cancelled";
    await leaveRequest.save();

    res
      .status(200)
      .json({ message: "Leave request cancelled successfully", leaveRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.findAll();
    res.status(200).json(leaveTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a leave approval
exports.createLeaveApproval = async (req, res) => {
  try {
    const { leave_request_id, approval_level_id, approver_id, status } =
      req.body;

    // Find the leave request
    const leaveRequest = await LeaveRequest.findByPk(leave_request_id);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Create the approval record
    const leaveApproval = await LeaveApproval.create({
      leave_request_id,
      approval_level_id,
      approver_id,
      status,
    });

    // Update the leave request status based on the approval
    if (status === "Approved") {
      leaveRequest.status = "Approved";
    } else if (status === "Rejected") {
      leaveRequest.status = "Rejected";
    } else {
      leaveRequest.status = "Pending";
    }
    await leaveRequest.save();

    res.status(201).json({
      message: "Leave approval created successfully",
      leaveApproval,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApprovalsByLeaveRequest = async (req, res) => {
  try {
    const { leave_request_id } = req.params;

    // Fetch approvals for the given leave request
    const approvals = await LeaveApproval.findAll({
      where: { leave_request_id },
      include: [
        {
          model: User,
          as: "approver",
          attributes: ["id", "name", "email"],
        },
        {
          model: LeaveRequest,
          as: "leaveRequest",
          attributes: ["id", "start_date", "end_date", "reason", "status"],
        },
      ],
    });

    if (!approvals.length) {
      return res
        .status(404)
        .json({ message: "No approvals found for this leave request." });
    }

    res.status(200).json({ success: true, approvals });
  } catch (error) {
    console.error("Error fetching approvals:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.assignApprovers = async (req, res) => {
  const { user_id, approvers } = req.body; // approvers is an array of approver objects with approver_id and level

  try {
    for (let i = 0; i < approvers.length; i++) {
      const approver = approvers[i];

      await LeaveApproverAssignment.create({
        user_id: user_id,
        approver_id: approver.approver_id,
        object_id: req.body.leave_request_id, // Assuming leave_request_id is passed
        object_type: "leave_request",
        level: approver.level,
        status: "Pending",
      });
    }

    res.status(201).json({
      message: "Approvers assigned successfully",
    });
  } catch (error) {
    console.error("Error assigning approvers:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.approveLeaveRequest = async (req, res) => {
  const { leave_request_id, approver_id, status } = req.body;

  try {
    // Check if the approver exists for this leave request and at the specified level
    const approvalAssignment = await LeaveApproverAssignment.findOne({
      where: {
        object_id: leave_request_id,
        object_type: "leave_request",
        approver_id: approver_id,
        status: "Pending",
      },
    });

    if (!approvalAssignment) {
      return res
        .status(404)
        .json({ error: "Approver not found or already approved/rejected" });
    }

    // Update approval status
    approvalAssignment.status = status;
    await approvalAssignment.save();

    // If all levels of approval are completed, update the leave request status
    const allApprovals = await LeaveApproverAssignment.findAll({
      where: {
        object_id: leave_request_id,
        object_type: "leave_request",
      },
    });

    const allApproved = allApprovals.every(
      (assignment) => assignment.status === "Approved"
    );
    const allRejected = allApprovals.every(
      (assignment) => assignment.status === "Rejected"
    );

    if (allApproved) {
      // Update the leave request status to "Approved"
      await LeaveRequest.update(
        { status: "Approved" },
        { where: { id: leave_request_id } }
      );
    } else if (allRejected) {
      // Update the leave request status to "Rejected"
      await LeaveRequest.update(
        { status: "Rejected" },
        { where: { id: leave_request_id } }
      );
    }

    res.status(200).json({
      message: `Leave request ${
        status === "Approved" ? "approved" : "rejected"
      }`,
    });
  } catch (error) {
    console.error("Error approving leave request:", error);
    res.status(500).json({ error: error.message });
  }
};
