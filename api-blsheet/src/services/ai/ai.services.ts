import OpenAI from 'openai'
import Groq from 'groq-sdk'

import { generateTaskPrompt } from '../../constants/prompt'
import {
  AIProvider,
  AIProviderBase,
  AIProviderConfig,
  TaskResponse,
} from '../../types/ai/ai.types'
import { ENV } from '../../config'

class OpenAIHandler implements AIProviderBase {
  private client: OpenAI
  private model: string
  private temperature: number
  private maxTokens: number

  constructor(config: AIProviderConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey })
    this.model = config.model || 'gpt-4o'
    this.temperature = config.temperature || 0.3
    this.maxTokens = config.maxTokens || 2000
  }

  async generateTask(userPrompt: string): Promise<TaskResponse> {
    const messages = generateTaskPrompt(
      userPrompt
    ) as OpenAI.Chat.ChatCompletionMessage[]
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      response_format: { type: 'json_object' },
    })
    if (!response.choices[0]?.message?.content)
      throw new Error('No response content')

    return this.parseResponse(response.choices[0]?.message?.content)
  }

  private parseResponse(content?: string): TaskResponse {
    if (!content) throw new Error('No response content')
    return JSON.parse(content)
  }
}

class GroqHandler implements AIProviderBase {
  private client: Groq
  private model: string
  private temperature: number
  private maxTokens: number

  constructor(config: AIProviderConfig) {
    this.client = new Groq({ apiKey: config.apiKey || ENV.GROQ_API_KEY })
    this.model = config.model || 'openai/gpt-oss-120b'
    this.temperature = config.temperature || 0.3
    this.maxTokens = config.maxTokens || 2000
  }

  async generateTask(userPrompt: string): Promise<TaskResponse> {
    const messages = generateTaskPrompt(userPrompt) as Array<{
      role: 'system' | 'user' | 'assistant'
      content: string
    }>

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      response_format: { type: 'json_object' },
    })

    if (!response.choices[0]?.message?.content) {
      throw new Error('No response content from Groq')
    }

    return this.parseResponse(response.choices[0].message.content)
  }

  private parseResponse(content: string): TaskResponse {
    try {
      return JSON.parse(content)
    } catch (error) {
      throw new Error(`Failed to parse Groq response: ${error}`)
    }
  }
}

export class AIService {
  private providerHandler: AIProviderBase

  constructor(config: AIProviderConfig) {
    switch (config.provider) {
      case AIProvider.OPENAI:
        this.providerHandler = new OpenAIHandler(config)
        break
      case AIProvider.GROQ:
        this.providerHandler = new GroqHandler(config)
        break
      default:
        throw new Error('Unsupported AI provider')
    }
  }

  async generateTask(userPrompt: string): Promise<TaskResponse> {
    return this.providerHandler.generateTask(userPrompt)
  }
}

export default AIService
