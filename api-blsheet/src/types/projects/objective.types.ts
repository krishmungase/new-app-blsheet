import { ObjectId } from 'mongoose'

export interface TimeFrame {
  label: string
  startDate: Date
  endDate: Date
  projectId: ObjectId
  isActive: boolean
  createdBy: ObjectId
}

export enum OKRStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface Objective {
  title: string
  description: string
  status: OKRStatus
  progress: number
  startDate: Date
  endDate: Date
  completedDate: Date

  timeFrameId: ObjectId
  projectId: ObjectId
  createdBy: ObjectId
  ownerId: ObjectId
  teamId: ObjectId
  parentObjectiveId: ObjectId | null

  keyResults: ObjectId[]
  assignees: ObjectId[]
  attachments: ObjectId[]
  comments: ObjectId[]

  isDeleted: boolean

  progressMetric?: ProgressMetric[]
}

export enum KeyResultUnit {
  PERCENTAGE = '%',
  NUMBER = 'Number',
  TASKS = 'Tasks',
  REVENUE = 'Revenue',
  LEADS = 'Leads',
  HOURS = 'Hours',
  BUGS = 'Bugs',
  MILESTONES = 'Milestones',
  CUSTOM = 'Custom',
}

export interface ProgressMetric {
  progress: number
  date: Date
  comment?: string
}

export interface KeyResult {
  title: string
  description?: string
  unit: string
  progress: number
  targetValue: number
  currentValue: number
  status: OKRStatus
  completedDate: Date

  objectiveId: ObjectId
  createdBy: ObjectId
  projectId: string
  ownerId: ObjectId
  teamId: ObjectId

  assignees: ObjectId[]

  progressMetric?: ProgressMetric[]
}
