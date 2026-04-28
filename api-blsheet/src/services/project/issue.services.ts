import mongoose, { ObjectId, PipelineStage } from 'mongoose'
import { GetIssuesFilters, Issue } from '../../types/projects/issue.types'
import { IssueModelType } from './../../models/project/issue.models'
import { getMongoosePaginationOptions } from '../../utils'
class IssueService {
  constructor(private issueModel: IssueModelType) {}

  async getByIssueId(issueId: string) {
    return await this.issueModel.findById(issueId)
  }

  async getIssue(issueId: string, memberId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(issueId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'closedBy',
          foreignField: '_id',
          as: 'closedBy',
        },
      },
      { $unwind: { path: '$closedBy', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: '_id',
          as: 'member',
        },
      },
      { $unwind: '$member' },
      {
        $lookup: {
          from: 'users',
          localField: 'member.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'members',
          localField: 'assignees',
          foreignField: '_id',
          as: 'membersDetails',
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
              },
            },
          },
          isCreator: {
            $eq: ['$memberId', new mongoose.Types.ObjectId(memberId)],
          },
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'commentsDetails',
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'commentsDetails.memberId',
          foreignField: '_id',
          as: 'commentAuthors',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'commentAuthors.userId',
          foreignField: '_id',
          as: 'commentAuthorsUsers',
        },
      },
      {
        $addFields: {
          comments: {
            $map: {
              input: '$commentsDetails',
              as: 'comment',
              in: {
                _id: '$$comment._id',
                content: '$$comment.content',
                contentType: '$$comment.contentType',
                createdAt: '$$comment.createdAt',
                updatedAt: '$$comment.updatedAt',
                author: {
                  $let: {
                    vars: {
                      authorMember: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$commentAuthors',
                              as: 'author',
                              cond: {
                                $eq: ['$$author._id', '$$comment.memberId'],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      _id: '$$authorMember._id',
                      email: '$$authorMember.email',
                      role: '$$authorMember.role',
                      isAuthor: {
                        $eq: [
                          '$$authorMember._id',
                          new mongoose.Types.ObjectId(memberId),
                        ],
                      },
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$commentAuthorsUsers',
                              as: 'user',
                              cond: {
                                $eq: ['$$user._id', '$$authorMember.userId'],
                              },
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
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          priority: 1,
          isCreator: 1,
          members: 1,
          closedDate: 1,
          closedBy: {
            fullName: 1,
            avatar: 1,
          },
          createdAt: 1,
          updatedAt: 1,
          labels: 1,
          creator: {
            fullName: '$user.fullName',
            email: '$member.email',
            role: '$member.role',
            avatar: '$user.avatar',
          },
          comments: {
            _id: 1,
            content: 1,
            contentType: 1,
            createdAt: 1,
            updatedAt: 1,
            author: {
              role: 1,
              email: 1,
              isAuthor: 1,
              user: {
                fullName: 1,
                avatar: 1,
              },
            },
          },
        },
      },
      {
        $addFields: {
          isMember: {
            $in: [new mongoose.Types.ObjectId(memberId), '$members._id'],
          },
        },
      },
    ]

    const result = await this.issueModel.aggregate(pipeline).exec()
    return result.length > 0 ? result[0] : null
  }

  async createIssue(issue: Issue) {
    return await this.issueModel.create(issue)
  }

  async updateIsse(issueId: string, issue: Partial<Issue>) {
    return await this.issueModel.findByIdAndUpdate(issueId, issue, {
      new: true,
    })
  }

  async getIssues(
    projectId: string,
    memberId: string,
    filters: GetIssuesFilters
  ) {
    const {
      title,
      createdByMe,
      assignedToMe,
      priority,
      status,
      sortByCreated,
      page,
      limit,
    } = filters

    let searchQuery = new RegExp(title, 'i')

    let pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          isDeleted: false,
          ...(createdByMe && {
            memberId: new mongoose.Types.ObjectId(memberId),
          }),
          ...(assignedToMe && { assignees: { $in: [memberId] } }),
          title: { $regex: searchQuery },
          ...(priority && { priority }),
          ...(status && { status }),
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      {
        $lookup: {
          from: 'users',
          localField: 'creator.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'members',
          localField: 'assignees',
          foreignField: '_id',
          as: 'membersDetails',
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
              },
            },
          },
          commentCount: { $size: '$comments' },
        },
      },
      {
        $project: {
          projectId: 1,
          title: 1,
          description: 1,
          status: 1,
          priority: 1,
          dueDate: 1,
          tags: 1,
          completedDate: 1,
          subTasks: 1,
          taskType: 1,
          taskNumber: 1,
          isMember: 1,
          isDeleted: 1,
          commentCount: 1,
          createdAt: 1,
          updatedAt: 1,
          creator: {
            memberId: '$creator._id',
            email: '$creator.email',
            role: '$creator.role',
            fullName: '$user.fullName',
            avatar: '$user.avatar',
          },
          members: 1,
        },
      },
      { $sort: { createdAt: sortByCreated ? 1 : -1 } },
      {
        $addFields: {
          isMember: {
            $in: [new mongoose.Types.ObjectId(memberId), '$members._id'],
          },
        },
      },
    ]

    const issues = await this.issueModel.aggregatePaginate(
      this.issueModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'issues',
        },
      })
    )

    return issues
  }

  async deleteIssue(issueId: string) {
    return this.issueModel.findByIdAndUpdate(
      issueId,
      { isDeleted: true },
      { new: true }
    )
  }

  async checkMemberIsAssigned(issueId: string, memberId: string) {
    const task = await this.issueModel.findById(issueId)
    return task?.assignees.includes(memberId as unknown as ObjectId)
  }

  async assignMember(issueId: string, memberId: string) {
    return this.issueModel.updateOne(
      { _id: issueId },
      { $addToSet: { assignees: new mongoose.Types.ObjectId(memberId) } }
    )
  }

  async removeAssignedMember(issueId: string, memberId: string) {
    return this.issueModel.findByIdAndUpdate(
      issueId,
      { $pull: { assignees: memberId } },
      { new: true }
    )
  }

  async issueCounts(projectId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
        },
      },
    ]
    const result = await this.issueModel.aggregate(pipeline).exec()
    const statusCounts = result.reduce((acc, curr) => {
      acc[curr._id] = curr.count
      return acc
    }, {})

    if (Object.keys(statusCounts).length) return statusCounts
    return { Open: 0, Closed: 0 }
  }

  async addComment(issueId: string, commentId: string) {
    return this.issueModel.findByIdAndUpdate(
      issueId,
      { $push: { comments: commentId } },
      { new: true }
    )
  }

  async removeComment(issueId: string, commentId: string) {
    return this.issueModel.findByIdAndUpdate(
      issueId,
      { $pull: { comments: commentId } },
      { new: true }
    )
  }
}

export default IssueService
