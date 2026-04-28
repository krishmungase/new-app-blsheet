import { body, checkSchema, query } from 'express-validator'
import { projectIdBodyValidator } from './project.validators'
import { memberIdValidator } from './team.validators'

export const documentValidator = [
  ...projectIdBodyValidator,
  body('title').trim().notEmpty().withMessage('Document title is required'),
]

export const docIdValidator = [
  body('docId')
    .trim()
    .notEmpty()
    .withMessage('Document ID is required')
    .isMongoId()
    .withMessage('Invalid document ID'),
]

export const docIdQueryValidator = [
  query('docId')
    .trim()
    .notEmpty()
    .withMessage('Document ID is required')
    .isMongoId()
    .withMessage('Invalid document ID'),
]

export const assignOrMemberValidator = [
  ...docIdValidator,
  ...projectIdBodyValidator,
  ...memberIdValidator,
]

export const getDocsValidator = checkSchema(
  {
    title: {
      customSanitizer: {
        options: (value) => {
          if (!value) return ''
          return value
        },
      },
    },

    status: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          if (value === 'All') return ''
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

    isPublic: {
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
