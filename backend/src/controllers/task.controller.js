const mongoose = require('mongoose');
const Task = require('../models/Task');

const SORT_MAP = {
  created: { createdAt: -1 },
  priority: { priorityRank: 1 },
  dueDate: { dueDate: 1 },
};

// GET /api/tasks?filter=active|completed&sort=created|priority|dueDate
async function listTasks(req, res, next) {
  try {
    const { filter, sort } = req.query;

    const query = { user: req.user.id };
    if (filter === 'active') query.completed = false;
    if (filter === 'completed') query.completed = true;

    if (sort === 'priority') {
      // Order High → Medium → Low via a computed rank.
      const tasks = await Task.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id), ...(query.completed !== undefined ? { completed: query.completed } : {}) } },
        {
          $addFields: {
            priorityRank: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'High'] }, then: 0 },
                  { case: { $eq: ['$priority', 'Medium'] }, then: 1 },
                  { case: { $eq: ['$priority', 'Low'] }, then: 2 },
                ],
                default: 3,
              },
            },
          },
        },
        { $sort: { priorityRank: 1, createdAt: -1 } },
      ]);
      return res.json({ tasks: tasks.map(normalizeAggregate) });
    }

    const tasks = await Task.find(query).sort(SORT_MAP[sort] || SORT_MAP.created);
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks
async function createTask(req, res, next) {
  try {
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/tasks/:id
async function updateTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    next(err);
  }
}

// Aggregate results are plain objects — apply the same id cleanup as toJSON.
function normalizeAggregate(doc) {
  const { _id, __v, priorityRank, ...rest } = doc;
  return { id: _id, ...rest };
}

module.exports = { listTasks, createTask, updateTask, deleteTask };
