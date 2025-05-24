const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const {
  getAllUsers,
  getUserDetails,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { getRoles, createRole } = require("../controllers/roleController");

const authenticate = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/roleMiddleware");
const { createAssignTeamMember } = require("../controllers/generalController");

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const {
  createLeaveRequest,
  getAllLeaveRequests,
  updateLeaveStatus,
  getLeaveRequestById,
  cancelLeaveRequest,
  getLeaveTypes,
  createLeaveApproval,
  getApprovalsByLeaveRequest,
  assignApprovers,
  approveLeaveRequest,
} = require("../controllers/leaveController");

// const taskController = require('../controllers/taskController');

/** Auth Routes **/
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

/** User Routes **/
router.get("/getusers", authenticate, getAllUsers);
router.get("/users/:id", authenticate, getUserDetails);
router.post("/newuser", authenticate, createUser);
router.put("/update_users/:id", authenticate, updateUser);
router.delete("/delete_users/:id", authenticate, deleteUser);

/** Role Routes **/
router.get("/getroles", authenticate, getRoles);
router.post("/createrole", authenticate, createRole);

/** Project Routes **/
router.get("/get_projects", authenticate, getAllProjects);
router.get("/project/:id", authenticate, getProjectById);
router.post("/create_project", authenticate, createProject);
router.put("/update_project/:id", authenticate, updateProject);
router.post("/delete_project/:id", authenticate, deleteProject);

// router.get(
//   "/projects/:id",
//   authenticate,
//   checkPermission("project", "view"),
//   getProjectById
// );
// router.get("/projects/client/:client_name", getProjectsByClient);

// Task Routes
// router.post(
//   "/tasks",
//   authenticate,
//   checkPermission("task", "create"),
//   taskController.createTask
// );
// router.put(
//   "/tasks/:id",
//   authenticate,
//   checkPermission("task", "update"),
//   taskController.updateTask
// );
// router.post(
//   "/tasks/:id/assign",
//   authenticate,
//   checkPermission("task", "assign"),
//   taskController.assignTask
// );
// router.post(
//   "/tasks/:id/comment",
//   authenticate,
//   checkPermission("task", "comment"),
//   taskController.addComment
// );

// Leave Request Routes
router.post("/leave-request", authenticate, createLeaveRequest);
router.get("/leave-requests", authenticate, getAllLeaveRequests);
router.put("/leave-request/:id", authenticate, updateLeaveStatus);
router.get(
  "/leave-request/:leave_request_id",
  authenticate,
  getLeaveRequestById
);
router.put(
  "/leave-request/cancel/:leave_request_id",
  authenticate,
  cancelLeaveRequest
);
router.get("/leave-types", authenticate, getLeaveTypes);

// Leave Approval Routes
router.post("/approve", authenticate, createLeaveApproval);
router.get(
  "/approvals/:leave_request_id",
  authenticate,
  getApprovalsByLeaveRequest
);

router.post("/assign-approvers", authenticate, assignApprovers);
router.post("/approve-leave-request", authenticate, approveLeaveRequest);

router.post("/assign-team-members", authenticate, createAssignTeamMember);

module.exports = router;
