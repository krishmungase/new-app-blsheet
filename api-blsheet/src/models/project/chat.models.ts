import { AggregatePaginateModel, model, Model, Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

import { CustomModel } from '../../types/shared/shared.types'
import {
  Channel,
  Conversation,
  Message,
  Reaction,
} from '../../types/projects/chat.types'

const channelSchema = new Schema<CustomModel<Channel>>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },

    name: {
      type: String,
      required: true,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    members: {
      type: [Schema.Types.ObjectId],
      ref: 'Member',
      default: [],
    },
  },

  { timestamps: true }
)

channelSchema.plugin(mongooseAggregatePaginate)

type ChannelModelType = Model<Channel> & AggregatePaginateModel<Channel>

const ChannelModel: Model<CustomModel<Channel>> = model<CustomModel<Channel>>(
  'Channel',
  channelSchema
)

const messageSchema = new Schema<CustomModel<Message>>(
  {
    body: {
      type: String,
      required: true,
    },

    image: {
      type: { url: String, id: String },
      default: null,
      required: false,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },

    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      required: false,
      default: null,
    },

    parentMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },

    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      default: null,
    },
  },
  { timestamps: true }
)

messageSchema.plugin(mongooseAggregatePaginate)

type MessageModelType = Model<Message> & AggregatePaginateModel<Message>

const MessageModel: Model<CustomModel<Message>> = model<CustomModel<Message>>(
  'Message',
  messageSchema
)

const reactionSchema = new Schema<CustomModel<Reaction>>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
    },

    messageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },

    value: {
      type: String,
    },
  },
  { timestamps: true }
)

const ReactionModel: Model<CustomModel<Reaction>> = model<
  CustomModel<Reaction>
>('Reaction', reactionSchema)

const conversationSchema = new Schema<CustomModel<Conversation>>(
  {
    memberOneId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    memberTwoId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  },
  { timestamps: true }
)

const ConversationModel: Model<CustomModel<Conversation>> = model<
  CustomModel<Conversation>
>('Conversation', conversationSchema)

export {
  ChannelModelType,
  ChannelModel,
  MessageModelType,
  MessageModel,
  ReactionModel,
  ConversationModel,
}
