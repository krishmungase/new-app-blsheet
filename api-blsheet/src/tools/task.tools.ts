import { tool } from '@langchain/core/tools'

import TaskService from '../services/project/task.services'
import { UserModel, TaskModel, TaskModelType } from '../models'
import { createTaskSchema, getTasksSchema } from '../schemas'
import { GetTasksQuery } from '../types/projects/task.types'
import { ENV } from '../config'

const taskService = new TaskService(TaskModel as unknown as TaskModelType)

export const createTask = tool(
  async (input) => {
    try {
      const user = await UserModel.findById(input.userId)
      if (!user) {
        return JSON.stringify({
          success: false,
          message: 'User not found',
          task: null,
        })
      }

      const missing = ['title', 'description', 'dueDate'].filter(
        (f) => !input[f as keyof typeof input]
      )
      if (missing.length) {
        return JSON.stringify({
          success: false,
          message: `Missing required fields: ${missing.join(', ')}`,
          missingFields: missing,
        })
      }

      const dueDate = new Date(input.dueDate)
      if (isNaN(dueDate.getTime())) {
        return JSON.stringify({
          success: false,
          message: `Invalid due date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).`,
        })
      }

      const taskData: any = {
        title: input.title.trim(),
        description: input.description.trim(),
        taskType: input.taskType || 'Bug',
        taskNumber: await taskService.getTaskNumber(input.projectId),
        dueDate,
        priority: input.priority || 'Low',
        status: 'Todo',
        completedDate: null,
        isDeleted: false,
        projectId: input.projectId,
        memberId: input.memberId,
        userId: user._id,
        subTasks: input.subTasks || [],
      }

      const newTask = await TaskModel.create(taskData)

      const formattedTask = {
        taskId: newTask._id.toString(),
        title: newTask.title,
        description: newTask.description,
        taskType: newTask.taskType,
        taskNumber: newTask.taskNumber,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        status: newTask.status,
        projectId: newTask.projectId,
        memberId: newTask.memberId,
        userId: newTask.userId,
        link: `${ENV.FRONTEND_URL}/dashboard/workspace/${newTask.projectId}/tasks/${newTask._id}`,
      }

      return JSON.stringify({
        success: true,
        message: `✅ Task "${input.title}" created successfully.`,
        task: formattedTask,
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        message: 'Failed to create task.',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  },
  {
    name: 'create_task',
    description: `
Create a new task in the project management system.
**Required Fields**
| Field | Type | Description |
|-------|------|--------------|
| userId | string | MongoDB ObjectId of the user creating the task. |
| projectId | string | MongoDB ObjectId of the project this task belongs to. |
| memberId | string | MongoDB ObjectId of the team member creating this task. |
| title | string | Task title (max 255 characters). |
| description | string | Detailed description of the task. |
| dueDate | string | Due date in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ). |

**Optional Fields**
| Field | Type | Description |
|-------|------|--------------|
| priority | 'Low' | 'Medium' | 'High' | Task priority (default: Low). |
| taskType | string | Task type (e.g., Feature, Bug, Enhancement). |
| subTasks | array | List of sub-tasks with title and completion status. |

**Response**
| Field | Description |
|-------|--------------|
| success | Boolean indicating success or failure. |
| message | Status message. |
| task | Task details with "taskId", "title", "priority", and more. |

**Example Task Link** 
${ENV.FRONTEND_URL}/dashboard/workspace/{projectId}/tasks/{taskId}`,

    schema: createTaskSchema,
  }
)

export const getTasks = tool(
  async (input) => {
    try {
      const { projectId, memberId, ...filters } = input

      const tasks = await taskService.getTasks(
        projectId,
        memberId,
        filters as GetTasksQuery
      )

      if (!tasks.length) {
        return JSON.stringify({
          success: true,
          message: 'No tasks found for the given filters.',
          tasks: [],
        })
      }

      const totalTasks = await taskService.getTaskNumber(input.projectId)

      const markdownTable = [
        `### 📋 Task List for Project: ${projectId}`,
        '',
        '| # | Title | Priority | Status | Due Date | Link | Creator |',
        '|---|--------|----------|--------|-----------|------|------|',
        ...tasks.map((task: any, index: number) => {
          const link = `${ENV.FRONTEND_URL}/dashboard/workspace/${projectId}/tasks/${task._id}`
          return `| ${index + 1} | ${task.title} | ${task.priority} | ${task.status} | ${new Date(
            task.dueDate
          ).toLocaleDateString()} | [Open Task](${link}) | ${task.creator.fullName} |`
        }),
      ].join('\n')

      return JSON.stringify({
        success: true,
        message: `Fetched ${tasks.length} task(s) successfully.`,
        total: totalTasks,
        currentPage: filters.page,
        totalPages: Math.ceil(totalTasks / filters.limit),
        markdown: markdownTable,
      })
    } catch (error) {
      return JSON.stringify({
        success: false,
        message: 'Failed to fetch tasks.',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  },
  {
    name: 'tasks_list',
    description: `
Retrieve tasks from a specific project with filters such as title, priority, status, and assignment.

**Required Fields**
| Field | Type | Description |
|-------|------|-------------|
| projectId | string | MongoDB ObjectId of the project. |
| memberId | string | MongoDB ObjectId of the member making the request. |

**Optional Filters**
| Field | Type | Description |
|-------|------|-------------|
| title | string | Search tasks by title (case-insensitive). |
| priority | 'Low' \| 'Medium' \| 'High' | Filter by task priority. |
| status | 'Todo' \| 'In Progress' \| 'Under Review' \| 'Completed' | Filter by task status. |
| createdByMe | boolean | Show only tasks created by the requester. |
| assignedToMe | boolean | Show only tasks assigned to the requester. |
| sortByCreated | boolean | Sort by creation date (true = ascending). |
| page | number | Page number for pagination (default: 1). |
| limit | number | Number of tasks per page (default: 10). |

**Response**
| Field | Description |
|-------|--------------|
| success | Whether the operation succeeded. |
| message | Human-readable message. |
| total | Total number of matching tasks. |
| currentPage | Current page number. |
| totalPages | Total pages based on pagination. |
| markdown | A markdown-formatted task table ready for rendering. |

**Example Task Link**
${ENV.FRONTEND_URL}/dashboard/workspace/{projectId}/tasks/{taskId}`,

    schema: getTasksSchema,
  }
)
