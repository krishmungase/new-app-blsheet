import { Logger } from 'winston'
import { Response, Request } from 'express'

import { ENV } from '../../config'
import { MSG } from '../../constants'
import { ApiError, ApiResponse } from '../../utils'
import { TASK_SYSTEM_PROMPT } from '../../prompts'
import { MemberService, ProjectService, TaskLLMService } from '../../services'
import { ProjectRequest } from '../../types/shared/shared.types'
import { Project } from '../../types/projects/project.types'
import { Member } from '../../types/projects/member.types'

const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const currentDate = new Date().toLocaleString('sw-TZ').split(', ').join('T')

class LLMController {
  private readonly taskLLMService
  constructor(
    private projectService: ProjectService,
    private memberService: MemberService,
    private logger: Logger
  ) {
    this.taskLLMService = new TaskLLMService(this.logger)
  }

  buildSystemPrompt(project: Project, member?: Member) {
    return `
      ${TASK_SYSTEM_PROMPT}
      Context (always included in tool calls):
        - userId: ${project.userId}
        - projectId: ${project._id}
        - memberId: ${member?._id}
      Extra realtime info (for reference, not required in tool calls):
        - currentDate: ${currentDate}
        - currentTimezone: ${currentTimezone}
    `
  }

  formatMessages(messages: any[]) {
    const startIndex = Math.max(
      0,
      messages.length - parseInt(ENV?.TOP_K_MESSAGES!)
    )
    const topKMessages = messages.slice(startIndex)

    return topKMessages.map((m) => {
      if (!m?.files?.length) {
        return m
      }
      const fileContent = m.files.map(
        (f: { type: 'image' | 'file'; text: string }) => ({
          type: f.type === 'image' ? 'image_url' : 'text',
          [f.type === 'image' ? 'image_url' : 'text']:
            f.type === 'image' ? { url: f.text } : f.text,
        })
      )
      return {
        role: m.role,
        content: [{ type: 'text', text: m.content }, ...fileContent],
      }
    })
  }

  getChatBot(workflow: any) {
    switch (workflow) {
      case 'Task':
        return this.taskLLMService
      default:
        throw new ApiError(404, 'Workflow not found!')
    }
  }

  async response(req: ProjectRequest, res: Response) {
    const secret = req.secretKey
    const { messages, workflow, projectId } = req.body as any

    this.logger.info({
      msg: MSG.LLM.GENERATE_RESPONSE,
      data: { workflow, len: messages.length, projectId },
    })

    const project = await this.projectService.getProjectById(projectId)
    if (!project)
      return res
        .status(404)
        .json(new ApiResponse(404, { response: 'Project not found' }))

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      secret?.userId as unknown as string,
      project._id
    )
    if (!member)
      return res
        .status(404)
        .json(new ApiResponse(404, { response: 'Member not found' }))

    const systemPrompt = this.buildSystemPrompt(project, member)
    const chats = [
      { role: 'system', content: systemPrompt },
      ...this.formatMessages(messages),
    ]

    const chatBot = this.getChatBot(workflow)
    const responseText = await chatBot.processUserInput(chats, false)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { response: responseText },
          'Response generated successfully'
        )
      )
  }

  async responseWithStream(req: ProjectRequest, res: Response) {
    const secret = req.secretKey
    const { messages, workflow, projectId } = req.body as any

    this.logger.info({
      msg: MSG.LLM.GENERATE_RESPONSE,
      data: { workflow, len: messages.length, projectId },
    })

    const project = await this.projectService.getProjectById(projectId)
    if (!project)
      return res
        .status(404)
        .json(new ApiResponse(404, { response: 'Project not found' }))

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      secret?.userId as unknown as string,
      project._id
    )
    if (!member)
      return res
        .status(404)
        .json(new ApiResponse(404, { response: 'Member not found' }))

    const systemPrompt = this.buildSystemPrompt(project, member)
    const chats = [
      { role: 'system', content: systemPrompt },
      ...this.formatMessages(messages),
    ]

    const chatBot = this.getChatBot(workflow)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
      for await (const event of chatBot.processUserInputWithStreaming(chats)) {
        res.write(`${JSON.stringify(event)}\n\n`)
      }
    } catch (err: any) {
      this.logger.error({
        msg: MSG.LLM.ERROR_WHILE_STREAM_RESPONSE,
        error: err.message,
      })
      res.write(
        `${JSON.stringify({ role: 'assistant', content: 'Streaming failed' })}\n\n`
      )
    } finally {
      res.end()
    }
  }

  async getProjectList(req: ProjectRequest, res: Response) {
    const secret = req.secretKey
    this.logger.info({
      msg: MSG.LLM.GET_PROJECTS_LIST,
      data: { userId: secret?.userId },
    })
    if (!secret?.userId) throw new ApiError(404, 'User not found')
    const projects = await this.memberService.getProjects(
      secret.userId as unknown as string
    )
    return res
      .status(200)
      .json(new ApiResponse(200, projects, 'Projects fetched successfully'))
  }
}

export default LLMController
