// types/llm.types.ts

import { BaseMessage } from '@langchain/core/messages'
import { Tool } from '@langchain/core/tools'

/**
 * Configuration for the LLM model
 */
export interface IModelConfig {
  model: string
  temperature: number
  streaming: boolean
  configuration: {
    baseURL: string
    apiKey: string
  }
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

/**
 * State annotation for the graph
 */
export interface IGraphState {
  messages: BaseMessage[]
}

/**
 * Stream event types
 */
export type StreamEventType =
  | 'assistant_message'
  | 'tool_start'
  | 'tool_stream'
  | 'tool_results'
  | 'error'
  | 'complete'

/**
 * Streamed event response
 */
export interface IStreamEvent {
  type: StreamEventType
  data: unknown
  timestamp?: number
}

/**
 * Invocation response
 */
export interface IInvocationResponse {
  messages: BaseMessage[]
}

/**
 * Logger interface
 */
export interface ILogger {
  error(data: Record<string, unknown>): void
  warn?(data: Record<string, unknown>): void
  info?(data: Record<string, unknown>): void
  debug?(data: Record<string, unknown>): void
}

/**
 * Tool configuration
 */
export interface IToolConfig {
  tools: Tool[]
  maxConcurrentTools?: number
}

/**
 * Service configuration
 */
export interface ILLMServiceConfig {
  modelConfig: IModelConfig
  logger: ILogger
  tools?: Tool[]
  enableMetrics?: boolean
  requestTimeout?: number
}
