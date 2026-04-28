import { AggregatePaginateModel, model, Model, Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

import { CustomModel } from '../../types/shared/shared.types'
import {
  Issue,
  IssuePriority,
  IssueStatus,
} from '../../types/projects/issue.types'
import { AvailableTaskPriority } from '../../constants'

const issueSchema = new Schema<CustomModel<Issue>>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

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
      enum: ['Open', 'Closed'],
      default: IssueStatus.OPEN,
    },

    priority: {
      type: String,
      enum: AvailableTaskPriority,
      default: IssuePriority.LOW,
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

    closedDate: {
      type: Date,
      required: false,
      default: null,
    },

    closedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: false,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    labels: {
      type: [String],
      default: [],
    },
  },

  { timestamps: true }
)

issueSchema.plugin(mongooseAggregatePaginate)

export type IssueModelType = Model<Issue> & AggregatePaginateModel<Issue>

const IssueModel: Model<CustomModel<Issue>> = model<CustomModel<Issue>>(
  'Issue',
  issueSchema
)

export default IssueModel
