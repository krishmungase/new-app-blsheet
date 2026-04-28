import { body, checkSchema, query } from 'express-validator'
import { AvailableIssueStatus, AvailableTaskPriority } from '../../constants'

export const projectIdValidator = [
  body('projectId')
    .trim()
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Project ID is invalid'),
]

export const statusValidator = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(AvailableIssueStatus)
    .withMessage('Status is invalid'),
]

export const issueValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(AvailableTaskPriority)
    .withMessage('Priority is invalid'),
  body('labels').trim().notEmpty().withMessage('Label is required'),
  ...projectIdValidator,
]

export const validateIssueId = [
  body('issueId')
    .trim()
    .notEmpty()
    .withMessage('Issue ID is required')
    .isMongoId()
    .withMessage('Issue ID is invalid'),
]

export const validateProjectIdQuery = [
  query('projectId')
    .trim()
    .notEmpty()
    .withMessage('Project ID required')
    .isMongoId()
    .withMessage('Invalid project ID'),
]

export const getIssuesValidator = checkSchema(
  {
    title: {
      customSanitizer: {
        options: (value) => {
          if (!value) return ''
          return value
        },
      },
    },

    priority: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          if (value === 'All') return ''
          return value
        },
      },
    },

    status: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          if (!value) return 'Open'
          return value
        },
      },
    },

    sortByCreated: {
      customSanitizer: {
        options: (value) => {
          if (!value || value === 'false') return false
          return true
        },
      },
    },

    assignedToMe: {
      customSanitizer: {
        options: (value) => {
          if (!value || value === 'false') return false
          return true
        },
      },
    },

    createdByMe: {
      customSanitizer: {
        options: (value) => {
          if (!value || value === 'false') return false
          return true
        },
      },
    },

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
          return isNaN(parsedValue) ? 6 : parsedValue
        },
      },
    },
  },
  ['query']
)

export const assignMemberValidator = [
  ...validateIssueId,
  ...projectIdValidator,
  body('memberId')
    .trim()
    .notEmpty()
    .withMessage('Member ID required')
    .isMongoId()
    .withMessage('Invalid member ID'),
]

export const getIssueQueryValidator = [
  query('issueId')
    .trim()
    .notEmpty()
    .withMessage('Issue ID required')
    .isMongoId()
    .withMessage('Invalid issue ID'),
  query('projectId')
    .trim()
    .notEmpty()
    .withMessage('Project ID required')
    .isMongoId()
    .withMessage('Invalid project ID'),
]

export const addCommentValidator = [
  ...validateIssueId,
  body('content').trim().notEmpty().withMessage('Content is  required'),
]

export const validateCommentId = [
  body('commentId')
    .trim()
    .notEmpty()
    .withMessage('Comment ID is required')
    .isMongoId()
    .withMessage('Invalid comment ID'),
]

export const removeCommentValidator = [...validateIssueId, ...validateCommentId]

export const updateIssueValidator = [...issueValidator, ...validateIssueId]
