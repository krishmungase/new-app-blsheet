import express from 'express'
import { IssueController } from '../../controllers'
import {
  CommentService,
  IssueService,
  MailgenService,
  MemberService,
  NotificationService,
  ProjectService,
} from '../../services'
import {
  CommentModel,
  IssueModel,
  IssueModelType,
  MemberModel,
  MemberModelType,
  ProjectModel,
} from '../../models'
import { logger } from '../../logger'
import { asyncHandler } from '../../utils'
import { validate, verifyJWT } from '../../middlewares'
import {
  assignMemberValidator,
  getIssueQueryValidator,
  getIssuesValidator,
  issueValidator,
  updateIssueValidator,
  validateIssueId,
  projectIdValidator,
  statusValidator,
  addCommentValidator,
  removeCommentValidator,
  validateCommentId,
} from '../../validators/project/issue.validators'
import { projectIdQueryValidator } from '../../validators/project/project.validators'

const issueRoutes = express.Router()

const issueService = new IssueService(IssueModel as unknown as IssueModelType)
const projectService = new ProjectService(ProjectModel)
const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const commentService = new CommentService(CommentModel)
const notificationService = new NotificationService()
const mailgenService = new MailgenService()

const issueController = new IssueController(
  issueService,
  projectService,
  memberService,
  commentService,
  notificationService,
  mailgenService,
  logger
)

issueRoutes.get(
  '/getIssue',
  verifyJWT,
  getIssueQueryValidator,
  validate,
  asyncHandler((req, res) => issueController.getIssue(req, res))
)

issueRoutes.post(
  '/createIssue',
  verifyJWT,
  issueValidator,
  validate,
  asyncHandler((req, res) => issueController.createIssue(req, res))
)

issueRoutes.patch(
  '/updateIssue',
  verifyJWT,
  updateIssueValidator,
  validate,
  asyncHandler((req, res) => issueController.updateIssue(req, res))
)

issueRoutes.get(
  '/getIssues',
  verifyJWT,
  getIssuesValidator,
  projectIdQueryValidator,
  validate,
  asyncHandler((req, res) => issueController.getIssues(req, res))
)

issueRoutes.delete(
  '/deleteIssue',
  verifyJWT,
  [...projectIdValidator, ...validateIssueId],
  validate,
  asyncHandler((req, res) => issueController.deleteIssue(req, res))
)

issueRoutes.post(
  '/assignMember',
  verifyJWT,
  assignMemberValidator,
  validate,
  asyncHandler((req, res) => issueController.assignMember(req, res))
)

issueRoutes.delete(
  '/removeAssignedMember',
  verifyJWT,
  assignMemberValidator,
  validate,
  asyncHandler((req, res) => issueController.removeAssignedMember(req, res))
)

issueRoutes.patch(
  '/changeStatus',
  verifyJWT,
  [...validateIssueId, ...statusValidator],
  validate,
  asyncHandler((req, res) => issueController.changeStatus(req, res))
)

issueRoutes.post(
  '/addComment',
  verifyJWT,
  addCommentValidator,
  validate,
  asyncHandler((req, res) => issueController.addComment(req, res))
)

issueRoutes.delete(
  '/removeComment',
  verifyJWT,
  removeCommentValidator,
  validate,
  asyncHandler((req, res) => issueController.removeComment(req, res))
)

issueRoutes.patch(
  '/updateComment',
  verifyJWT,
  addCommentValidator,
  validateCommentId,
  validate,
  asyncHandler((req, res) => issueController.updateComment(req, res))
)

export default issueRoutes
