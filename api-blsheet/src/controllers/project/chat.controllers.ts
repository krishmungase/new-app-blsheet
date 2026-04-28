import { Response } from 'express'
import { Logger } from 'winston'

import { MSG } from '../../constants'
import { ApiError, ApiResponse } from '../../utils'
import { CustomRequest } from '../../types/shared/shared.types'
import { MemberRole } from '../../types/projects/member.types'
import {
  Channel,
  Conversation,
  Message,
  Reaction,
} from '../../types/projects/chat.types'
import {
  ChannelService,
  ConversationService,
  MemberService,
  MessageService,
  ReactionService,
  UploadService,
} from '../../services'
import { io } from '../..'

class ChannelController {
  constructor(
    private channelService: ChannelService,
    private memberService: MemberService,
    private logger: Logger
  ) {}

  async getChannels(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId } = req.query as { projectId: string }
    this.logger.info({
      msg: MSG.CHAT.CHANNEL.GET_CHANNELS,
      data: { userId, projectId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const channels = await this.channelService.findByProjectId(
      projectId,
      member._id as unknown as string
    )
    return res
      .status(200)
      .json(new ApiResponse(200, channels, 'Channels fetched successfully'))
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, channelId } = req.query as {
      projectId: string
      channelId: string
    }
    this.logger.info({
      msg: MSG.CHAT.CHANNEL.GET_CHANNEL,
      data: { userId, projectId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const channel = await this.channelService.get(channelId)
    if (!channel) throw new ApiError(404, 'Channel not found')
    if (
      !channel?.members?.some((p: any) => String(p._id) === String(member._id))
    ) {
      throw new ApiError(403, 'You are not a member of this channel')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, channel, 'Channel fetched successfully'))
  }

  async create(req: CustomRequest<Channel>, res: Response) {
    const userId = req.user?._id as string
    const channel = req.body

    this.logger.info({
      msg: MSG.CHAT.CHANNEL.CREATE_CHANNEL,
      data: { userId, channel },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      channel.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permission to create channel')

    const createChannel = await this.channelService.create({
      ...channel,
      memberId: member._id,
      members: [member._id],
    })
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { channel: createChannel },
          'Channel created successfully'
        )
      )
  }

  async update(
    req: CustomRequest<
      {
        channelId: string
        projectId: string
      } & Channel
    >,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { channelId, projectId, ...channel } = req.body

    this.logger.info({
      msg: MSG.CHAT.CHANNEL.UPDATE_CHANNEL,
      data: { userId, channelId, channel },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permission to update channel')

    const updatedChannel = await this.channelService.update(channelId, channel)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { channel: updatedChannel },
          'Channel updated successfully'
        )
      )
  }

  async delete(
    req: CustomRequest<{
      channelId: string
      projectId: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { channelId, projectId } = req.body

    this.logger.info({
      msg: MSG.CHAT.CHANNEL.DELETE_CHANNEL,
      data: { userId, channelId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permission to delete channel')

    await this.channelService.delete(channelId)
    return res
      .status(200)
      .json(new ApiResponse(200, { channelId }, 'Channel deleted successfully'))
  }

  async addMember(
    req: CustomRequest<{
      channelId: string
      memberId: string
      projectId: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { channelId, projectId, memberId } = req.body

    this.logger.info({
      msg: MSG.CHAT.CHANNEL.ADD_MEMBER,
      data: { userId, channelId, memberId, projectId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permission to add member in channel')

    const isMemberExist = await this.memberService.getMemberById(memberId)
    if (!isMemberExist) throw new ApiError(404, 'Member not found')

    await this.channelService.addMember(channelId, memberId)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { memberId, channelId },
          'Member added successfully'
        )
      )
  }

  async removeMember(
    req: CustomRequest<{
      channelId: string
      memberId: string
      projectId: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { channelId, projectId, memberId } = req.body

    this.logger.info({
      msg: MSG.CHAT.CHANNEL.REMOVE_MEMBER,
      data: { userId, channelId, memberId, projectId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(
        403,
        'You have no permission to remove member from channel'
      )

    const isMemberExist = await this.memberService.getMemberById(memberId)
    if (!isMemberExist) throw new ApiError(404, 'Member not found')
    if (isMemberExist.role === MemberRole.OWNER)
      throw new ApiError(
        403,
        'You have no permission to remove owner from channel'
      )

    await this.channelService.removeMember(channelId, memberId)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { memberId, channelId },
          'Member removed successfully'
        )
      )
  }
}

class MessageController {
  constructor(
    private messageService: MessageService,
    private memberService: MemberService,
    private channelService: ChannelService,
    private conversationService: ConversationService,
    private uploadService: UploadService,
    private reactionService: ReactionService,
    private logger: Logger
  ) {}

  async getMessages(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const {
      projectId,
      parentMessageId,
      channelId,
      conversationId,
      page,
      limit,
      search,
    } = req.query as unknown as {
      projectId: string
      page: number
      limit: number
      channelId: string | null
      parentMessageId: string | null
      conversationId: string | null
      search: string
    }
    this.logger.info({
      msg: MSG.CHAT.CHANNEL.GET_CHANNELS,
      data: { userId, projectId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const result = (await this.messageService.getMessages(
      channelId,
      conversationId,
      member._id as unknown as string,
      parentMessageId,
      { page, limit, search }
    )) as any

    const r = await Promise.all(
      (result.messages as Message[]).map(async (m: any) => {
        const reactions = await this.reactionService.getReactions(m._id)
        return { ...m, reactions }
      })
    )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...result, messages: r },
          'Messages fetched successfully'
        )
      )
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, channelId, messageId, conversationId } = req.query as {
      projectId: string
      channelId: string
      messageId: string
      conversationId: string
    }
    this.logger.info({
      msg: MSG.CHAT.MESSAGE.GET_MESSAGE,
      data: { userId, projectId, messageId, channelId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (channelId) {
      const channel = await this.channelService.get(channelId)
      if (!channel) throw new ApiError(404, 'Channel not found')
    } else if (conversationId) {
      const conversation = await this.conversationService.get(conversationId)
      if (!conversation) throw new ApiError(404, 'Conversation not found')
    } else {
      throw new ApiError(400, 'Not found any channel or conversation')
    }

    const message = await this.messageService.getFullMessage(
      messageId,
      member._id as unknown as string
    )
    if (!message) throw new ApiError(404, 'Message not found')

    const reactions = await this.reactionService.getReactions(messageId)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...message, reactions },
          'Message fetched successfully'
        )
      )
  }

  async create(req: CustomRequest<Message>, res: Response) {
    const user = req.user
    const userId = req.user?._id as string
    const message = req.body

    this.logger.info({
      msg: MSG.CHAT.MESSAGE.CREATE_MESSAGE,
      data: { userId, message },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      message.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    if (message.channelId) {
      const channel = await this.channelService.get(
        message.channelId as unknown as string
      )
      if (!channel) throw new ApiError(404, 'Channel not found')
    } else if (message.conversationId) {
      const conversation = await this.conversationService.get(
        message.conversationId as unknown as string
      )
      if (!conversation) throw new ApiError(404, 'Conversation not found')
    } else {
      throw new ApiError(400, 'Not found any channel or conversation')
    }

    let uploadResult = null
    if (req?.file?.path) {
      uploadResult = await this.uploadService.upload(req.file?.path as string)
    }

    const createdMessage = await this.messageService.create({
      ...message,
      memberId: member._id,
      image: {
        url: uploadResult?.secure_url as string,
        id: uploadResult?.public_id as string,
      },
    })

    const data = {
      _id: createdMessage._id,
      body: createdMessage.body,
      image: createdMessage.image,
      createdAt: new Date(),
      updatedAt: new Date(),
      member: {
        _id: member._id,
        email: user?.email,
        role: member.role,
        user: {
          fullName: user?.fullName,
          email: user?.email,
          avatar: user?.avatar,
        },
      },
      isCreator: false,
      reactions: [],
    }

    if (!message.parentMessageId)
      io.to(
        (message.channelId
          ? message.channelId
          : message.conversationId) as unknown as string
      ).emit('CREATED_MESSAGE', data)
    else
      io.to(message.parentMessageId as unknown as string).emit(
        'CREATED_THREAD',
        data
      )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { message: createdMessage },
          'Message created successfully'
        )
      )
  }

  async update(
    req: CustomRequest<
      {
        messageId: string
      } & Message
    >,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { messageId, ...message } = req.body

    this.logger.info({
      msg: MSG.CHAT.MESSAGE.UPDATE_MESSAGE,
      data: { userId, message },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      message.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    if (
      !message.channelId &&
      !message.conversationId &&
      !message.parentMessageId
    ) {
      throw new ApiError(400, 'Channel or Conversation not found')
    }

    if (message.channelId) {
      const channel = await this.channelService.get(
        message.channelId as unknown as string
      )
      if (!channel) throw new ApiError(404, 'Channel not found')
    } else if (message.conversationId) {
      const conversation = await this.conversationService.get(
        message.conversationId as unknown as string
      )
      if (!conversation) throw new ApiError(404, 'Conversation not found')
    } else if (message.parentMessageId) {
      const parentMessage = await this.messageService.get(
        message.parentMessageId as unknown as string
      )
      if (!parentMessage) throw new ApiError(404, 'Message not found')
    }

    const existedMessage = await this.messageService.get(messageId)
    if (!existedMessage) throw new ApiError(404, 'Message not found')

    if (
      member?.role == MemberRole.MEMBER &&
      existedMessage.memberId.toString() !== member._id.toString()
    )
      throw new ApiError(401, 'You have no permission to update message')

    const updatedMessage = await this.messageService.update(messageId, message)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { message: updatedMessage },
          'Message updated successfully'
        )
      )
  }

  async delete(
    req: CustomRequest<{
      messageId: string
      projectId: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { messageId, projectId } = req.body

    this.logger.info({
      msg: MSG.CHAT.MESSAGE.DELETE_MESSAGE,
      data: { userId, messageId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const existedMessage = await this.messageService.get(messageId)
    if (!existedMessage) throw new ApiError(404, 'Message not found')

    if (
      member?.role == MemberRole.MEMBER &&
      existedMessage.memberId.toString() !== member._id.toString()
    )
      throw new ApiError(401, 'You have no permission to delete message')

    await this.messageService.delete(messageId)
    return res
      .status(200)
      .json(new ApiResponse(200, { messageId }, 'Message deleted successfully'))
  }
}

class ReactionController {
  constructor(
    private reactionService: ReactionService,
    private memberService: MemberService,
    private logger: Logger
  ) {}

  async add(req: CustomRequest<Reaction>, res: Response) {
    const userId = req.user?._id as string
    const reaction = req.body

    this.logger.info({
      msg: MSG.CHAT.REACTION.ADD_REACTION,
      data: { userId, reaction },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      reaction.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const existedReaction = await this.reactionService.get(
      member._id as unknown as string,
      reaction.messageId as unknown as string,
      reaction.value
    )

    if (existedReaction)
      await this.reactionService.delete(
        existedReaction._id as unknown as string
      )
    else
      await this.reactionService.create({ ...reaction, memberId: member._id })

    return res
      .status(200)
      .json(new ApiResponse(200, { reaction }, 'Reaction added successfully'))
  }
}

class ConversationController {
  constructor(
    private conversationService: ConversationService,
    private memberService: MemberService,
    private logger: Logger
  ) {}

  async create(req: CustomRequest<Conversation>, res: Response) {
    const userId = req.user?._id as string
    const conversation = req.body

    this.logger.info({
      msg: MSG.CHAT.CONVERSATION.CREATE_CONVERSATION,
      data: { userId, conversation },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      conversation.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const existsOne = await this.conversationService.findByMembersId(
      conversation.memberOneId as unknown as string,
      conversation.memberTwoId as unknown as string
    )
    const existsTwo = await this.conversationService.findByMembersId(
      conversation.memberTwoId as unknown as string,
      conversation.memberOneId as unknown as string
    )

    if (existsOne || existsTwo)
      throw new ApiError(400, 'Conversation already created')

    const createdCoversation =
      await this.conversationService.create(conversation)
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          createdCoversation,
          'Conversation created successfully'
        )
      )
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, conversationId } = req.query as {
      projectId: string
      conversationId: string
    }

    this.logger.info({
      msg: MSG.CHAT.CONVERSATION.GET_CONVERSATION,
      data: { userId, conversationId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const conversation = await this.conversationService.get(conversationId)
    return res
      .status(200)
      .json(
        new ApiResponse(201, conversation, 'Conversation fetched successfully')
      )
  }

  async getConversations(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId } = req.query as { projectId: string }

    this.logger.info({
      msg: MSG.CHAT.CONVERSATION.GET_CONVERSATIONS,
      data: { userId, projectId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const conversations =
      await this.conversationService.getConversationsByMemberId(
        member._id as unknown as string
      )

    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          conversations,
          'Conversations fetched successfully'
        )
      )
  }

  async delete(
    req: CustomRequest<{ conversationId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { projectId, conversationId } = req.body

    this.logger.info({
      msg: MSG.CHAT.CONVERSATION.DELETE_CONVERSATION,
      data: { userId, projectId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const conversation = await this.conversationService.get(conversationId)
    if (!conversation) throw new ApiError(404, 'Conversation not found')

    await this.conversationService.delete(conversationId)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { conversationId },
          'Conversation deleted successfully'
        )
      )
  }
}

export {
  ChannelController,
  MessageController,
  ReactionController,
  ConversationController,
}
