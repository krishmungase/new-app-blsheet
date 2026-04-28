import { body, checkSchema, query } from 'express-validator'

import { projectIdBodyValidator } from './project.validators'

export const teamIdValidator = [
  body('teamId')
    .trim()
    .notEmpty()
    .withMessage('Team ID is required')
    .isMongoId()
    .withMessage('Invalid team ID'),
]

export const memberIdValidator = [
  body('memberId')
    .trim()
    .notEmpty()
    .withMessage('Member ID is required')
    .isMongoId()
    .withMessage('Member ID is Invalid'),
]

export const teamValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  ...projectIdBodyValidator,
]

export const updateTeamValidator = [...teamValidator, ...teamIdValidator]

export const deleteTeamValidator = [
  ...teamIdValidator,
  ...projectIdBodyValidator,
]

export const addOrRemoveTeamMemberValidator = [
  ...teamIdValidator,
  ...projectIdBodyValidator,
  ...memberIdValidator,
]

export const getTeamsQueryValidator = checkSchema(
  {
    name: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          return value ? value : ''
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

export const getTeamQueryValidator = [
  query('projectId')
    .trim()
    .notEmpty()
    .withMessage('Project ID required')
    .isMongoId()
    .withMessage('Invalid project ID'),
  query('teamId')
    .trim()
    .notEmpty()
    .withMessage('Team ID required')
    .isMongoId()
    .withMessage('Invalid team ID'),
]

export const addOrRemoveTeamLeaderValidator = [
  ...teamIdValidator,
  ...projectIdBodyValidator,
  ...memberIdValidator,
  body('isRemove')
    .notEmpty()
    .withMessage('isRemove field is required')
    .isBoolean()
    .withMessage('isRemove field should be a boolean'),
]
