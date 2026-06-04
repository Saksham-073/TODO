const express = require('express');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.schema');
const { listTasks, createTask, updateTask, deleteTask } = require('../controllers/task.controller');

const router = express.Router();

// Every task route requires a valid token and is scoped to that user.
router.use(auth);

router.get('/', listTasks);
router.post('/', validate(createTaskSchema), createTask);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
