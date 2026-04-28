import express from 'express'

import { logger } from '../../logger'
import { asyncHandler } from '../../utils'
import { ProjectController } from '../../controllers'
import { validate, verifyJWT } from '../../middlewares'
import {
  MemberModel,
  ProjectModel,
  UserModel,
  MemberModelType,
  LableModel,
  LableModelType,
} from '../../models'
import {
  projectIdBodyValidator,
  projectIdQueryValidator,
  projectIdValidator,
  projectValidator,
  validateOpenAIKey,
} from '../../validators/project/project.validators'
import {
  LableService,
  MemberService,
  ProjectService,
  UserService,
} from '../../services'

const projectRoutes = express.Router()
const userService = new UserService(UserModel)
const projectService = new ProjectService(ProjectModel)
const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const labelService = new LableService(LableModel as unknown as LableModelType)

const projectController = new ProjectController(
  userService,
  projectService,
  memberService,
  labelService,
  logger
)

projectRoutes.get(
  '/getProject',
  verifyJWT,
  projectIdQueryValidator,
  validate,
  asyncHandler((req, res) => projectController.getProject(req, res))
)

projectRoutes.post(
  '/createProject',
  verifyJWT,
  projectValidator,
  validate,
  asyncHandler((req, res) => projectController.createProject(req, res))
)

projectRoutes.patch(
  '/updateProject',
  verifyJWT,
  projectValidator,
  projectIdValidator,
  validate,
  asyncHandler((req, res) => projectController.updateProject(req, res))
)

projectRoutes.delete(
  '/deleteProject',
  verifyJWT,
  projectIdValidator,
  validate,
  asyncHandler((req, res) => projectController.deleteProject(req, res))
)

projectRoutes.get(
  '/getProjects',
  verifyJWT,
  asyncHandler((req, res) => projectController.getProjects(req, res))
)

projectRoutes.patch(
  '/updateOpenAIKey',
  verifyJWT,
  validateOpenAIKey,
  validate,
  asyncHandler((req, res) => projectController.updateOpenAIKey(req, res))
)

projectRoutes.delete(
  '/removeOpenAIKey',
  verifyJWT,
  projectIdBodyValidator,
  validate,
  asyncHandler((req, res) => projectController.removeOpenAIKey(req, res))
)

export default projectRoutes
