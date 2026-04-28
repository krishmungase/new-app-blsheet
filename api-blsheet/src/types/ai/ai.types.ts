export interface TaskResponse {
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  taskType: string
  dueDate: string
}

export enum AIProvider {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek',
  GROQ = 'groq',
}

export interface AIProviderConfig {
  provider: AIProvider
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface AIProviderBase {
  generateTask(prompt: string): Promise<TaskResponse>
}
