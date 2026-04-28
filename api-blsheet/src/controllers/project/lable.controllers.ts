import { Response } from 'express'

import { ApiError, ApiResponse } from '../../utils'
import { LableService, MemberService } from '../../services'
import { Lable } from '../../types/projects/lable.types'
import { CustomRequest } from '../../types/shared/shared.types'
import { MemberRole } from '../../types/projects/member.types'

class LableController {
  constructor(
    private lableService: LableService,
    private memberService: MemberService
  ) {}

  async create(req: CustomRequest<Lable>, res: Response) {
    const userId = req.user?._id as string
    const lable = req.body

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      lable.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permission to create lable')

    const createdLable = await this.lableService.create(lable)
    return res
      .status(201)
      .json(new ApiResponse(201, createdLable, 'Lable created successfully'))
  }

  async update(req: CustomRequest<Lable & { lableId: string }>, res: Response) {
    const userId = req.user?._id as string
    const { lableId, ...lable } = req.body

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      lable.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permission to update lable')

    const updatedLable = await this.lableService.update(lableId, lable)
    return res
      .status(201)
      .json(new ApiResponse(201, updatedLable, 'Lable updated successfully'))
  }

  async delete(
    req: CustomRequest<{ projectId: string; lableId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { projectId, lableId } = req.body

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permission to delete lable')

    await this.lableService.delete(lableId)
    return res
      .status(200)
      .json(new ApiResponse(201, { lableId }, 'Lable deleted successfully'))
  }

  async getLables(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, page, limit, name } = req.query as unknown as {
      projectId: string
      page: number
      limit: number
      name: string
    }

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const lables = await this.lableService.getLables(projectId, {
      page,
      limit,
      name,
    })
    return res
      .status(200)
      .json(new ApiResponse(200, lables, 'Lables fetched successfully'))
  }
}

export default LableController
