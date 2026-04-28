import z from 'zod'

const subTaskSchema = z.object({
  title: z.string().describe('Title of the sub-task.'),
  completed: z
    .boolean()
    .default(false)
    .describe('Whether the sub-task is completed.'),
})

export const createTaskSchema = z.object({
  userId: z
    .string()
    .describe(
      'MongoDB ObjectId of the user creating the task. Required for logging.'
    ),
  projectId: z
    .string()
    .describe('MongoDB ObjectId of the project this task belongs to.'),
  memberId: z
    .string()
    .describe('MongoDB ObjectId of the team member creating this task.'),

  title: z
    .string()
    .min(1)
    .max(255)
    .describe('Title of the task (max 255 characters).'),
  description: z.string().min(1).describe('Detailed description of the task.'),

  dueDate: z
    .string()
    .datetime()
    .describe('Task due date in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ).'),

  priority: z
    .enum(['Low', 'Medium', 'High'])
    .default('Low')
    .describe('Task priority level (default: Low).'),
  taskType: z
    .string()
    .optional()
    .describe('Task category, e.g., Feature, Bug, or Enhancement.'),

  subTasks: z
    .array(subTaskSchema)
    .optional()
    .default([])
    .describe('List of sub-tasks associated with this task.'),
})

export const getTasksSchema = z.object({
  projectId: z
    .string()
    .describe('MongoDB ObjectId of the project whose tasks you want to fetch.'),
  memberId: z
    .string()
    .describe('MongoDB ObjectId of the requesting team member.'),
  title: z
    .string()
    .optional()
    .default('')
    .describe('Search term to match task titles (case-insensitive).'),
  priority: z
    .enum(['Low', 'Medium', 'High'])
    .optional()
    .nullable()
    .default(null)
    .describe('Filter tasks by priority level.'),
  status: z
    .enum(['Todo', 'In Progress', 'Under Review', 'Completed'])
    .nullable()
    .default(null)
    .describe('Filter tasks by current status.'),
  assignedToMe: z
    .boolean()
    .optional()
    .default(false)
    .describe('If true, only return tasks assigned to the requesting member.'),
  createdByMe: z
    .boolean()
    .optional()
    .default(false)
    .describe('If true, only return tasks created by the requesting member.'),
  sortByCreated: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'If true, sort tasks by creation date ascending (default: descending).'
    ),
  page: z
    .number()
    .optional()
    .default(1)
    .describe('Pagination: page number (default: 1).'),
  limit: z
    .number()
    .optional()
    .default(10)
    .describe('Pagination: number of tasks per page (default: 10).'),
})
