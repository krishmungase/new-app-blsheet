import { AggregatePaginateModel, model, Model, Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

import { CustomModel } from '../../types/shared/shared.types'
import {
  KeyResult,
  Objective,
  OKRStatus,
  TimeFrame,
} from '../../types/projects/objective.types'
import { AvailableOKRStatus } from '../../constants'

const timeFrameSchema = new Schema<CustomModel<TimeFrame>>(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  },

  { timestamps: true }
)

timeFrameSchema.plugin(mongooseAggregatePaginate)

export type TimeFrameModelType = Model<TimeFrame> &
  AggregatePaginateModel<TimeFrame>

export const TimeFrameModel: Model<CustomModel<TimeFrame>> = model<
  CustomModel<TimeFrame>
>('TimeFrame', timeFrameSchema, 'time_frames')

const objectiveSchema = new Schema<CustomModel<Objective>>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: AvailableOKRStatus,
      default: OKRStatus.NOT_STARTED,
    },

    progress: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    completedDate: {
      type: Date,
      required: false,
      default: null,
    },

    timeFrameId: {
      type: Schema.Types.ObjectId,
      ref: 'TimeFrame',
      require: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      require: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      require: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },

    parentObjectiveId: {
      type: Schema.Types.ObjectId,
      ref: 'Objective',
      default: null,
      required: false,
    },

    keyResults: {
      type: [Schema.Types.ObjectId],
      ref: 'KeyResult',
      default: [],
      required: false,
    },

    assignees: {
      type: [Schema.Types.ObjectId],
      ref: 'Member',
      default: [],
    },

    attachments: {
      type: [Schema.Types.ObjectId],
      ref: 'Attachment',
      default: [],
    },

    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
      default: [],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    progressMetric: {
      type: [Object],
      default: [],
    },
  },

  { timestamps: true }
)

objectiveSchema.plugin(mongooseAggregatePaginate)

export type ObjectiveModelType = Model<Objective> &
  AggregatePaginateModel<Objective>

export const ObjectiveModel: Model<CustomModel<Objective>> = model<
  CustomModel<Objective>
>('Objective', objectiveSchema)

const keyResultSchema = new Schema<CustomModel<KeyResult>>(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: AvailableOKRStatus,
      default: OKRStatus.NOT_STARTED,
    },

    progress: {
      type: Number,
      default: 0,
    },

    targetValue: {
      type: Number,
    },

    currentValue: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
    },

    completedDate: {
      type: Date,
      required: false,
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    objectiveId: {
      type: Schema.Types.ObjectId,
      ref: 'Objective',
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },

    assignees: {
      type: [Schema.Types.ObjectId],
      ref: 'Member',
      default: [],
    },

    progressMetric: {
      type: [Object],
      default: [],
    },
  },

  { timestamps: true }
)

keyResultSchema.plugin(mongooseAggregatePaginate)

export type KeyResultModelType = Model<KeyResult> &
  AggregatePaginateModel<KeyResult>

export const KeyResultModel: Model<CustomModel<KeyResult>> = model<
  CustomModel<KeyResult>
>('KeyResult', keyResultSchema, 'key_results')
