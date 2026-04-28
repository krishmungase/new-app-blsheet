import mongoose, { ObjectId, PipelineStage } from 'mongoose'

import {
  ChannelModelType,
  ConversationModel,
  MessageModelType,
  ReactionModel,
} from '../../models'
import {
  Channel,
  Conversation,
  Message,
  Reaction,
} from '../../types/projects/chat.types'
import { getMongoosePaginationOptions } from '../../utils'

class ChannelService {
  constructor(private channelModel: ChannelModelType) {}

  async getById(channelId: string) {
    return await this.channelModel.findById(channelId)
  }

  async create(channel: Channel) {
    return await this.channelModel.create(channel)
  }

  async delete(channelId: string) {
    return await this.channelModel.deleteOne({
      _id: new mongoose.Types.ObjectId(channelId),
    })
  }

  async update(channelId: string, channel: Partial<Channel>) {
    return await this.channelModel.findByIdAndUpdate(channelId, channel, {
      new: true,
    })
  }

  async get(channelId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(channelId) } },
      {
        $lookup: {
          from: 'members',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $project: {
          name: 1,
          createdAt: 1,
          updatedAt: 1,
          members: {
            _id: 1,
            role: 1,
            email: 1,
          },
        },
      },
    ]

    const result = await this.channelModel.aggregate(pipeline)
    return result[0]
  }

  async findByProjectId(projectId: string, memberId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          members: { $in: [memberId] },
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: '_id',
          as: 'member',
        },
      },
      { $unwind: '$member' },
      {
        $lookup: {
          from: 'users',
          localField: 'member.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          name: 1,
          member: {
            _id: 1,
            role: 1,
            email: 1,
            user: {
              fullName: '$user.fullName',
              email: '$user.email',
              avatar: '$user.avatar',
            },
          },
        },
      },
    ]

    const result = await this.channelModel.aggregate(pipeline)
    return result
  }

  async addMember(channelId: string, memberId: string) {
    return await this.channelModel.updateOne(
      { _id: channelId },
      { $addToSet: { members: new mongoose.Types.ObjectId(memberId) } }
    )
  }

  async removeMember(channelId: string, memberId: string) {
    return await this.channelModel.findByIdAndUpdate(
      channelId,
      { $pull: { members: memberId } },
      { new: true }
    )
  }
}

class MessageService {
  constructor(private messageModel: MessageModelType) {}

  async create(message: Message) {
    return await this.messageModel.create(message)
  }

  async delete(messageId: string) {
    return await this.messageModel.deleteOne({
      _id: new mongoose.Types.ObjectId(messageId),
    })
  }

  async update(messageId: string, message: Partial<Message>) {
    return await this.messageModel.findByIdAndUpdate(messageId, message, {
      new: true,
    })
  }

  async get(messageId: string) {
    return await this.messageModel.findById(messageId)
  }

  async getFullMessage(messageId: string, memberId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(messageId) } },
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: '_id',
          as: 'member',
        },
      },
      { $unwind: '$member' },
      {
        $lookup: {
          from: 'users',
          localField: 'member.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $addFields: {
          isCreator: {
            $eq: ['$memberId', new mongoose.Types.ObjectId(memberId)],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          body: 1,
          image: 1,
          member: {
            _id: 1,
            role: 1,
            email: 1,
            user: {
              fullName: '$user.fullName',
              email: '$user.email',
              avatar: '$user.avatar',
            },
          },
          isCreator: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]
    const result = await this.messageModel.aggregate(pipeline)
    if (result.length) return result[0]
    return null
  }

  async getMessages(
    channelId: string | null,
    conversationId: string | null,
    memberId: string,
    parentMessageId: string | null,
    { page, limit, search }: { page: number; limit: number; search: string }
  ) {
    let searchQuery = new RegExp(search, 'i')
    const pipeline: PipelineStage[] = [
      {
        $match: {
          ...(channelId && {
            channelId: new mongoose.Types.ObjectId(channelId),
          }),
          ...(conversationId && {
            conversationId: new mongoose.Types.ObjectId(conversationId),
          }),
          ...(parentMessageId
            ? { parentMessageId: new mongoose.Types.ObjectId(parentMessageId) }
            : { parentMessageId: null }),
          body: { $regex: searchQuery },
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: '_id',
          as: 'member',
        },
      },
      { $unwind: '$member' },
      {
        $lookup: {
          from: 'users',
          localField: 'member.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $addFields: {
          isCreator: {
            $eq: ['$memberId', new mongoose.Types.ObjectId(memberId)],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          body: 1,
          image: 1,
          member: {
            _id: 1,
            role: 1,
            email: 1,
            user: {
              fullName: '$user.fullName',
              email: '$user.email',
              avatar: '$user.avatar',
            },
          },
          isCreator: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]

    const messages = await this.messageModel.aggregatePaginate(
      this.messageModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'messages',
        },
      })
    )

    return messages
  }
}

class ReactionService {
  constructor(private reactionModel: typeof ReactionModel) {}

  async get(memberId: string, messageId: string, value: string) {
    return await this.reactionModel.findOne({ memberId, messageId, value })
  }

  async create(reaction: Reaction) {
    return await this.reactionModel.create(reaction)
  }

  async delete(reactionId: string) {
    return await this.reactionModel.findByIdAndDelete(reactionId)
  }

  async getReactions(messageId: string) {
    const result = await this.reactionModel.find({ messageId })
    const reactionsWithCount = result.map((reaction) => {
      return {
        memberId: reaction.memberId,
        value: reaction.value,
        count: result.filter((r) => r.value === reaction.value).length,
      }
    })

    const dedupReaction = reactionsWithCount.reduce(
      (acc, reaction) => {
        const existingReaction = acc.find((r) => r.value === reaction.value)
        if (existingReaction)
          existingReaction.memberIds = Array.from(
            new Set([...existingReaction.memberIds, reaction.memberId])
          )
        else
          acc.push({
            value: reaction.value,
            count: reaction.count,
            memberIds: [reaction.memberId],
          } as any)
        return acc
      },
      [] as (Reaction & { count: number; memberIds: ObjectId[] })[]
    )

    return dedupReaction
  }
}

class ConversationService {
  constructor(private conversationModel: typeof ConversationModel) {}

  async findByMembersId(memberOneId: string, memberTwoId: string) {
    return await this.conversationModel.findOne({ memberOneId, memberTwoId })
  }

  async create(conversation: Conversation) {
    return await this.conversationModel.create(conversation)
  }

  async delete(conversationId: string) {
    return await this.conversationModel.deleteOne({ _id: conversationId })
  }

  async getConversationsByMemberId(memberId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { memberOneId: new mongoose.Types.ObjectId(memberId) },
            { memberTwoId: new mongoose.Types.ObjectId(memberId) },
          ],
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'memberOneId',
          foreignField: '_id',
          as: 'memberOne',
        },
      },
      { $unwind: '$memberOne' },
      {
        $lookup: {
          from: 'users',
          localField: 'memberOne.userId',
          foreignField: '_id',
          as: 'userOne',
        },
      },
      { $unwind: '$userOne' },
      {
        $lookup: {
          from: 'members',
          localField: 'memberTwoId',
          foreignField: '_id',
          as: 'memberTwo',
        },
      },
      { $unwind: '$memberTwo' },
      {
        $lookup: {
          from: 'users',
          localField: 'memberTwo.userId',
          foreignField: '_id',
          as: 'userTwo',
        },
      },
      { $unwind: '$userTwo' },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          memberOne: {
            _id: 1,
            role: 1,
            email: 1,
            user: {
              fullName: '$userOne.fullName',
              email: '$userOne.email',
              avatar: '$userOne.avatar',
            },
          },
          memberTwo: {
            _id: 1,
            role: 1,
            email: 1,
            user: {
              fullName: '$userTwo.fullName',
              email: '$userTwo.email',
              avatar: '$userTwo.avatar',
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]
    const result = await this.conversationModel.aggregate(pipeline)
    if (result.length) return result
    return []
  }

  async get(conversationId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(conversationId),
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'memberOneId',
          foreignField: '_id',
          as: 'memberOne',
        },
      },
      { $unwind: '$memberOne' },
      {
        $lookup: {
          from: 'users',
          localField: 'memberOne.userId',
          foreignField: '_id',
          as: 'userOne',
        },
      },
      { $unwind: '$userOne' },
      {
        $lookup: {
          from: 'members',
          localField: 'memberTwoId',
          foreignField: '_id',
          as: 'memberTwo',
        },
      },
      { $unwind: '$memberTwo' },
      {
        $lookup: {
          from: 'users',
          localField: 'memberTwo.userId',
          foreignField: '_id',
          as: 'userTwo',
        },
      },
      { $unwind: '$userTwo' },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          memberOne: {
            _id: 1,
            role: 1,
            email: 1,
            user: {
              fullName: '$userOne.fullName',
              email: '$userOne.email',
              avatar: '$userOne.avatar',
            },
          },
          memberTwo: {
            _id: 1,
            role: 1,
            email: 1,
            user: {
              fullName: '$userTwo.fullName',
              email: '$userTwo.email',
              avatar: '$userTwo.avatar',
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]
    const result = await this.conversationModel.aggregate(pipeline)
    if (result.length) return result[0]
    return null
  }
}

export { ChannelService, MessageService, ReactionService, ConversationService }
