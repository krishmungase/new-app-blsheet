import express from 'express'

import { asyncHandler } from '../../utils'
import { validate, verifyJWT } from '../../middlewares'
import { DocumentController } from '../../controllers'
import {
  CommentService,
  DocumentService,
  MailgenService,
  MemberService,
  NotificationService,
  ProjectService,
} from '../../services'
import {
  CommentModel,
  DocumentModel,
  DocumentModelType,
  MemberModel,
  MemberModelType,
  ProjectModel,
} from '../../models'
import { logger } from '../../logger'
import {
  assignOrMemberValidator,
  docIdQueryValidator,
  docIdValidator,
  documentValidator,
  getDocsValidator,
} from '../../validators/project/document.validators'
import { validateProjectIdQuery } from '../../validators/project/issue.validators'
import { projectIdBodyValidator } from '../../validators/project/project.validators'

const documentRoutes = express.Router()

const documentService = new DocumentService(
  DocumentModel as unknown as DocumentModelType
)
const projectService = new ProjectService(ProjectModel)
const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const notificationService = new NotificationService()
const mailgenService = new MailgenService()
const commentService = new CommentService(CommentModel)
const documentController = new DocumentController(
  documentService,
  projectService,
  memberService,
  commentService,
  notificationService,
  mailgenService,
  logger
)

documentRoutes
  .route('/')
  .get(
    verifyJWT,
    validateProjectIdQuery,
    getDocsValidator,
    validate,
    asyncHandler((req, res) => documentController.getDocuments(req, res))
  )
  .post(
    verifyJWT,
    documentValidator,
    validate,
    asyncHandler((req, res) => documentController.createDocument(req, res))
  )
  .patch(
    verifyJWT,
    docIdValidator,
    projectIdBodyValidator,
    validate,
    asyncHandler((req, res) => documentController.updateDocument(req, res))
  )
  .delete(
    verifyJWT,
    validate,
    docIdValidator,
    projectIdBodyValidator,
    asyncHandler((req, res) => documentController.deleteDocument(req, res))
  )

documentRoutes.get(
  '/getDocument',
  verifyJWT,
  validateProjectIdQuery,
  docIdQueryValidator,
  validate,
  asyncHandler((req, res) => documentController.getDocument(req, res))
)

documentRoutes
  .route('/assign')
  .post(
    verifyJWT,
    assignOrMemberValidator,
    validate,
    asyncHandler((req, res) => documentController.assignMember(req, res))
  )
  .delete(
    verifyJWT,
    assignOrMemberValidator,
    validate,
    asyncHandler((req, res) => documentController.removeMember(req, res))
  )

export default documentRoutes
