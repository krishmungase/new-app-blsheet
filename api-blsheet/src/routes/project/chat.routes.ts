import {
  conversationIdQueryValidator,
  createConversationValidator,
  deleteConversationValidator,
} from './../../validators/project/chat.validators'
import express from 'express'

import { logger } from '../../logger'
import { asyncHandler } from '../../utils'
import { uploader, validate, verifyJWT } from '../../middlewares'
import {
  ChannelController,
  ConversationController,
  MessageController,
  ReactionController,
} from '../../controllers'
import {
  ChannelService,
  ConversationService,
  MemberService,
  MessageService,
  ReactionService,
  UploadService,
} from '../../services'
import {
  ChannelModel,
  ChannelModelType,
  ConversationModel,
  MemberModel,
  MemberModelType,
  MessageModel,
  MessageModelType,
  ReactionModel,
} from '../../models'

import {
  channelIdValidator,
  channelValidator,
  channleIdQueryValidator,
  createMessageValidator,
  deleteMessageValidator,
  getMessagesFilterValidator,
  getMessagesValidator,
  updateMessageValidator,
} from '../../validators/project/chat.validators'
import {
  projectIdBodyValidator,
  projectIdQueryValidator,
} from '../../validators/project/project.validators'
import { memberIdValidator } from '../../validators/project/team.validators'

const chatRoutes = express.Router()
const channelService = new ChannelService(
  ChannelModel as unknown as ChannelModelType
)
const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const channelController = new ChannelController(
  channelService,
  memberService,
  logger
)

const reactionService = new ReactionService(ReactionModel)
const reactionController = new ReactionController(
  reactionService,
  memberService,
  logger
)

const conversationService = new ConversationService(ConversationModel)
const conversationController = new ConversationController(
  conversationService,
  memberService,
  logger
)

const messageService = new MessageService(
  MessageModel as unknown as MessageModelType
)
const uploadService = new UploadService()
const messageController = new MessageController(
  messageService,
  memberService,
  channelService,
  conversationService,
  uploadService,
  reactionService,
  logger
)

chatRoutes
  .route('/channel')
  .get(
    channleIdQueryValidator,
    projectIdQueryValidator,
    validate,
    verifyJWT,
    asyncHandler((req, res) => channelController.get(req, res))
  )
  .post(
    channelValidator,
    validate,
    verifyJWT,
    asyncHandler((req, res) => channelController.create(req, res))
  )
  .delete(
    projectIdBodyValidator,
    channelIdValidator,
    validate,
    verifyJWT,
    asyncHandler((req, res) => channelController.delete(req, res))
  )
  .put(
    channelValidator,
    channelIdValidator,
    validate,
    verifyJWT,
    asyncHandler((req, res) => channelController.update(req, res))
  )

chatRoutes.get(
  '/channels',
  projectIdQueryValidator,
  validate,
  verifyJWT,
  asyncHandler((req, res) => channelController.getChannels(req, res))
)

chatRoutes
  .route('/message')
  .get(
    verifyJWT,
    validate,
    asyncHandler((req, res) => messageController.get(req, res))
  )
  .post(
    verifyJWT,
    uploader.single('image'),
    createMessageValidator,
    validate,
    asyncHandler((req, res) => messageController.create(req, res))
  )
  .put(
    verifyJWT,
    updateMessageValidator,
    validate,
    asyncHandler((req, res) => messageController.update(req, res))
  )
  .delete(
    verifyJWT,
    deleteMessageValidator,
    validate,
    asyncHandler((req, res) => messageController.delete(req, res))
  )

chatRoutes.get(
  '/messages',
  verifyJWT,
  getMessagesValidator,
  getMessagesFilterValidator,
  validate,
  asyncHandler((req, res) => messageController.getMessages(req, res))
)

chatRoutes.route('/message/reaction').post(
  verifyJWT,
  validate,
  asyncHandler((req, res) => reactionController.add(req, res))
)

chatRoutes
  .route('/conversation')
  .get(
    verifyJWT,
    conversationIdQueryValidator,
    projectIdQueryValidator,
    validate,
    asyncHandler((req, res) => conversationController.get(req, res))
  )
  .post(
    verifyJWT,
    createConversationValidator,
    validate,
    asyncHandler((req, res) => conversationController.create(req, res))
  )
  .delete(
    verifyJWT,
    deleteConversationValidator,
    validate,
    asyncHandler((req, res) => conversationController.delete(req, res))
  )

chatRoutes.route('/conversation/getConversations').get(
  verifyJWT,
  projectIdQueryValidator,
  validate,
  asyncHandler((req, res) => conversationController.getConversations(req, res))
)

chatRoutes
  .route('/channel/member')
  .post(
    verifyJWT,
    projectIdBodyValidator,
    channelIdValidator,
    memberIdValidator,
    validate,
    asyncHandler((req, res) => channelController.addMember(req, res))
  )
  .delete(
    verifyJWT,
    projectIdBodyValidator,
    channelIdValidator,
    memberIdValidator,
    validate,
    asyncHandler((req, res) => channelController.removeMember(req, res))
  )

export default chatRoutes
