const { z } = require('zod');

const priority = z.enum(['High', 'Medium', 'Low']);
const category = z.enum(['Personal', 'Work', 'Shopping', 'Health', 'Other']);

// Accept an ISO date string or null; coerce to Date.
const dueDate = z
  .union([z.string().datetime({ message: 'dueDate must be an ISO date string' }), z.null()])
  .optional();

const createTaskSchema = z.object({
  text: z.string().trim().min(1, 'Task text is required').max(200, 'Task text is too long'),
  priority: priority.optional(),
  category: category.optional(),
  location: z.string().trim().max(100).optional(),
  dueDate,
  completed: z.boolean().optional(),
});

// All fields optional on update, but at least one must be present.
const updateTaskSchema = z
  .object({
    text: z.string().trim().min(1).max(200).optional(),
    priority: priority.optional(),
    category: category.optional(),
    location: z.string().trim().max(100).optional(),
    dueDate,
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });

module.exports = { createTaskSchema, updateTaskSchema };
