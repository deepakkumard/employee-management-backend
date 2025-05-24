const { Project } = require("../models");
const { Op } = require("sequelize");
// Create a Project
exports.createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      owner_name,
      client_name,
      client_email,
      client_phone,
      client_address,
      estimated_budget,
      project_start_date,
      project_end_date,
      project_status,
    } = req.body;

    // Check if the project name already exists
    const existingProject = await Project.findOne({ where: { name } });

    if (existingProject) {
      return res.status(400).json({ error: "Project name already exists" });
    }

    // Create a new project
    const newProject = await Project.create({
      name,
      description,
      owner_name,
      client_name,
      client_email,
      client_phone,
      client_address,
      estimated_budget,
      project_start_date,
      project_end_date,
      project_status,
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error("Error creating project:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get a Project by ID
exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (err) {
    console.error("Error fetching project:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update a Project
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, ...updateData } = req.body;

  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the new name already exists for another project
    if (name) {
      const existingProject = await Project.findOne({
        where: { name, id: { [Op.ne]: id } },
      });

      if (existingProject) {
        return res
          .status(400)
          .json({ error: "Project name already exists for another project" });
      }
    }

    // Update the project
    await project.update({ name, ...updateData });
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (err) {
    console.error("Error updating project:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete (Soft Delete) a Project
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const { project_status } = req.body;

  if (!project_status) {
    return res.status(400).json({ error: "Project status is required" });
  }

  try {
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const [affectedRows] = await Project.update(
      { project_status },
      { where: { id } }
    );
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No record updated. Check the project ID or status." });
    }

    // Fetch the updated project to confirm
    const updatedProject = await Project.findByPk(id);

    res.status(200).json({
      message: "Project status updated successfully",
      project: updatedProject,
    });
  } catch (err) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
