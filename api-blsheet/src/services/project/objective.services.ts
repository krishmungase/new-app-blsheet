import mongoose, { PipelineStage } from 'mongoose'
import {
  KeyResultModelType,
  ObjectiveModelType,
  TimeFrameModelType,
} from '../../models'
import {
  KeyResult,
  Objective,
  ProgressMetric,
  TimeFrame,
} from '../../types/projects/objective.types'
import { getMongoosePaginationOptions } from '../../utils'

class TimeFrameService {
  constructor(private timeFrameModel: TimeFrameModelType) {}

  async create(timeFrame: TimeFrame) {
    return await this.timeFrameModel.create(timeFrame)
  }

  async update(timeFrameId: string, timeFrame: Partial<TimeFrame>) {
    return await this.timeFrameModel.findByIdAndUpdate(timeFrameId, timeFrame, {
      new: true,
    })
  }

  async delete(timeFrameId: string) {
    return await this.timeFrameModel.deleteOne({ _id: timeFrameId })
  }

  async get(timeFrameId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(timeFrameId) } },
      {
        $lookup: {
          from: 'members',
          localField: 'createdBy',
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
        $project: {
          label: 1,
          startDate: 1,
          endDate: 1,
          projectId: 1,
          isActive: 1,
          createdBy: 1,
          updatedAt: 1,
          createdAt: 1,
          creator: {
            fullName: '$user.fullName',
            email: '$creator.email',
            role: '$creator.role',
            avatar: '$user.avatar',
          },
        },
      },
    ]

    const result = await this.timeFrameModel.aggregate(pipeline)
    if (result.length) return result[0]
    return null
  }

  async getTimeFrames(
    projectId: string,
    { page, limit, label }: { page: number; limit: number; label: string }
  ) {
    let searchQuery = new RegExp(label, 'i')
    const pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          label: { $regex: searchQuery },
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'createdBy',
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
      { $sort: { createdAt: -1 } },
      {
        $project: {
          label: 1,
          startDate: 1,
          endDate: 1,
          projectId: 1,
          isActive: 1,
          createdBy: 1,
          updatedAt: 1,
          createdAt: 1,
          creator: {
            fullName: '$user.fullName',
            email: '$creator.email',
            role: '$creator.role',
            avatar: '$user.avatar',
          },
        },
      },
    ]

    const timeFrames = await this.timeFrameModel.aggregatePaginate(
      this.timeFrameModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'timeFrames',
        },
      })
    )

    return timeFrames
  }

  async getTimeFrameByLabelAndProjectId(label: string, projectId: string) {
    return await this.timeFrameModel.findOne({ label, projectId })
  }
}

class ObjectiveService {
  constructor(private objectiveModel: ObjectiveModelType) {}

  async create(objective: Objective) {
    return await this.objectiveModel.create(objective)
  }

  async update(objectiveId: string, objective: Partial<Objective>) {
    return await this.objectiveModel.findByIdAndUpdate(objectiveId, objective, {
      new: true,
    })
  }

  async delete(objectiveId: string) {
    return await this.objectiveModel.deleteOne({ _id: objectiveId })
  }

  async get(objectiveId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(objectiveId) } },
      {
        $lookup: {
          from: 'members',
          localField: 'createdBy',
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
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      {
        $lookup: {
          from: 'users',
          localField: 'owner.userId',
          foreignField: '_id',
          as: 'ownerUser',
        },
      },
      { $unwind: '$ownerUser' },
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: '$team' },
      {
        $lookup: {
          from: 'key_results',
          localField: 'keyResults',
          foreignField: '_id',
          as: 'keyResults',
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
          completedDate: 1,
          timeFrameId: 1,
          updatedAt: 1,
          createdAt: 1,
          progress: {
            $avg: '$keyResults.progress',
          },
          creator: {
            fullName: '$user.fullName',
            email: '$creator.email',
            role: '$creator.role',
            avatar: '$user.avatar',
          },
          owner: {
            fullName: '$ownerUser.fullName',
            email: '$owner.email',
            role: '$owner.role',
            avatar: '$ownerUser.avatar',
          },
          team: 1,
          progressMetric: 1,
          keyResults: {
            _id: 1,
            progress: 1,
            title: 1,
          },
        },
      },
    ]

    const result = await this.objectiveModel.aggregate(pipeline)
    if (result.length) return result[0]
    return null
  }

  async getObjectives(
    timeFrameId: string,
    { page, limit, title }: { page: number; limit: number; title: string }
  ) {
    let searchQuery = new RegExp(title, 'i')
    const pipeline: PipelineStage[] = [
      {
        $match: {
          timeFrameId: new mongoose.Types.ObjectId(timeFrameId),
          title: { $regex: searchQuery },
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'createdBy',
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
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'members',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      {
        $lookup: {
          from: 'users',
          localField: 'owner.userId',
          foreignField: '_id',
          as: 'ownerUser',
        },
      },
      { $unwind: '$ownerUser' },
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: '$team' },
      {
        $lookup: {
          from: 'key_results',
          localField: 'keyResults',
          foreignField: '_id',
          as: 'keyResults',
        },
      },

      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
          completedDate: 1,
          timeFrameId: 1,
          updatedAt: 1,
          createdAt: 1,
          progress: {
            $avg: '$keyResults.progress',
          },
          creator: {
            fullName: '$user.fullName',
            email: '$creator.email',
            role: '$creator.role',
            avatar: '$user.avatar',
            _id: '$creator._id',
          },
          owner: {
            fullName: '$ownerUser.fullName',
            email: '$owner.email',
            role: '$owner.role',
            avatar: '$ownerUser.avatar',
            _id: '$owner._id',
          },
          team: {
            name: 1,
            _id: 1,
          },
          keyResults: {
            _id: 1,
            title: 1,
            progress: 1,
          },
          progressMetric: 1,
        },
      },
    ]

    const objectives = await this.objectiveModel.aggregatePaginate(
      this.objectiveModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'objectives',
        },
      })
    )

    return objectives
  }

  async addProgressMetric(objectiveId: string, progressMetric: ProgressMetric) {
    return this.objectiveModel.findByIdAndUpdate(
      objectiveId,
      { $push: { progressMetric: progressMetric } },
      { new: true }
    )
  }

  async addKeyResult(objectiveId: string, keyResultId: string) {
    return this.objectiveModel.updateOne(
      { _id: objectiveId },
      { $addToSet: { keyResults: new mongoose.Types.ObjectId(keyResultId) } }
    )
  }

  async removeKeyResult(objectiveId: string, keyResultId: string) {
    return this.objectiveModel.findByIdAndUpdate(
      objectiveId,
      { $pull: { keyResults: keyResultId } },
      { new: true }
    )
  }
}

class KeyResultService {
  constructor(private keyResultModel: KeyResultModelType) {}

  async getById(keyResultId: string) {
    return await this.keyResultModel.findById(keyResultId)
  }

  async create(keyResult: KeyResult) {
    return await this.keyResultModel.create(keyResult)
  }

  async update(keyResultId: string, keyResult: Partial<KeyResult>) {
    return await this.keyResultModel.findByIdAndUpdate(keyResultId, keyResult, {
      new: true,
    })
  }

  async addProgressMetric(keyResultId: string, progressMetric: ProgressMetric) {
    return this.keyResultModel.findByIdAndUpdate(
      keyResultId,
      { $push: { progressMetric: progressMetric } },
      { new: true }
    )
  }

  async delete(keyResultId: string) {
    return await this.keyResultModel.deleteOne({ _id: keyResultId })
  }

  async get(keyResultId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(keyResultId) } },
      {
        $lookup: {
          from: 'members',
          localField: 'createdBy',
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
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      {
        $lookup: {
          from: 'users',
          localField: 'owner.userId',
          foreignField: '_id',
          as: 'ownerUser',
        },
      },
      { $unwind: '$ownerUser' },
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: '$team' },
      {
        $project: {
          title: 1,
          description: 1,
          unit: 1,
          currentValue: 1,
          targetValue: 1,
          status: 1,
          completedDate: 1,
          updatedAt: 1,
          createdAt: 1,
          objectiveId: 1,
          creator: {
            fullName: '$user.fullName',
            email: '$creator.email',
            role: '$creator.role',
            avatar: '$user.avatar',
            _id: '$creator._id',
          },
          owner: {
            fullName: '$ownerUser.fullName',
            email: '$owner.email',
            role: '$owner.role',
            avatar: '$ownerUser.avatar',
            _id: '$owner._id',
          },
          team: 1,
          progressMetric: 1,
        },
      },
    ]

    const result = await this.keyResultModel.aggregate(pipeline)
    if (result.length) return result[0]
    return null
  }

  async getKeyResults(
    objectiveId: string,
    { page, limit, title }: { page: number; limit: number; title: string }
  ) {
    let searchQuery = new RegExp(title, 'i')
    const pipeline: PipelineStage[] = [
      {
        $match: {
          objectiveId: new mongoose.Types.ObjectId(objectiveId),
          title: { $regex: searchQuery },
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'createdBy',
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
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      {
        $lookup: {
          from: 'users',
          localField: 'owner.userId',
          foreignField: '_id',
          as: 'ownerUser',
        },
      },
      { $unwind: '$ownerUser' },
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: '$team' },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          title: 1,
          description: 1,
          unit: 1,
          currentValue: 1,
          targetValue: 1,
          status: 1,
          completedDate: 1,
          updatedAt: 1,
          createdAt: 1,
          objectiveId: 1,
          progress: 1,
          creator: {
            fullName: '$user.fullName',
            email: '$creator.email',
            role: '$creator.role',
            avatar: '$user.avatar',
            _id: '$creator._id',
          },
          owner: {
            fullName: '$ownerUser.fullName',
            email: '$owner.email',
            role: '$owner.role',
            avatar: '$ownerUser.avatar',
            _id: '$owner._id',
          },
          team: 1,
          progressMetric: 1,
        },
      },
    ]

    const keyResults = await this.keyResultModel.aggregatePaginate(
      this.keyResultModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'keyResults',
        },
      })
    )

    return keyResults
  }
}

export { TimeFrameService, ObjectiveService, KeyResultService }
