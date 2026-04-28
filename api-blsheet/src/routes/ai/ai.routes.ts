import express from 'express'

import { asyncHandler } from '../../utils'
import { ProjectModel } from '../../models'
import { ProjectService } from '../../services'
import { AIController } from '../../controllers'
import { validate, verifyJWT } from '../../middlewares'
import { aiBodyValidator } from '../../validators/ai/ai.validators'

const aiRoutes = express.Router()
const projectService = new ProjectService(ProjectModel)
const aiController = new AIController(projectService)

aiRoutes.post(
  '/generateTask',
  verifyJWT,
  aiBodyValidator,
  validate,
  asyncHandler((req, res) => aiController.generateTask(req, res))
)

export default aiRoutes
