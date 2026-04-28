import { Response } from 'express'
import { Logger } from 'winston'

import { MSG } from '../../constants'
import {
  MailgenService,
  MemberService,
  NotificationService,
  ProjectService,
  TeamService,
} from '../../services'
import { ApiError, ApiResponse } from '../../utils'
import { CustomRequest } from '../../types/shared/shared.types'
import {
  Team,
  GetTeamsQuery,
  AddOrRemoveTeamLeaderBody,
} from '../../types/projects/team.types'
import { MemberRole } from '../../types/projects/member.types'
import { ObjectId } from 'mongoose'

class TeamController {
  constructor(
    private teamService: TeamService,
    private projectService: ProjectService,
    private memberService: MemberService,
    private notificationService: NotificationService,
    private mailgenService: MailgenService,
    private logger: Logger
  ) {}

  async getTeams(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string

    const query = req.query as unknown as GetTeamsQuery
    const { projectId } = query

    this.logger.info({
      msg: MSG.TEAM.GET_TEAMS,
      data: { userId },
    })

    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const isMember = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!isMember) throw new ApiError(404, 'Member not found')

    const teams = await this.teamService.getTeamsWithMembers(query)

    return res
      .status(200)
      .json(new ApiResponse(200, teams, 'Teams fetched successfully'))
  }

  async createTeam(req: CustomRequest<Team>, res: Response) {
    const userId = req.user?._id as string
    const { projectId, name } = req.body

    this.logger.info({
      msg: MSG.TEAM.CREATE_TEAMS,
      data: { userId, name, projectId },
    })

    const project = await this.projectService.getProjectById(
      projectId as unknown as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permissions for create team')

    const isExistName = await this.teamService.findByNameAndProjectId(
      projectId as unknown as string,
      name
    )
    if (isExistName) throw new ApiError(400, 'Team name already exists')

    const team = await this.teamService.createTeam({
      projectId,
      name,
      members: [],
    })

    return res
      .status(200)
      .json(new ApiResponse(200, { team }, 'Team created successfully'))
  }

  async updateTeam(
    req: CustomRequest<Team & { teamId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { projectId, name, teamId } = req.body

    this.logger.info({
      msg: MSG.TEAM.UPDATE_TEAMS,
      data: { userId, teamId },
    })

    const project = await this.projectService.getProjectById(
      projectId as unknown as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permissions for update team')

    const team = await this.teamService.getTeamById(teamId)
    if (!team) throw new ApiError(404, 'Team not found')

    const updatedTeam = await this.teamService.updateTeam(teamId, { name })

    return res
      .status(200)
      .json(
        new ApiResponse(200, { team: updatedTeam }, 'Team updated successfully')
      )
  }

  async deleteTeam(
    req: CustomRequest<{ projectId: string; teamId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { projectId, teamId } = req.body

    this.logger.info({
      msg: MSG.TEAM.DELETE_TEAM,
      data: { userId, teamId },
    })

    const project = await this.projectService.getProjectById(
      projectId as unknown as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permissions for delete team')

    const team = await this.teamService.getTeamById(teamId)
    if (!team) throw new ApiError(404, 'Team not found')

    await this.teamService.deleteTeam(teamId)

    return res
      .status(200)
      .json(new ApiResponse(200, { teamId }, 'Team deleted successfully'))
  }

  async addOrRemoveTeamMember(
    req: CustomRequest<{
      projectId: string
      teamId: string
      memberId: string
      isRemove?: boolean
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { teamId, memberId, projectId, isRemove } = req.body

    this.logger.info({
      msg: MSG.TEAM.ADD_TEAM_MEMBER,
      data: { userId, teamId, memberId, projectId },
    })

    const team = await this.teamService.getTeamById(teamId)
    if (!team) throw new ApiError(404, 'Team not found')

    const member = await this.memberService.getMemberById(memberId)
    if (!member) throw new ApiError(404, 'Member not found')

    const userMember = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!userMember || userMember.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permission to add member')

    if (isRemove) {
      if (!team.members.includes(member._id))
        throw new ApiError(409, 'Member not exists in the team')
      this.teamService.removeTeamMember(teamId, memberId)
    } else {
      if (team.members.includes(member._id))
        throw new ApiError(409, 'Member already exists in the team')
      await this.teamService.addTeamMember(teamId, memberId)
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { teamId, ...(isRemove && { memberId }) },
          `Team member ${isRemove ? 'removed' : 'added'} successfully`
        )
      )
  }

  async getTeam(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { teamId, projectId } = req.query as unknown as GetTeamsQuery

    this.logger.info({
      msg: MSG.TEAM.GET_TEAM,
      data: { userId, teamId, projectId },
    })

    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const team = await this.teamService.getTeamByIdWithMembers(teamId)

    return res
      .status(200)
      .json(new ApiResponse(200, team, 'Team fetched successfully'))
  }

  async addOrRemoveTeamLeader(
    req: CustomRequest<AddOrRemoveTeamLeaderBody>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { teamId, projectId, memberId, isRemove } = req.body

    this.logger.info({
      msg: MSG.TEAM.ADD_OR_REMOVE_TEAM_LEADER,
      data: { userId, teamId, memberId, projectId },
    })

    const team = await this.teamService.getTeamById(teamId)
    if (!team) throw new ApiError(404, 'Team not found')

    const member = await this.memberService.getMemberById(memberId)
    if (!member) throw new ApiError(404, 'Member not found')

    const userMember = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!userMember || userMember.role === MemberRole.MEMBER)
      throw new ApiError(404, 'You have no permission to add member')

    if (isRemove) {
      if (team.leader?.toString() !== memberId)
        throw new ApiError(409, 'Member is not the leader')
    } else {
      if (!team.members.includes(memberId as unknown as ObjectId))
        throw new ApiError(409, 'Member is not in the team')
    }

    await this.teamService.addOrRemoveTeamLeader(teamId, memberId, isRemove)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { teamId, memberId, isRemove },
          `Team leader ${isRemove ? 'removed' : 'added'} successfully`
        )
      )
  }
}

export default TeamController
