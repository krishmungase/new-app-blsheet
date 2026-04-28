import { body, checkSchema, query } from 'express-validator'
import {
  projectIdBodyValidator,
  projectIdQueryValidator,
} from './project.validators'

export const channelValidator = [
  ...projectIdBodyValidator,
  body('name').trim().notEmpty().withMessage('Channel name is required'),
]

export const channelIdValidator = [
  body('channelId')
    .notEmpty()
    .withMessage('Channel ID is required')
    .isMongoId()
    .withMessage('Channel ID invalid'),
]

export const channleIdQueryValidator = [
  query('channelId')
    .notEmpty()
    .withMessage('Channel ID is required')
    .isMongoId()
    .withMessage('Channel ID invalid'),
]

export const messageIdQueryValidator = [
  query('messageId')
    .notEmpty()
    .withMessage('Message ID is required')
    .isMongoId()
    .withMessage('Message ID invalid'),
]

export const messageIdBodyValidator = [
  body('messageId')
    .notEmpty()
    .withMessage('Message ID is required')
    .isMongoId()
    .withMessage('Message ID invalid'),
]

export const createMessageValidator = [
  ...projectIdBodyValidator,
  body('body').notEmpty().withMessage('Message content required'),
]

export const updateMessageValidator = [
  ...createMessageValidator,
  ...messageIdBodyValidator,
]

export const deleteMessageValidator = [
  ...messageIdBodyValidator,
  ...projectIdBodyValidator,
]

export const getMessagesValidator = [...projectIdQueryValidator]

export const getMessagesFilterValidator = checkSchema(
  {
    page: {
      customSanitizer: {
        options: (value) => {
          const parsedValue = Number(value)
          return isNaN(parsedValue) ? 1 : parsedValue
        },
      },
    },

    limit: {
      customSanitizer: {
        options: (value) => {
          const parsedValue = Number(value)
          return isNaN(parsedValue) ? 20 : parsedValue
        },
      },
    },

    search: {
      customSanitizer: {
        options: (value) => {
          if (!value) return ''
          return value
        },
      },
    },
  },
  ['query']
)

export const conversationIdQueryValidator = [
  query('conversationId')
    .notEmpty()
    .withMessage('Conversation ID is required')
    .isMongoId()
    .withMessage('Conversation ID invalid'),
]

export const conversationIdBodyValidator = [
  body('conversationId')
    .notEmpty()
    .withMessage('Conversation ID is required')
    .isMongoId()
    .withMessage('Conversation ID invalid'),
]

export const createConversationValidator = [
  ...projectIdBodyValidator,
  body('memberOneId')
    .notEmpty()
    .withMessage('MemberOne ID is required')
    .isMongoId()
    .withMessage('MemberOne ID invalid'),
  body('memberTwoId')
    .notEmpty()
    .withMessage('MemberTwo ID is required')
    .isMongoId()
    .withMessage('MemberTwo ID invalid'),
]

export const deleteConversationValidator = [
  ...projectIdBodyValidator,
  ...conversationIdBodyValidator,
]
