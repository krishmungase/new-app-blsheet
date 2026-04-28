import mongoose, { ObjectId, PipelineStage } from 'mongoose'
import { TaskModelType } from '../../models'
import {
  GetTasksQuery,
  Task,
  TaskStatus,
} from '../../types/projects/task.types'
import { getMongoosePaginationOptions } from '../../utils'

class TaskService {
  constructor(private taskModel: TaskModelType) {}

  async getTask(taskId: string, memberId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(taskId),
          isDeleted: false,
        },
      },
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
                commentType: '$$comment.commentType',
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
          dueDate: 1,
          isCreator: 1,
          members: 1,
          taskNumber: 1,
          taskType: 1,
          creator: {
            fullName: '$user.fullName',
            email: '$member.email',
            role: '$member.role',
            avatar: '$user.avatar',
          },
          comments: {
            _id: 1,
            content: 1,
            commentType: 1,
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

    const result = await this.taskModel.aggregate(pipeline).exec()
    return result.length > 0 ? result[0] : null
  }

  async createTask(task: Task) {
    return this.taskModel.create(task)
  }

  async getTaskNumber(projectId: string) {
    const latestTask = await this.taskModel
      .findOne({ projectId })
      .sort({ taskNumber: -1 })
      .select('taskNumber')
      .lean()
    const taskNumber = latestTask ? latestTask.taskNumber + 1 : 1
    return taskNumber
  }

  async getTaskById(taskId: string) {
    return this.taskModel.findById(taskId)
  }

  async updateTask(taskId: string, task: Partial<Task>) {
    return this.taskModel.findByIdAndUpdate(taskId, task, {
      new: true,
    })
  }

  async deleteTask(taskId: string) {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { isDeleted: true },
      { new: true }
    )
  }

  async getTasks(projectId: string, memberId: string, filters: GetTasksQuery) {
    const {
      title,
      createdByMe,
      assignedToMe,
      priority,
      status,
      sortByCreated,
    } = filters

    let searchQuery = new RegExp(title, 'i')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

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
          $or: [
            { status: { $in: ['Todo', 'In Progress', 'Under Review'] } },
            { status: 'Completed', updatedAt: { $gte: today } },
          ],
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

    const tasks = await this.taskModel.aggregate(pipeline).exec()
    return tasks
  }

  async assignMember(taskId: string, memberId: string) {
    return this.taskModel.updateOne(
      { _id: taskId },
      { $addToSet: { assignees: new mongoose.Types.ObjectId(memberId) } }
    )
  }

  async removeAssignedMember(taskId: string, memberId: string) {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { $pull: { assignees: memberId } },
      { new: true }
    )
  }

  async checkMemberIsAssigned(taskId: string, memberId: string) {
    const task = await this.taskModel.findById(taskId)
    return task?.assignees.includes(memberId as unknown as ObjectId)
  }

  async addComment(taskId: string, commentId: string) {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { $push: { comments: commentId } },
      { new: true }
    )
  }

  async removeComment(taskId: string, commentId: string) {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { $pull: { comments: commentId } },
      { new: true }
    )
  }

  async getUserAssignedTasks(
    userId: string,
    projectId?: string,
    forAll: boolean = false
  ) {
    const today = new Date()
    const last30Days = new Date()
    last30Days.setDate(today.getDate() - 30)

    const pipeline = [
      {
        $match: {
          isDeleted: false,
          ...(projectId && {
            projectId: new mongoose.Types.ObjectId(projectId),
          }),
          ...(!forAll && {
            status: 'Completed',
            completedDate: { $gte: last30Days, $lte: today },
          }),
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'assignees',
          foreignField: '_id',
          as: 'assigneesDetails',
        },
      },
      {
        $unwind: '$assigneesDetails',
      },
      {
        $match: {
          'assigneesDetails.userId': new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          title: 1,
          status: 1,
          completedDate: 1,
          project: { name: 1 },
        },
      },
      ...(forAll
        ? [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ]
        : []),
    ]

    const tasks = await this.taskModel.aggregate(pipeline).exec()
    return tasks
  }

  async getUserCreatedTask(userId: string, projectId?: string) {
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          ...(projectId && {
            projectId: new mongoose.Types.ObjectId(projectId),
          }),
        },
      },
      {
        $group: {
          _id: '$userId',
          taskCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          taskCount: 1,
        },
      },
    ]

    const createTasks = await this.taskModel.aggregate(pipeline).exec()
    if (createTasks.length > 0) return createTasks[0]
    return { taskCount: 0 }
  }

  async getCompletedTasks(
    projectId: string,
    memberId: string,
    filters: GetTasksQuery
  ) {
    const { title, createdByMe, assignedToMe, priority, page, limit } = filters

    let searchQuery = new RegExp(title, 'i')

    let pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          isDeleted: false,
          status: TaskStatus.COMPLETED,
          ...(createdByMe && {
            memberId: new mongoose.Types.ObjectId(memberId),
          }),
          ...(assignedToMe && { assignees: { $in: [memberId] } }),
          title: { $regex: searchQuery },
          ...(priority && { priority }),
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
      { $sort: { completedDate: -1 } },
      {
        $addFields: {
          isMember: {
            $in: [new mongoose.Types.ObjectId(memberId), '$members._id'],
          },
        },
      },
    ]

    const tasks = await this.taskModel.aggregatePaginate(
      this.taskModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'tasks',
        },
      })
    )
    return tasks
  }

  async getMembersCompletedTasks(projectId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )

    const pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          status: TaskStatus.COMPLETED,
          completedDate: {
            $gt: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $unwind: '$assignees',
      },
      {
        $group: {
          _id: '$assignees',
          completedTasksCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: '_id',
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
        $project: {
          _id: 0,
          memberId: '$_id',
          completedTasksCount: 1,
          user: {
            email: 1,
            role: '$member.role',
            fullName: 1,
            avatar: 1,
          },
        },
      },
      { $sort: { completedTasksCount: -1 } },
    ]

    const result = await this.taskModel.aggregate(pipeline)
    return result
  }
}

export default TaskService
