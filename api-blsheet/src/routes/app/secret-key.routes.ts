import { Router } from 'express'

import { logger } from '../../logger'
import { asyncHandler } from '../../utils'
import { verifyJWT } from '../../middlewares'
import { SecretKeyController } from '../../controllers'
import { ProjectModel, SecretKeyModel } from '../../models'
import { ProjectService, SecretKeyService } from '../../services'

const secretKeyRoutes = Router()
const secretKeyService = new SecretKeyService(SecretKeyModel)
const projectService = new ProjectService(ProjectModel)
const secretKeyController = new SecretKeyController(
  secretKeyService,
  projectService,
  logger
)

secretKeyRoutes
  .route('/')
  .get(
    verifyJWT,
    asyncHandler((req, res) => secretKeyController.get(req, res))
  )
  .delete(
    verifyJWT,
    asyncHandler((req, res) => secretKeyController.delete(req, res))
  )
  .post(
    verifyJWT,
    asyncHandler((req, res) => secretKeyController.create(req, res))
  )
  .put(
    verifyJWT,
    asyncHandler((req, res) => secretKeyController.update(req, res))
  )

export default secretKeyRoutes
