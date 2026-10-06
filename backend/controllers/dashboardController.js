const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboard = async (req, res) => {
  try {
    // -----------------------------
    // 1. Get user's projects
    // -----------------------------
    const projects = await Project.find({
      owner: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const projectIds = projects.map((project) => project._id);

    // -----------------------------
    // 2. Task statistics
    // -----------------------------
    const totalProjects = projects.length;

    const totalTasks = await Task.countDocuments({
      project: { $in: projectIds },
    });

    const completedTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: "completed",
    });

    const inProgressTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: "in-progress",
    });

    const todoTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: "todo",
    });

    const reviewTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: "review",
    });

    const highPriorityTasks = await Task.countDocuments({
      project: { $in: projectIds },
      priority: "high",
    });

    // -----------------------------
    // 3. Recent Tasks
    // -----------------------------
    const recentTasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // -----------------------------
    // 4. Recent Projects
    // -----------------------------
    const recentProjects = await Promise.all(
      projects.slice(0, 5).map(async (project) => {
        const taskCount = await Task.countDocuments({
          project: project._id,
        });

        return {
          ...project,
          taskCount,
        };
      })
    );

    // -----------------------------
    // 5. Completion percentage
    // -----------------------------
    const completionPercentage =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    // -----------------------------
    // 6. Response
    // -----------------------------
    res.json({
      success: true,

      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        reviewTasks,
        highPriorityTasks,
        completionPercentage,
      },

      recentTasks,

      recentProjects,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};

module.exports = {
  getDashboard,
};