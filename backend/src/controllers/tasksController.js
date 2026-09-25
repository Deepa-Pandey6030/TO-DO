import Task from "../models/Task.js";
import mongoose from "mongoose";

/**
 * @desc    Get all tasks for the logged-in user
 *          Supports filtering by status, priority, category
 *          Supports search by title/description
 *          Supports sorting by dueDate, newest, oldest
 * @route   GET /api/tasks
 * @access  Protected
 */
export const getAllTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sort } = req.query;

    // Build query — always scope to authenticated user
    const query = { userId: req.userId };

    if (status && status !== "ALL") query.status = status;
    if (priority && priority !== "ALL") query.priority = priority;
    if (category && category !== "ALL") query.category = category;

    // Text search on title or description
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ title: regex }, { description: regex }];
    }

    // Build sort
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === "oldest") sortOption = { createdAt: 1 };
    else if (sort === "dueDate") sortOption = { dueDate: 1 };

    const tasks = await Task.find(query).sort(sortOption);

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Get a single task by ID (only if it belongs to the user)
 * @route   GET /api/tasks/:id
 * @access  Protected
 */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Error in getTaskById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Create a new task for the logged-in user
 * @route   POST /api/tasks
 * @access  Protected
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "TODO",
      priority: priority || "MEDIUM",
      category: category || "Other",
      dueDate: dueDate || null,
      userId: req.userId, // CRITICAL: scope to authenticated user
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error("Error in createTask:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Update a task (only if it belongs to the user)
 * @route   PUT /api/tasks/:id
 * @access  Protected
 */
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } =
      req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // Authorization check
      {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(category && { category }),
        ...(dueDate !== undefined && { dueDate: dueDate || null }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    console.error("Error in updateTask:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Update task status only
 * @route   PATCH /api/tasks/:id/status
 * @access  Protected
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["TODO", "IN_PROGRESS", "COMPLETED"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // Authorization check
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    console.error("Error in updateTaskStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Delete a task (only if it belongs to the user)
 * @route   DELETE /api/tasks/:id
 * @access  Protected
 */
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // Authorization check
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTask:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Get aggregated task statistics for the logged-in user
 * @route   GET /api/tasks/stats
 * @access  Protected
 */
export const getTaskStats = async (req, res) => {
  try {
    // Cast string userId from JWT to ObjectId for aggregation $match
    const userId = new mongoose.Types.ObjectId(req.userId);

    const stats = await Task.aggregate([
      { $match: { userId: userId } },
      {
        $facet: {
          statusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ],
          priorityCounts: [
            { $group: { _id: "$priority", count: { $sum: 1 } } },
          ],
          categoryCounts: [
            { $group: { _id: "$category", count: { $sum: 1 } } },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const result = stats[0];
    const total = result.total[0]?.count || 0;

    // Reshape status counts into an object
    const statusMap = {};
    result.statusCounts.forEach(({ _id, count }) => {
      statusMap[_id] = count;
    });

    // Reshape priority counts
    const priorityMap = {};
    result.priorityCounts.forEach(({ _id, count }) => {
      priorityMap[_id] = count;
    });

    // Reshape category counts
    const categoryMap = {};
    result.categoryCounts.forEach(({ _id, count }) => {
      categoryMap[_id] = count;
    });

    const completed = statusMap["COMPLETED"] || 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      total,
      completed,
      pending: statusMap["TODO"] || 0,
      inProgress: statusMap["IN_PROGRESS"] || 0,
      completionRate,
      priority: {
        high: priorityMap["HIGH"] || 0,
        medium: priorityMap["MEDIUM"] || 0,
        low: priorityMap["LOW"] || 0,
      },
      category: categoryMap,
    });
  } catch (error) {
    console.error("Error in getTaskStats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
