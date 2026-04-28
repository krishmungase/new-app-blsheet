import { ObjectId } from 'mongoose'

export enum DisplayType {
  ONE_BY_ONE = 'One by One',
  LIST = 'List',
}

export interface Option {
  value: string
  hint?: string
  answer?: string
}

export enum QuestionType {
  SINGLE_CHOICE = 'Single Choice',
  MULTIPLE_CHOICE = 'Multiple Choice',
  TRUE_FALSE = 'True False',
  SHORT_ANSWER = 'Short Answer',
  PARAGRAPH = 'Paragraph',
  DROPDOWN = 'Dropdown',
  SCALE = 'Scale',
  MATCHING = 'Matching',
}

export interface Question {
  categoryId: ObjectId
  question: string
  options: Option[]
  questionType: QuestionType
}

export interface Category {
  _id?: ObjectId
  assessmentId: ObjectId
  projectId: ObjectId
  name: string
  description: string
  displayType: DisplayType
  totalQuestions?: number
  weightage: number

  questions: ObjectId[]
}

export enum AssessmentResponseStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  SUBMITTED = 'Submitted',
}

export enum AssessmentStatus {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
  ARCHIVED = 'Archived',
}

export interface Assessment {
  memberId: ObjectId
  projectId: ObjectId
  name: string
  status: AssessmentStatus
  isDeleted?: boolean
  startDate: Date
  endDate: Date

  responses: { memberId: ObjectId; assessmentResponseId: ObjectId }[]
  categories: ObjectId[]
  assignees: ObjectId[]
  teams: ObjectId[]
  attachments: ObjectId[]
  comments: ObjectId[]
}

export interface FullAssessment {
  memberId: ObjectId
  projectId: ObjectId
  name: string
  status: AssessmentStatus
  isDeleted?: boolean
  startDate: Date
  endDate: Date

  categories: Category[]
  responses: { memberId: ObjectId; assessmentResponseId: ObjectId }[]
  _id: ObjectId
}

// Assessment Response
export interface AssessmentCategoryQuestionAnswers {
  questionId: ObjectId
  selectedOptions?: string[]
  textAnswer?: string
  scaleValue?: number
  feedback?: string
}

export interface AssessmentCategoryResponse {
  memberId: ObjectId
  categoryId: ObjectId
  assessmentResponseId: ObjectId
  answers: AssessmentCategoryQuestionAnswers[]
  totalCompletedQuestions?: number
  totalQuestions: number
}

export interface AssessmentResponse {
  assessmentId: ObjectId
  memberId: ObjectId
  projectId: ObjectId
  status: AssessmentResponseStatus
  startTime?: Date
  submittedAt?: Date
  categoryResponses: ObjectId[]
  isDeleted?: boolean
}

export interface GetAssessmentsFilters {
  page: number
  limit: number
  name: string
  status: AssessmentStatus
  isAssignedToCurrentUser: boolean
  isCreatedByCurrentUser: boolean
  sortByCreatedAt: boolean
}

export interface PublishAssessmentBody {
  assessmentId: string
  projectId: string
  assignee: string[]
  startDate: Date
  endDate: Date
}

export interface AssignOrRemoveMemberBody {
  isRemove: boolean
  memberId: string
  assessmentId: string
  projectId: string
}

export interface GetAssinedAssessment {
  assessmentResponseId: string
  projectId: string
}
