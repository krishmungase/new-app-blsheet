import express from 'express'

import { asyncHandler } from '../../utils'
import { TaskController } from '../../controllers'
import { validate, verifyJWT } from '../../middlewares'
import {
  addCommentValidator,
  assignMemberValidator,
  getTaskQueryValidator,
  getTasksValidator,
  removeCommentValidator,
  statusValidator,
  taskValidator,
  updateTaskValidator,
  validateCommentId,
  validateProjectIdQuery,
  validateTaskId,
} from '../../validators/project/task.validators'
import {
  CommentService,
  MailgenService,
  MemberService,
  NotificationService,
  ProjectService,
  TaskService,
} from '../../services'
import {
  CommentModel,
  MemberModel,
  MemberModelType,
  ProjectModel,
  TaskModel,
  TaskModelType,
} from '../../models'
import { logger } from '../../logger'

const taskRoutes = express.Router()
const taskService = new TaskService(TaskModel as unknown as TaskModelType)
const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const notificationService = new NotificationService()
const mailgenService = new MailgenService()
const projectService = new ProjectService(ProjectModel)
const commentService = new CommentService(CommentModel)
const taskController = new TaskController(
  projectService,
  taskService,
  memberService,
  commentService,
  notificationService,
  mailgenService,
  logger
)

taskRoutes.post(
  '/createTask',
  verifyJWT,
  taskValidator,
  validate,
  asyncHandler((req, res) => taskController.createTask(req, res))
)

taskRoutes.patch(
  '/updateTask',
  verifyJWT,
  updateTaskValidator,
  validate,
  asyncHandler((req, res) => taskController.updateTask(req, res))
)

taskRoutes.delete(
  '/deleteTask',
  verifyJWT,
  validateTaskId,
  validate,
  asyncHandler((req, res) => taskController.deleteTask(req, res))
)

taskRoutes.get(
  '/getTasks',
  verifyJWT,
  validateProjectIdQuery,
  getTasksValidator,
  validate,
  asyncHandler((req, res) => taskController.getTasks(req, res))
)

taskRoutes.post(
  '/assignMember',
  verifyJWT,
  assignMemberValidator,
  validate,
  asyncHandler((req, res) => taskController.assignMember(req, res))
)

taskRoutes.post(
  '/removeAssignedMember',
  verifyJWT,
  assignMemberValidator,
  validate,
  asyncHandler((req, res) => taskController.removeAssignedMember(req, res))
)

taskRoutes.get(
  '/getTask',
  verifyJWT,
  getTaskQueryValidator,
  validate,
  asyncHandler((req, res) => taskController.getTask(req, res))
)

taskRoutes.post(
  '/addComment',
  verifyJWT,
  addCommentValidator,
  validate,
  asyncHandler((req, res) => taskController.addComment(req, res))
)

taskRoutes.delete(
  '/removeComment',
  verifyJWT,
  removeCommentValidator,
  validate,
  asyncHandler((req, res) => taskController.removeComment(req, res))
)

taskRoutes.patch(
  '/updateComment',
  verifyJWT,
  addCommentValidator,
  validateCommentId,
  validate,
  asyncHandler((req, res) => taskController.updateComment(req, res))
)

taskRoutes.patch(
  '/changeStatus',
  verifyJWT,
  [...validateTaskId, ...statusValidator],
  validate,
  asyncHandler((req, res) => taskController.changeStatus(req, res))
)

taskRoutes.get(
  '/getLast30DaysTasks',
  verifyJWT,
  asyncHandler((req, res) => taskController.getLast30DaysTasks(req, res))
)

taskRoutes.get(
  '/getUserAssignedTasks',
  verifyJWT,
  asyncHandler((req, res) => taskController.getUserAssignedTasks(req, res))
)

taskRoutes.get(
  '/getCompletedTasks',
  verifyJWT,
  validateProjectIdQuery,
  getTasksValidator,
  validate,
  asyncHandler((req, res) => taskController.getCompletedTasks(req, res))
)

taskRoutes.get(
  '/getMembersCompletedTasks',
  verifyJWT,
  validateProjectIdQuery,
  validate,
  asyncHandler((req, res) => taskController.getMembersCompletedTasks(req, res))
)

export default taskRoutes
