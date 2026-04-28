import express from 'express'

import { logger } from '../../logger'
import { asyncHandler } from '../../utils'
import { TeamController } from '../../controllers'
import { verifyJWT, validate } from '../../middlewares'
import {
  MailgenService,
  MemberService,
  NotificationService,
  ProjectService,
  TeamService,
} from '../../services'
import {
  MemberModel,
  MemberModelType,
  ProjectModel,
  TeamModel,
  TeamModelType,
} from '../../models'
import { validateProjectIdQuery } from '../../validators/project/issue.validators'
import {
  addOrRemoveTeamLeaderValidator,
  addOrRemoveTeamMemberValidator,
  deleteTeamValidator,
  getTeamQueryValidator,
  getTeamsQueryValidator,
  teamValidator,
  updateTeamValidator,
} from '../../validators/project/team.validators'

const teamRoutes = express.Router()

const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const projectService = new ProjectService(ProjectModel)
const notificationService = new NotificationService()
const mailgenService = new MailgenService()
const teamService = new TeamService(TeamModel as unknown as TeamModelType)
const teamController = new TeamController(
  teamService,
  projectService,
  memberService,
  notificationService,
  mailgenService,
  logger
)

teamRoutes
  .route('/')
  .get(
    verifyJWT,
    validateProjectIdQuery,
    getTeamsQueryValidator,
    validate,
    asyncHandler((req, res) => teamController.getTeams(req, res))
  )
  .post(
    verifyJWT,
    teamValidator,
    validate,
    asyncHandler((req, res) => teamController.createTeam(req, res))
  )
  .patch(
    verifyJWT,
    updateTeamValidator,
    validate,
    asyncHandler((req, res) => teamController.updateTeam(req, res))
  )
  .delete(
    verifyJWT,
    deleteTeamValidator,
    validate,
    asyncHandler((req, res) => teamController.deleteTeam(req, res))
  )
  .put(
    verifyJWT,
    addOrRemoveTeamMemberValidator,
    validate,
    asyncHandler((req, res) => teamController.addOrRemoveTeamMember(req, res))
  )

teamRoutes.get(
  '/getTeam',
  verifyJWT,
  getTeamQueryValidator,
  validate,
  asyncHandler((req, res) => teamController.getTeam(req, res))
)

teamRoutes.route('/leader').put(
  verifyJWT,
  addOrRemoveTeamLeaderValidator,
  validate,
  asyncHandler((req, res) => teamController.addOrRemoveTeamLeader(req, res))
)

export default teamRoutes
