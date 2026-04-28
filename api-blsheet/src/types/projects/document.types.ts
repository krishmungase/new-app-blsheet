import { ObjectId } from 'mongoose'

export enum DocStatus {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
  ARCHIVED = 'Archived',
}

export enum DocAccessType {
  PRIVATE = 'Private',
  PUBLIC = 'Public',
}

export interface Document {
  _id: ObjectId
  projectId: ObjectId
  memberId: ObjectId
  title: string
  content: string
  accessType: DocAccessType
  status: DocStatus
  assignees: ObjectId[]
  teams: ObjectId[]
  comments: ObjectId[]
  attachments: ObjectId[]
  isDeleted: boolean
  leftMargin: number
  rightMargin: number
}

export interface AssignOrRemoveMemberBody {
  memberId: string
  docId: string
  projectId: string
}

export interface GetDocsQuery {
  projectId: string
  title: string
  status: DocStatus
  assignedToMe: boolean
  createdByMe: boolean
  sortByCreated: boolean
  isPublic: boolean
  page: number
  limit: number
}
