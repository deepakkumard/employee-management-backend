const db = require("../config/db");

// Check if the user has the required permission
const checkPermission = (module, action) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Get role from JWT payload
    const query = `
            SELECT rp.role_id
            FROM role_permissions rp
            JOIN permissions p ON rp.permission_id = p.id
            JOIN roles r ON rp.role_id = r.id
            WHERE r.role_name = ? AND p.module_name = ? AND p.action = ?
        `;

    db.query(query, [userRole, module, action], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.length === 0) {
        return res.status(403).json({
          message: "Access denied. You do not have permission for this action.",
        });
      }
      next();
    });
  };
};

module.exports = checkPermission;
