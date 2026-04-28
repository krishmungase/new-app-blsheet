import { Response } from 'express'

import { ApiError, ApiResponse } from '../../utils'
import { AIService, ProjectService } from '../../services'

import { AIProvider } from '../../types/ai/ai.types'
import { CustomRequest } from '../../types/shared/shared.types'

class AIController {
  constructor(private projectService: ProjectService) {}

  async generateTask(
    req: CustomRequest<{ userPrompt: string; projectId: string }>,
    res: Response
  ) {
    const { userPrompt, projectId } = req.body

    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    // TODO: Check this user is member of the project

    if (project.openAiKey) {
      const aiService = new AIService({
        apiKey: project.openAiKey,
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 200,
        provider: AIProvider.OPENAI,
      })
      const response = await aiService.generateTask(userPrompt)
      if (!response) throw new ApiError(500, 'Error while generating task')
      return res
        .status(200)
        .json(new ApiResponse(200, response, 'Task generated successfully'))
    } else if (project.geminiKey) {
      const aiService = new AIService({
        apiKey: project.geminiKey,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 200,
        provider: AIProvider.GEMINI,
      })
      const response = await aiService.generateTask(userPrompt)
      if (!response) throw new ApiError(500, 'Error while generating task')
      return res
        .status(200)
        .json(new ApiResponse(200, response, 'Task generated successfully'))
    } else {
      const aiService = new AIService({
        provider: AIProvider.GROQ,
      })
      const response = await aiService.generateTask(userPrompt)
      if (!response) throw new ApiError(500, 'Error while generating task')
      return res
        .status(200)
        .json(new ApiResponse(200, response, 'Task generated successfully'))
    }
  }
}

export default AIController
