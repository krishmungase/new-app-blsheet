import express from 'express'
import {
  AssessmentCategoryController,
  AssessmentCategoryQuestionController,
  AssessmentController,
  AssessmentResponseController,
} from '../../controllers'
import {
  AssessmentCategoryQuestionService,
  AssessmentCategoryResponseService,
  AssessmentCategoryService,
  AssessmentResponseService,
  AssessmentService,
  MemberService,
  ProjectService,
} from '../../services'
import {
  AssessmentCategoryModel,
  AssessmentCategoryQuestionModel,
  AssessmentCategoryResponseModel,
  AssessmentModel,
  AssessmentModelType,
  AssessmentResponseModel,
  AssessmentResponseModelType,
  MemberModel,
  MemberModelType,
  ProjectModel,
} from '../../models'
import { logger } from '../../logger'
import { asyncHandler } from '../../utils'
import { validate, verifyJWT } from '../../middlewares'
import {
  assessmentIdBodyValidator,
  assessmentIdQueryValidator,
  assessmentResponseIdBodyValidator,
  assessmentResponseIdQueryValidator,
  categoryIdBodyValidator,
  categoryIdQueryValidator,
  createAssessmentValidator,
  createCategoryValidator,
  createQuestionValidator,
  getAssessmentsValidator,
  getAssessmentValidator,
  getCategoryValidator,
  publishAssessmentBodyValidator,
  questionIdBodyValidator,
  questionIdQueryValidator,
} from '../../validators/project/assessment.validators'
import {
  projectIdBodyValidator,
  projectIdQueryValidator,
} from '../../validators/project/project.validators'
import { memberIdValidator } from '../../validators/project/team.validators'

const assessmentRoutes = express.Router()

const assessmentService = new AssessmentService(
  AssessmentModel as unknown as AssessmentModelType
)
const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const projectService = new ProjectService(ProjectModel)
const assessmentResponseService = new AssessmentResponseService(
  AssessmentResponseModel as unknown as AssessmentResponseModelType
)
const assessmentCategoryResponseService = new AssessmentCategoryResponseService(
  AssessmentCategoryResponseModel
)

const assessmentController = new AssessmentController(
  assessmentService,
  projectService,
  memberService,
  assessmentResponseService,
  assessmentCategoryResponseService,
  logger
)

const assessmentCategoryService = new AssessmentCategoryService(
  AssessmentCategoryModel
)

const categoryController = new AssessmentCategoryController(
  assessmentService,
  assessmentCategoryService,
  projectService,
  memberService,
  logger
)
const assessmentCategoryQuestionService = new AssessmentCategoryQuestionService(
  AssessmentCategoryQuestionModel
)

const questionController = new AssessmentCategoryQuestionController(
  assessmentService,
  assessmentCategoryQuestionService,
  assessmentCategoryService,
  projectService,
  memberService,
  logger
)

const assessmentResponseController = new AssessmentResponseController(
  assessmentResponseService,
  projectService,
  memberService,
  logger
)

assessmentRoutes
  .route('/category/question')
  .post(
    verifyJWT,
    createQuestionValidator,
    validate,
    asyncHandler((req, res) => questionController.create(req, res))
  )
  .get(
    verifyJWT,
    questionIdQueryValidator,
    categoryIdQueryValidator,
    projectIdQueryValidator,
    validate,
    asyncHandler((req, res) => questionController.get(req, res))
  )
  .put(
    verifyJWT,
    questionIdBodyValidator,
    categoryIdBodyValidator,
    projectIdBodyValidator,
    validate,
    asyncHandler((req, res) => questionController.update(req, res))
  )
  .delete(
    verifyJWT,
    questionIdBodyValidator,
    categoryIdBodyValidator,
    projectIdBodyValidator,
    validate,
    asyncHandler((req, res) => questionController.delete(req, res))
  )

assessmentRoutes
  .route('/response')
  .post(
    verifyJWT,
    assessmentResponseIdBodyValidator,
    projectIdBodyValidator,
    validate,
    asyncHandler((req, res) =>
      assessmentResponseController.startAssessment(req, res)
    )
  )
  .put(
    verifyJWT,
    assessmentResponseIdBodyValidator,
    projectIdBodyValidator,
    validate,
    asyncHandler((req, res) =>
      assessmentResponseController.submitAssessment(req, res)
    )
  )

assessmentRoutes
  .route('/category')
  .post(
    verifyJWT,
    createCategoryValidator,
    validate,
    asyncHandler((req, res) => categoryController.create(req, res))
  )
  .get(
    verifyJWT,
    getCategoryValidator,
    validate,
    asyncHandler((req, res) => categoryController.get(req, res))
  )
  .put(
    verifyJWT,
    categoryIdBodyValidator,
    projectIdBodyValidator,
    validate,
    asyncHandler((req, res) => categoryController.update(req, res))
  )
  .delete(
    verifyJWT,
    categoryIdBodyValidator,
    projectIdBodyValidator,
    validate,
    asyncHandler((req, res) => categoryController.delete(req, res))
  )

assessmentRoutes.route('/publish').post(
  verifyJWT,
  publishAssessmentBodyValidator,
  validate,
  asyncHandler((req, res) => assessmentController.publishAssessment(req, res))
)

assessmentRoutes.get(
  '/getAssignedAssessments',
  verifyJWT,
  getAssessmentsValidator,
  validate,
  asyncHandler((req, res) =>
    assessmentController.getAssignedAssessments(req, res)
  )
)

assessmentRoutes.get(
  '/getAssessments',
  verifyJWT,
  getAssessmentsValidator,
  validate,
  asyncHandler((req, res) => assessmentController.getAssessments(req, res))
)

assessmentRoutes.post(
  '/assignOrRemoveMember',
  verifyJWT,
  assessmentIdBodyValidator,
  memberIdValidator,
  projectIdBodyValidator,
  validate,
  asyncHandler((req, res) =>
    assessmentController.assignOrRemoveMember(req, res)
  )
)

assessmentRoutes.route('/assigned').get(
  verifyJWT,
  projectIdQueryValidator,
  assessmentResponseIdQueryValidator,
  validate,
  asyncHandler((req, res) =>
    assessmentController.getAssignedAssessment(req, res)
  )
)

assessmentRoutes
  .route('/')
  .post(
    verifyJWT,
    createAssessmentValidator,
    validate,
    asyncHandler((req, res) => assessmentController.create(req, res))
  )
  .get(
    verifyJWT,
    getAssessmentValidator,
    validate,
    asyncHandler((req, res) => assessmentController.get(req, res))
  )
  .put(
    verifyJWT,
    assessmentIdBodyValidator,
    projectIdBodyValidator,
    validate,
    asyncHandler((req, res) => assessmentController.update(req, res))
  )
  .delete(
    verifyJWT,
    assessmentIdBodyValidator,
    projectIdBodyValidator,
    validate,
    asyncHandler((req, res) => assessmentController.delete(req, res))
  )

export default assessmentRoutes
