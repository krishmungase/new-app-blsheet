import { Router } from 'express'

import { logger } from '../../logger'
import { asyncHandler } from '../../utils'
import { LLMController } from '../../controllers'
import { MemberModel, ProjectModel, MemberModelType } from '../../models'
import { MemberService, ProjectService } from '../../services'
import { verifyProjectSecret } from '../../middlewares/auth.middlewares'

const llmRoutes = Router()
const projectService = new ProjectService(ProjectModel)
const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const llmController = new LLMController(projectService, memberService, logger)

llmRoutes.post(
  '/stream',
  verifyProjectSecret,
  asyncHandler((req, res) => llmController.responseWithStream(req, res))
)

llmRoutes.post(
  '/response',
  verifyProjectSecret,
  asyncHandler((req, res) => llmController.response(req, res))
)

llmRoutes.route('/project').get(
  verifyProjectSecret,
  asyncHandler((req, res) => llmController.getProjectList(req, res))
)

export default llmRoutes
