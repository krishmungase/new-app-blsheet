import mongoose, { PipelineStage } from 'mongoose'
import { TeamModelType } from '../../models'
import { GetTeamsQuery, Team } from '../../types/projects/team.types'
import { getMongoosePaginationOptions } from '../../utils'

class TeamService {
  constructor(private teamModel: TeamModelType) {}

  async getTeamById(teamId: string) {
    return await this.teamModel.findById(teamId)
  }

  async createTeam(team: Partial<Team>) {
    return this.teamModel.create(team)
  }

  async updateTeam(teamId: string, team: Partial<Team>) {
    return await this.teamModel.findByIdAndUpdate(teamId, team, {
      new: true,
    })
  }

  async addTeamMember(teamId: string, memberId: string) {
    return await this.teamModel.findByIdAndUpdate(
      teamId,
      { $push: { members: memberId } },
      { new: true }
    )
  }

  async removeTeamMember(teamId: string, memberId: string) {
    return await this.teamModel.findByIdAndUpdate(
      teamId,
      { $pull: { members: memberId } },
      { new: true }
    )
  }

  async deleteTeam(teamId: string) {
    return await this.teamModel.findByIdAndDelete(teamId)
  }

  async getTeamsByProjectId(projectId: string) {
    return await this.teamModel.find({ projectId })
  }

  async getTeamsWithMembers({ projectId, page, limit, name }: GetTeamsQuery) {
    const searchQuery = new RegExp(name, 'i')
    const pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          name: { $regex: searchQuery },
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'leader',
          foreignField: '_id',
          as: 'leader',
        },
      },
      { $unwind: { path: '$leader', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'leader.userId',
          foreignField: '_id',
          as: 'leader.user',
        },
      },
      { $unwind: { path: '$leader.user', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'members',
          localField: 'members',
          foreignField: '_id',
          as: 'memberDetails',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'memberDetails.userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $addFields: {
          members: {
            $map: {
              input: '$memberDetails',
              as: 'member',
              in: {
                _id: '$$member._id',
                email: '$$member.email',
                role: '$$member.role',
                invitationStatus: '$$member.invitationStatus',
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$userDetails',
                        as: 'user',
                        cond: { $eq: ['$$user._id', '$$member.userId'] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          name: 1,
          _id: 1,
          leader: {
            email: 1,
            role: 1,
            _id: 1,
            user: {
              fullName: 1,
              avatar: 1,
            },
          },
          'members._id': 1,
          'members.email': 1,
          'members.role': 1,
          'members.user.avatar': 1,
          'members.user.fullName': 1,
        },
      },
    ]

    const teams = await this.teamModel.aggregatePaginate(
      this.teamModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'teams',
        },
      })
    )

    return teams
  }

  async getTeamByIdWithMembers(teamId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: { _id: new mongoose.Types.ObjectId(teamId) },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'leader',
          foreignField: '_id',
          as: 'leader',
        },
      },
      { $unwind: { path: '$leader', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'leader.userId',
          foreignField: '_id',
          as: 'leader.user',
        },
      },
      { $unwind: { path: '$leader.user', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'members',
          localField: 'members',
          foreignField: '_id',
          as: 'membersDetails',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'membersDetails.userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $addFields: {
          members: {
            $map: {
              input: '$membersDetails',
              as: 'member',
              in: {
                _id: '$$member._id',
                email: '$$member.email',
                role: '$$member.role',
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$userDetails',
                        as: 'user',
                        cond: { $eq: ['$$user._id', '$$member.userId'] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
          memberCount: { $size: '$membersDetails' },
        },
      },
      {
        $project: {
          name: 1,
          'members.email': 1,
          'members._id': 1,
          'members.role': 1,
          'members.user.fullName': 1,
          'members.user.avatar': 1,
          'leader.email': 1,
          'leader._id': 1,
          'leader.role': 1,
          'leader.user.fullName': 1,
          'leader.user.avatar': 1,
          memberCount: 1,
        },
      },
    ]

    const team = await this.teamModel.aggregate(pipeline)
    if (team.length > 0) return team[0]
    return []
  }

  async addOrRemoveTeamLeader(
    teamId: string,
    memberId: string,
    isRemove: boolean
  ) {
    if (isRemove) {
      return await this.teamModel.findByIdAndUpdate(
        teamId,
        { $unset: { leader: memberId } },
        { new: true }
      )
    } else {
      return await this.teamModel.findByIdAndUpdate(
        teamId,
        { leader: memberId },
        { new: true }
      )
    }
  }

  async findByNameAndProjectId(projectId: string, name: string) {
    return await this.teamModel.findOne({ projectId, name })
  }
}

export default TeamService
