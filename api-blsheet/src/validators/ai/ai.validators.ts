import { body } from 'express-validator'

const aiBodyValidator = [
  body('userPrompt').trim().notEmpty().withMessage('User prompt is required'),

  body('projectId')
    .trim()
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid project ID'),
]

export { aiBodyValidator }
