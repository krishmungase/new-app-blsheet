import { Logger } from 'winston'
import { ObjectId } from 'mongoose'
import { Response } from 'express'

import { MSG } from '../../constants'
import { ApiError, ApiResponse } from '../../utils'
import {
  KeyResult,
  Objective,
  OKRStatus,
  TimeFrame,
} from '../../types/projects/objective.types'
import { CustomRequest } from './../../types/shared/shared.types'
import { Member, MemberRole } from '../../types/projects/member.types'
import {
  KeyResultService,
  MemberService,
  ObjectiveService,
  ProjectService,
  TimeFrameService,
} from '../../services'

class TimeFrameController {
  constructor(
    private timeFrameService: TimeFrameService,
    private memberService: MemberService,
    private projectService: ProjectService,
    private logger: Logger
  ) {}

  async isProjectExist(projectId: string) {
    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')
    return project
  }

  async isMember(
    userId: string,
    projectId: string,
    isCheckPermission: boolean = true
  ): Promise<Member> {
    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER && isCheckPermission)
      throw new ApiError(404, 'You have no permission')

    return member
  }

  async create(req: CustomRequest<TimeFrame>, res: Response) {
    const userId = req.user?._id as string
    const timeFrame = req.body

    this.logger.info({
      msg: MSG.TIME_FRAME.CREATE_TIME_FRAME,
      data: { ...timeFrame, userId },
    })

    const project = await this.isProjectExist(
      timeFrame.projectId as unknown as string
    )

    const member = await this.isMember(
      userId,
      timeFrame.projectId as unknown as string
    )

    const isLabelExist =
      await this.timeFrameService.getTimeFrameByLabelAndProjectId(
        timeFrame.label,
        timeFrame.projectId as unknown as string
      )

    if (isLabelExist) throw new ApiError(404, 'Time frame label already exist')

    const createdTimeFrame = await this.timeFrameService.create({
      ...timeFrame,
      createdBy: member._id as unknown as ObjectId,
      projectId: project._id as unknown as ObjectId,
    })

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          createdTimeFrame,
          'Time frame created successfully'
        )
      )
  }

  async update(
    req: CustomRequest<{ timeFrameId: string } & TimeFrame>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { timeFrameId, ...timeFrame } = req.body

    this.logger.info({
      msg: MSG.TIME_FRAME.UPDATE_TIME_FRAME,
      data: { ...timeFrame, userId, timeFrameId },
    })

    await this.isProjectExist(timeFrame.projectId as unknown as string)

    await this.isMember(userId, timeFrame.projectId as unknown as string)

    const updatedTimeFrame = await this.timeFrameService.update(
      timeFrameId,
      timeFrame
    )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedTimeFrame,
          'Time frame updated successfully'
        )
      )
  }

  async delete(
    req: CustomRequest<{ timeFrameId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { timeFrameId, projectId } = req.body

    this.logger.info({
      msg: MSG.TIME_FRAME.DELETE_TIME_FRAME,
      data: { userId, timeFrameId, projectId },
    })

    await this.isProjectExist(projectId)
    await this.isMember(userId, projectId)
    await this.timeFrameService.delete(timeFrameId)

    return res
      .status(200)
      .json(
        new ApiResponse(200, { timeFrameId }, 'Time frame deleted successfully')
      )
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { timeFrameId, projectId } = req.query as {
      timeFrameId: string
      projectId: string
    }

    this.logger.info({
      msg: MSG.TIME_FRAME.GET_TIME_FRAME,
      data: { userId, timeFrameId, projectId },
    })

    await this.isProjectExist(projectId)
    await this.isMember(userId, projectId, false)
    const timeFrame = await this.timeFrameService.get(timeFrameId)

    return res
      .status(200)
      .json(new ApiResponse(200, timeFrame, 'Time frame fetched successfully'))
  }

  async getTimeFrames(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, ...filters } = req.query as unknown as {
      projectId: string
      page: number
      label: string
      limit: number
    }

    this.logger.info({
      msg: MSG.TIME_FRAME.GET_TIME_FRAMES,
      data: { userId, projectId },
    })

    await this.isProjectExist(projectId)
    await this.isMember(userId, projectId, false)
    const timeFrames = await this.timeFrameService.getTimeFrames(
      projectId,
      filters
    )

    return res
      .status(200)
      .json(
        new ApiResponse(200, timeFrames, 'Time frames fetched successfully')
      )
  }
}

class ObjectiveController {
  constructor(
    private objectiveService: ObjectiveService,
    private timeFrameService: TimeFrameService,
    private memberService: MemberService,
    private projectService: ProjectService,
    private logger: Logger
  ) {}

  async isTimeFrameExist(timeFrameId: string) {
    const timeFrame = await this.timeFrameService.get(timeFrameId)
    if (!timeFrame) throw new ApiError(404, 'Time frame not found')
    return timeFrame
  }

  async isProjectExist(projectId: string) {
    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')
    return project
  }

  async isMember(
    userId: string,
    projectId: string,
    isCheckPermission: boolean = true
  ): Promise<Member> {
    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER && isCheckPermission)
      throw new ApiError(404, 'You have no permission')

    return member
  }

  async create(req: CustomRequest<Objective>, res: Response) {
    const userId = req.user?._id as string
    const objective = req.body

    this.logger.info({
      msg: MSG.OBJECTIVE.CREATE_OBJECTIVE,
      data: { ...objective, userId },
    })

    const project = await this.isProjectExist(
      objective.projectId as unknown as string
    )

    const member = await this.isMember(
      userId,
      objective.projectId as unknown as string
    )

    const createdObjective = await this.objectiveService.create({
      ...objective,
      createdBy: member._id as unknown as ObjectId,
      projectId: project._id as unknown as ObjectId,
    })

    await this.objectiveService.addProgressMetric(
      createdObjective._id as unknown as string,
      {
        progress: 0,
        date: new Date(),
        comment: 'Objective created',
      }
    )

    return res
      .status(201)
      .json(
        new ApiResponse(201, createdObjective, 'Objective created successfully')
      )
  }

  async update(
    req: CustomRequest<{ objectiveId: string } & Objective>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { objectiveId, ...objective } = req.body

    this.logger.info({
      msg: MSG.OBJECTIVE.UPDATE_OBJECTIVE,
      data: { ...objective, userId, objectiveId },
    })

    await this.isProjectExist(objective.projectId as unknown as string)

    await this.isMember(userId, objective.projectId as unknown as string)

    const updatedObjective = await this.objectiveService.update(
      objectiveId,
      objective
    )

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedObjective, 'Objective updated successfully')
      )
  }

  async delete(
    req: CustomRequest<{ objectiveId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { objectiveId, projectId } = req.body

    this.logger.info({
      msg: MSG.OBJECTIVE.DELETE_OBJECTIVE,
      data: { userId, objectiveId, projectId },
    })

    await this.isProjectExist(projectId)
    await this.isMember(userId, projectId)
    await this.objectiveService.delete(objectiveId)

    return res
      .status(200)
      .json(
        new ApiResponse(200, { objectiveId }, 'Objective deleted successfully')
      )
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { objectiveId, projectId } = req.query as {
      objectiveId: string
      projectId: string
    }

    this.logger.info({
      msg: MSG.OBJECTIVE.GET_OBJECTIVE,
      data: { userId, objectiveId, projectId },
    })

    await this.isProjectExist(projectId)
    await this.isMember(userId, projectId, false)
    const objective = await this.objectiveService.get(objectiveId)

    return res
      .status(200)
      .json(new ApiResponse(200, objective, 'Objective fetched successfully'))
  }

  async getObjectives(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, timeFrameId, ...filters } = req.query as unknown as {
      projectId: string
      timeFrameId: string
      page: number
      title: string
      limit: number
    }

    this.logger.info({
      msg: MSG.OBJECTIVE.GET_OBJECTIVES,
      data: { userId, projectId },
    })

    await this.isProjectExist(projectId)
    await this.isMember(userId, projectId, false)
    const objectives = await this.objectiveService.getObjectives(
      timeFrameId,
      filters
    )

    return res
      .status(200)
      .json(new ApiResponse(200, objectives, 'Objectives fetched successfully'))
  }
}

class KeyResultController {
  constructor(
    private keyResultService: KeyResultService,
    private objectiveService: ObjectiveService,
    private memberService: MemberService,
    private projectService: ProjectService,
    private logger: Logger
  ) {}

  async isProjectExist(projectId: string) {
    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')
    return project
  }

  async isMember(
    userId: string,
    projectId: string,
    isCheckPermission: boolean = true
  ): Promise<Member> {
    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER && isCheckPermission)
      throw new ApiError(404, 'You have no permission')

    return member
  }

  async create(req: CustomRequest<KeyResult>, res: Response) {
    const userId = req.user?._id as string
    const keyResult = req.body

    this.logger.info({
      msg: MSG.KEY_RESULT.CREATE_KEY_RESULT,
      data: { ...keyResult, userId },
    })

    await this.isProjectExist(keyResult.projectId)
    const member = await this.isMember(userId, keyResult.projectId)

    const createdKeyResult = await this.keyResultService.create({
      ...keyResult,
      createdBy: member._id as unknown as ObjectId,
    })

    await this.objectiveService.addKeyResult(
      keyResult.objectiveId as unknown as string,
      createdKeyResult._id as unknown as string
    )

    await this.keyResultService.addProgressMetric(
      createdKeyResult._id as unknown as string,
      {
        progress: 0,
        date: new Date(),
        comment: 'Key Result created',
      }
    )

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          createdKeyResult,
          'Key Result created successfully'
        )
      )
  }

  async update(
    req: CustomRequest<{ keyResultId: string } & KeyResult>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { keyResultId, ...keyResult } = req.body

    this.logger.info({
      msg: MSG.KEY_RESULT.UPDATE_KEY_RESULT,
      data: { ...keyResult, userId, keyResultId },
    })

    await this.isProjectExist(keyResult.projectId)
    await this.isMember(userId, keyResult.projectId)

    const existedKeyResult = await this.keyResultService.getById(keyResultId)
    if (!existedKeyResult) throw new ApiError(404, 'Key Result not found')

    const progress =
      (Math.min(existedKeyResult.currentValue, keyResult.targetValue) * 100) /
      keyResult.targetValue
    const updatedKeyResult = await this.keyResultService.update(keyResultId, {
      ...keyResult,
      progress,
    })

    if (existedKeyResult.targetValue !== keyResult.targetValue)
      await this.keyResultService.addProgressMetric(keyResultId, {
        progress,
        date: new Date(),
        comment: 'Update Key Result target value',
      })

    const objective = await this.objectiveService.get(
      updatedKeyResult?.objectiveId as unknown as string
    )

    await this.objectiveService.update(
      updatedKeyResult?.objectiveId as unknown as string,
      {
        status:
          objective.progress <= 0
            ? OKRStatus.NOT_STARTED
            : objective.progress === 100
              ? OKRStatus.COMPLETED
              : OKRStatus.IN_PROGRESS,
      }
    )

    await this.objectiveService.addProgressMetric(
      keyResult.objectiveId as unknown as string,
      {
        progress: objective.progress,
        date: new Date(),
      }
    )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedKeyResult,
          'Key Result updated successfully'
        )
      )
  }

  async delete(
    req: CustomRequest<{ keyResultId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { keyResultId, projectId } = req.body

    this.logger.info({
      msg: MSG.KEY_RESULT.DELETE_KEY_RESULT,
      data: { userId, keyResultId, projectId },
    })

    await this.isProjectExist(projectId)
    await this.isMember(userId, projectId)

    const keyResult = await this.keyResultService.getById(keyResultId)
    if (!keyResult) throw new ApiError(404, 'Key Result not found')

    await this.keyResultService.delete(keyResultId)
    await this.objectiveService.removeKeyResult(
      keyResult.objectiveId as unknown as string,
      keyResultId
    )

    return res
      .status(200)
      .json(
        new ApiResponse(200, { keyResultId }, 'Objective deleted successfully')
      )
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { keyResultId, projectId } = req.query as {
      keyResultId: string
      projectId: string
    }

    this.logger.info({
      msg: MSG.KEY_RESULT.GET_KEY_RESULT,
      data: { userId, keyResultId, projectId },
    })

    await this.isProjectExist(projectId)
    await this.isMember(userId, projectId, false)
    const keyResult = await this.keyResultService.get(keyResultId)

    return res
      .status(200)
      .json(new ApiResponse(200, keyResult, 'Key Result fetched successfully'))
  }

  async getKeyResults(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, objectiveId, ...filters } = req.query as unknown as {
      projectId: string
      objectiveId: string
      page: number
      title: string
      limit: number
    }

    this.logger.info({
      msg: MSG.KEY_RESULT.GET_KEY_RESULTS,
      data: { userId, projectId, objectiveId },
    })

    await this.isProjectExist(projectId)
    await this.isMember(userId, projectId, false)
    const KeyResults = await this.keyResultService.getKeyResults(
      objectiveId,
      filters
    )

    return res
      .status(200)
      .json(
        new ApiResponse(200, KeyResults, 'Key Results fetched successfully')
      )
  }

  async updateCurrentValue(
    req: CustomRequest<{
      keyResultId: string
      projectId: string
      currentValue: number
      comment?: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const data = req.body

    this.logger.info({
      msg: MSG.KEY_RESULT.UPDATE_CURRENT_VALUE,
      data: { ...data, userId },
    })

    await this.isProjectExist(data.projectId)
    await this.isMember(userId, data.projectId)

    const keyResult = await this.keyResultService.getById(data.keyResultId)
    if (!keyResult) throw new ApiError(404, 'Key Result not found')

    const progress =
      (Math.min(data.currentValue, keyResult.targetValue) * 100) /
      keyResult.targetValue
    const updatedKeyResult = await this.keyResultService.update(
      data.keyResultId,
      {
        currentValue: data.currentValue,
        progress,
        status:
          data.currentValue <= 0
            ? OKRStatus.NOT_STARTED
            : data.currentValue >= keyResult.targetValue
              ? OKRStatus.COMPLETED
              : OKRStatus.IN_PROGRESS,
      }
    )

    await this.keyResultService.addProgressMetric(data.keyResultId, {
      progress,
      date: new Date(),
      comment: data?.comment,
    })

    const objective = await this.objectiveService.get(
      keyResult.objectiveId as unknown as string
    )

    await this.objectiveService.update(
      keyResult.objectiveId as unknown as string,
      {
        status:
          objective.progress <= 0
            ? OKRStatus.NOT_STARTED
            : objective.progress === 100
              ? OKRStatus.COMPLETED
              : OKRStatus.IN_PROGRESS,
      }
    )

    await this.objectiveService.addProgressMetric(
      keyResult.objectiveId as unknown as string,
      {
        progress: objective.progress,
        date: new Date(),
      }
    )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedKeyResult,
          'Current value updated successfully'
        )
      )
  }
}

export { TimeFrameController, ObjectiveController, KeyResultController }
