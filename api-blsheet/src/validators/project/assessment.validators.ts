import { body, checkSchema, query } from 'express-validator'
import {
  projectIdBodyValidator,
  projectIdQueryValidator,
} from './project.validators'
import {
  AvailableAssessmentCategoryDisplayType,
  AvailableQuestionType,
} from '../../constants'

export const createAssessmentValidator = [
  body('name').trim().notEmpty().withMessage('Assessment name is required'),
  ...projectIdBodyValidator,
]

export const assessmentIdQueryValidator = [
  query('assessmentId')
    .notEmpty()
    .withMessage('Assessment ID is required')
    .isMongoId()
    .withMessage('Assessment ID is invalid'),
]

export const assessmentIdBodyValidator = [
  body('assessmentId')
    .notEmpty()
    .withMessage('Assessment ID is required')
    .isMongoId()
    .withMessage('Assessment ID is invalid'),
]

export const getAssessmentValidator = [
  ...projectIdQueryValidator,
  ...assessmentIdQueryValidator,
]

export const categoryIdQueryValidator = [
  query('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Category ID is invalid'),
]

export const categoryIdBodyValidator = [
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Category ID is invalid'),
]

export const getCategoryValidator = [
  ...projectIdQueryValidator,
  ...categoryIdQueryValidator,
]

export const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('displayType')
    .trim()
    .notEmpty()
    .withMessage('Display is required')
    .isIn(AvailableAssessmentCategoryDisplayType)
    .withMessage('Display type is invalid'),
  ...assessmentIdBodyValidator,
  ...projectIdBodyValidator,
]

export const createQuestionValidator = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('options')
    .isArray({ min: 1, max: 6 })
    .withMessage(
      'Options must be an array with at least 1 and at most 6 items'
    ),
  body('questionType')
    .trim()
    .notEmpty()
    .withMessage('Question type is required')
    .isIn(AvailableQuestionType)
    .withMessage('Question type is invalid'),
  ...categoryIdBodyValidator,
  ...projectIdBodyValidator,
]

export const questionIdBodyValidator = [
  body('questionId')
    .notEmpty()
    .withMessage('Question ID is required')
    .isMongoId()
    .withMessage('Question ID is invalid'),
]

export const questionIdQueryValidator = [
  query('questionId')
    .notEmpty()
    .withMessage('Question ID is required')
    .isMongoId()
    .withMessage('Question ID is invalid'),
]

export const publishAssessmentBodyValidator = [
  ...assessmentIdBodyValidator,
  ...projectIdBodyValidator,
  body('startDate')
    .trim()
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .toDate()
    .withMessage('Start date is invalid'),
  body('endDate')
    .trim()
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .toDate()
    .withMessage('End date is invalid'),
]

export const getAssessmentsValidator = checkSchema(
  {
    name: {
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

    sortByCreatedAt: {
      customSanitizer: {
        options: (value) => {
          if (!value || value === 'false') return false
          return true
        },
      },
    },

    isAssignedToCurrentUser: {
      customSanitizer: {
        options: (value) => {
          if (!value || value === 'false') return false
          return true
        },
      },
    },

    isCreatedByCurrentUser: {
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
          return isNaN(parsedValue) ? 10 : parsedValue
        },
      },
    },
  },
  ['query']
)

export const assessmentResponseIdBodyValidator = [
  body('assessmentResponseId')
    .notEmpty()
    .withMessage('Assessment ID is required')
    .isMongoId()
    .withMessage('Assessment ID is invalid'),
]

export const assessmentResponseIdQueryValidator = [
  query('assessmentResponseId')
    .notEmpty()
    .withMessage('Assessment ID is required')
    .isMongoId()
    .withMessage('Assessment ID is invalid'),
]
