import { ObjectId } from 'mongoose'

export enum IssueStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
}

export enum IssuePriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface Issue {
  _id: ObjectId
  memberId: ObjectId
  projectId: ObjectId
  userId: ObjectId
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  comments: ObjectId[]
  assignees: ObjectId[]
  attachments: ObjectId[]
  labels: string[]
  closedDate: Date
  closedBy: ObjectId
  isDeleted: boolean
}

export interface GetIssuesFilters {
  projectId: string
  title: string
  status: IssueStatus
  priority: IssuePriority
  assignedToMe: boolean
  createdByMe: boolean
  sortByCreated: boolean
  page: number
  limit: number
}
