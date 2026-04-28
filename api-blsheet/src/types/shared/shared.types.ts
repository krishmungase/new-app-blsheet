import { Request } from 'express'
import { Document, ObjectId } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'

import { User } from '../auth/user.types'
import { SecretKey } from '../app/secret-key.types'

export interface CustomRequest<T = null> extends Request {
  body: T
  user?: User | null
}

export type CustomModel<T> = T & Document

export interface ProjectRequest<T = null> extends Request {
  body: T
  secretKey?: SecretKey | null
}

export interface JwtPayloadType extends JwtPayload {
  user: { _id?: string; fullName?: string; email?: string }
}

export interface NotificationMessage {
  to: string
  text: string
  html?: string
  subject?: string
  from?: string
}

export interface Comment {
  content: string
  memberId: ObjectId
  likes?: number
  replies?: ObjectId[]
  commentType: string
}

export enum CommentType {
  GENERAL = 'General',
  STATUS_UPDATED = 'Status Update',
  COMMENT_UPDATED = 'Comment Updated',
  ASSIGNED_MEMBER = 'Assigned Member',
  REMOVE_ASSIGNED_MEMBER = 'Remove Assigned Member',
  SUBTASK_UPDATED = 'Subtask Updated',
}
