import { ObjectId } from 'mongoose'

export interface SecretKey {
  secretKey: string
  userId: ObjectId
}
