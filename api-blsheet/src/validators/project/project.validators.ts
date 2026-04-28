import { body, query } from 'express-validator'

const projectValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
]

const projectIdValidator = [
  body('_id')
    .trim()
    .notEmpty()
    .withMessage('Project ID required')
    .isMongoId()
    .withMessage('Invalid project ID'),
]

const projectIdQueryValidator = [
  query('projectId')
    .trim()
    .notEmpty()
    .withMessage('Project ID required')
    .isMongoId()
    .withMessage('Invalid project ID'),
]

const projectIdBodyValidator = [
  body('projectId')
    .trim()
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Project ID is invalid'),
]

const validateOpenAIKey = [
  body('openAiKey').trim().notEmpty().withMessage('OpenAI Key is required'),
  ...projectIdBodyValidator,
]

export {
  projectValidator,
  projectIdValidator,
  projectIdQueryValidator,
  validateOpenAIKey,
  projectIdBodyValidator,
}
