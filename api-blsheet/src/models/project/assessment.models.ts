import { AggregatePaginateModel, model, Model, Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

import { CustomModel } from '../../types/shared/shared.types'
import {
  AvailableAssessmentCategoryDisplayType,
  AvailableAssessmentResponseStatus,
  AvailableAssessmentStatus,
  AvailableQuestionType,
} from '../../constants'
import {
  Assessment,
  AssessmentCategoryResponse,
  AssessmentResponse,
  AssessmentResponseStatus,
  AssessmentStatus,
  Category,
  Question,
} from '../../types/projects/assessment.types'

const questionSchema = new Schema<CustomModel<Question>>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'AssessmentCategory',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [Object],
      default: [],
    },
    questionType: {
      type: String,
      enum: AvailableQuestionType,
      required: true,
    },
  },
  { timestamps: true }
)
const AssessmentCategoryQuestionModel: Model<CustomModel<Question>> = model<
  CustomModel<Question>
>('AssessmentCategoryQuestion', questionSchema, 'assessment_category_questions')

const categorySchema = new Schema<CustomModel<Category>>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    weightage: {
      type: Number,
      default: 0,
    },

    questions: {
      type: [Schema.Types.ObjectId],
      ref: 'AssessmentQuestionCategory',
      default: [],
    },

    displayType: {
      type: String,
      enum: AvailableAssessmentCategoryDisplayType,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)
const AssessmentCategoryModel: Model<CustomModel<Category>> = model<
  CustomModel<Category>
>('AssessmentCategory', categorySchema, 'assessment_categories')

const assessmentSchema = new Schema<CustomModel<Assessment>>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    categories: {
      type: [Schema.Types.ObjectId],
      ref: 'Category',
      default: [],
    },

    responses: {
      type: [
        {
          memberId: {
            type: Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
          },
          assessmentResponseId: {
            type: Schema.Types.ObjectId,
            ref: 'AssessmentResponse',
            required: true,
          },
        },
      ],
      default: [],
    },

    status: {
      type: String,
      enum: AvailableAssessmentStatus,
      default: AssessmentStatus.DRAFT,
    },

    isDeleted: {
      type: Boolean,
      default: false,
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

    teams: {
      type: [Schema.Types.ObjectId],
      ref: 'Team',
      default: [],
    },
  },
  { timestamps: true }
)
assessmentSchema.plugin(mongooseAggregatePaginate)
type AssessmentModelType = Model<Assessment> &
  AggregatePaginateModel<Assessment>
const AssessmentModel: Model<CustomModel<Assessment>> = model<
  CustomModel<Assessment>
>('Assessment', assessmentSchema, 'assessments')

const assessmentCategoryResponseSchema = new Schema<
  CustomModel<AssessmentCategoryResponse>
>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'AssessmentCategory',
      required: true,
    },

    assessmentResponseId: {
      type: Schema.Types.ObjectId,
      ref: 'AssessmentResponse',
      required: true,
    },

    answers: {
      type: [Object],
      default: [],
    },

    totalCompletedQuestions: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)
const AssessmentCategoryResponseModel: Model<
  CustomModel<AssessmentCategoryResponse>
> = model<CustomModel<AssessmentCategoryResponse>>(
  'AssessmentCategoryResponse',
  assessmentCategoryResponseSchema,
  'assessment_category_responses'
)

const assessmentResponseSchema = new Schema<CustomModel<AssessmentResponse>>(
  {
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },

    startTime: {
      type: Date,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    categoryResponses: {
      type: [Schema.Types.ObjectId],
      ref: 'AssessmentCategoryResponse',
      default: [],
    },

    status: {
      type: String,
      enum: AvailableAssessmentResponseStatus,
      default: AssessmentResponseStatus.PENDING,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
assessmentResponseSchema.plugin(mongooseAggregatePaginate)
type AssessmentResponseModelType = Model<AssessmentResponse> &
  AggregatePaginateModel<Assessment>
const AssessmentResponseModel: Model<CustomModel<AssessmentResponse>> = model<
  CustomModel<AssessmentResponse>
>('AssessmentResponse', assessmentResponseSchema, 'assessment_responses')

export {
  AssessmentModel,
  AssessmentModelType,
  AssessmentCategoryModel,
  AssessmentCategoryQuestionModel,
  AssessmentResponseModel,
  AssessmentResponseModelType,
  AssessmentCategoryResponseModel,
}
