const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE
router.post("/", protect, createProject);

// GET ALL
router.get("/", protect, getProjects);

// GET ONE
router.get("/:id", protect, getProject);

// UPDATE
router.put("/:id", protect, updateProject);

// DELETE
router.delete("/:id", protect, deleteProject);


module.exports = router;