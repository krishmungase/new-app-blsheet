import { AggregatePaginateModel, model, Model, Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

import { CustomModel } from '../../types/shared/shared.types'
import { AvailableAccessType, AvailableDocStatus } from '../../constants'
import {
  Document,
  DocAccessType,
  DocStatus,
} from '../../types/projects/document.types'

const docSchema = new Schema<CustomModel<Document>>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      default: '',
      required: false,
    },

    status: {
      type: String,
      enum: AvailableDocStatus,
      default: DocStatus.DRAFT,
    },

    accessType: {
      type: String,
      enum: AvailableAccessType,
      default: DocAccessType.PRIVATE,
    },

    assignees: {
      type: [Schema.Types.ObjectId],
      ref: 'Member',
      default: [],
    },

    teams: {
      type: [Schema.Types.ObjectId],
      ref: 'Team',
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

    leftMargin: {
      type: Number,
      default: 56,
    },

    rightMargin: {
      type: Number,
      default: 56,
    },
  },

  { timestamps: true }
)

docSchema.plugin(mongooseAggregatePaginate)

export type DocumentModelType = Model<Document> &
  AggregatePaginateModel<Document>

const DocumentModel: Model<CustomModel<Document>> = model<
  CustomModel<Document>
>('Document', docSchema)

export default DocumentModel
