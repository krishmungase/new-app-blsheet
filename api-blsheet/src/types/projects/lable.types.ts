import { ObjectId } from 'mongoose'

export enum LableType {
  ISSUE = 'ISSUE',
  TASK = 'TASK',
}

export interface Lable {
  projectId: ObjectId
  color: string
  name: string
  description: string
}
