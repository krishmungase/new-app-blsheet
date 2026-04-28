import { ObjectId } from 'mongoose'

export interface Channel {
  name: string
  projectId: ObjectId
  memberId: ObjectId
  members: ObjectId[]
}

export interface Message {
  body: string
  image: { url: string; id: string }
  projectId: ObjectId
  memberId: ObjectId
  channelId: ObjectId | null
  parentMessageId: ObjectId | null
  conversationId: ObjectId | null
}

export interface Reaction {
  value: string
  memberId: ObjectId
  messageId: ObjectId
  channelId: ObjectId
  projectId: ObjectId
}

export interface Conversation {
  projectId: ObjectId
  memberOneId: ObjectId
  memberTwoId: ObjectId
}
