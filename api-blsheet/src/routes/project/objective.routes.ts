import express from 'express'
import {
  KeyResultModel,
  KeyResultModelType,
  MemberModel,
  MemberModelType,
  ObjectiveModel,
  ObjectiveModelType,
  ProjectModel,
  TimeFrameModel,
  TimeFrameModelType,
} from '../../models'
import { logger } from '../../logger'
import { asyncHandler } from '../../utils'
import {
  KeyResultController,
  ObjectiveController,
  TimeFrameController,
} from '../../controllers'
import { validate, verifyJWT } from '../../middlewares'
import {
  KeyResultService,
  MemberService,
  ObjectiveService,
  ProjectService,
  TimeFrameService,
} from '../../services'

const objectiveRoutes = express.Router()

const timeFrameService = new TimeFrameService(
  TimeFrameModel as unknown as TimeFrameModelType
)
const projectService = new ProjectService(ProjectModel)
const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const objectiveService = new ObjectiveService(
  ObjectiveModel as unknown as ObjectiveModelType
)
const keyResultService = new KeyResultService(
  KeyResultModel as unknown as KeyResultModelType
)
const timeFrameController = new TimeFrameController(
  timeFrameService,
  memberService,
  projectService,
  logger
)
const objectiveController = new ObjectiveController(
  objectiveService,
  timeFrameService,
  memberService,
  projectService,
  logger
)
const keyResultController = new KeyResultController(
  keyResultService,
  objectiveService,
  memberService,
  projectService,
  logger
)

objectiveRoutes
  .route('/keyResult')
  .get(
    verifyJWT,
    validate,
    asyncHandler((req, res) => keyResultController.get(req, res))
  )
  .post(
    verifyJWT,
    validate,
    asyncHandler((req, res) => keyResultController.create(req, res))
  )
  .put(
    verifyJWT,
    validate,
    asyncHandler((req, res) => keyResultController.update(req, res))
  )
  .delete(
    verifyJWT,
    validate,
    asyncHandler((req, res) => keyResultController.delete(req, res))
  )

objectiveRoutes
  .route('/objective')
  .get(
    verifyJWT,
    validate,
    asyncHandler((req, res) => objectiveController.get(req, res))
  )
  .post(
    verifyJWT,
    validate,
    asyncHandler((req, res) => objectiveController.create(req, res))
  )
  .put(
    verifyJWT,
    validate,
    asyncHandler((req, res) => objectiveController.update(req, res))
  )
  .delete(
    verifyJWT,
    validate,
    asyncHandler((req, res) => objectiveController.delete(req, res))
  )

objectiveRoutes
  .route('/')
  .get(
    verifyJWT,
    validate,
    asyncHandler((req, res) => timeFrameController.get(req, res))
  )
  .post(
    verifyJWT,
    validate,
    asyncHandler((req, res) => timeFrameController.create(req, res))
  )
  .put(
    verifyJWT,
    validate,
    asyncHandler((req, res) => timeFrameController.update(req, res))
  )
  .delete(
    verifyJWT,
    validate,
    asyncHandler((req, res) => timeFrameController.delete(req, res))
  )

objectiveRoutes.get(
  '/getTimeFrames',
  verifyJWT,
  validate,
  asyncHandler((req, res) => timeFrameController.getTimeFrames(req, res))
)

objectiveRoutes.get(
  '/getObjectives',
  verifyJWT,
  validate,
  asyncHandler((req, res) => objectiveController.getObjectives(req, res))
)

objectiveRoutes.get(
  '/getKeyResults',
  verifyJWT,
  validate,
  asyncHandler((req, res) => keyResultController.getKeyResults(req, res))
)

objectiveRoutes.put(
  '/updateKRCurrentValue',
  verifyJWT,
  validate,
  asyncHandler((req, res) => keyResultController.updateCurrentValue(req, res))
)

export default objectiveRoutes
