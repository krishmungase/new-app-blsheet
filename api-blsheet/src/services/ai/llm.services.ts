import { ChatOpenAI } from '@langchain/openai'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { END, MessagesAnnotation, StateGraph } from '@langchain/langgraph'

import { ENV } from '../../config'
import { MSG } from '../../constants'
import { Logger } from 'winston'
import { createTask, getTasks } from '../../tools'

const MODEL_CONFIG = {
  model: 'openai/gpt-4.1',
  temperature: 0,
  streaming: true,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: ENV.OPENROUTER_API_KEY,
  },
}

class LLMService {
  private readonly tools
  private readonly llm
  private readonly toolNode
  private readonly app

  constructor(
    private logger: Logger,
    tools: any[] = []
  ) {
    this.logger = logger
    this.tools = tools

    this.llm = new ChatOpenAI(MODEL_CONFIG).bindTools(this.tools)
    this.toolNode = new ToolNode(this.tools)
    this.app = this.buildGraph()
  }

  buildGraph() {
    const graph = new StateGraph(MessagesAnnotation)
      .addNode('llm', this.callLLM.bind(this))
      .addNode('tools', this.toolNode)
      .addEdge('__start__', 'llm')
      .addEdge('tools', 'llm')
      .addConditionalEdges('llm', this.routeToTools, {
        __end__: END,
        tools: 'tools',
      })

    return graph.compile()
  }

  async callLLM(state: any) {
    try {
      const response = await this.llm.invoke(state.messages)
      return { messages: [response] }
    } catch (error) {
      this.logger.error({
        msg: MSG.LLM.ERROR_CALL_TO_LLM,
        error: JSON.stringify(error),
      })
      return {
        messages: [
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
          },
        ],
      }
    }
  }

  routeToTools(state: any) {
    const lastMessage = state.messages.at(-1)
    return lastMessage?.tool_calls?.length ? 'tools' : '__end__'
  }

  async processUserInput(messages: any, useStreaming = false) {
    try {
      if (useStreaming) {
        return this.processUserInputWithStreaming(messages)
      }
      const result = await this.app.invoke({ messages })
      return result.messages.at(-1)?.content || 'No response generated.'
    } catch (error: any) {
      this.logger.error({
        msg: MSG.LLM.PROCESS_USER_INPUT_ERROR,
        error: error.message,
      })
      return "Sorry, I couldn't process your request. Please try again."
    }
  }

  async *processUserInputWithStreaming(messages: any) {
    try {
      const stream = this.app.streamEvents({ messages }, { version: 'v2' })
      for await (const event of stream) {
        const kind = event.event
        switch (kind) {
          case 'on_chat_model_stream': {
            const chunk = event.data?.chunk
            yield {
              role: 'assistant',
              content: chunk?.content,
            }
            break
          }
          case 'on_tool_start': {
            yield { role: 'tool_start', content: event.data }
            break
          }
          case 'on_tool_stream': {
            yield { role: 'tool_stream', content: event.data }
            break
          }
          case 'on_tool_end': {
            yield { role: 'tool_results', content: event.data }
            break
          }
          case 'on_error': {
            this.logger.error({
              msg: MSG.LLM.ERROR_WHILE_STREAM_RESPONSE,
              error: JSON.stringify(event.data),
            })
            yield {
              role: 'assistant',
              content:
                'Sorry, I encountered an error while streaming. Please try again.',
            }
            break
          }
          case 'on_complete': {
            yield { role: 'complete', content: 'Complete' }
            break
          }
        }
      }
    } catch (error) {
      this.logger.error({
        msg: MSG.LLM.ERROR_WHILE_STREAM_RESPONSE,
        error: JSON.stringify(error),
      })
      yield {
        role: 'assistant',
        data: "Sorry, I couldn't process your request.",
      }
    }
  }
}

export default LLMService

export class TaskLLMService extends LLMService {
  constructor(logger: Logger) {
    const tools = [createTask, getTasks]
    super(logger, tools)
  }
}
