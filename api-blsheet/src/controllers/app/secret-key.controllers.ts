import { Logger } from 'winston'
import { Response } from 'express'
import { ObjectId } from 'mongoose'

import { MSG } from '../../constants'
import { ApiError, ApiResponse, generateSecretKey } from '../../utils'
import { ProjectService, SecretKeyService } from '../../services'
import { User } from '../../types/auth/user.types'
import { CustomRequest } from '../../types/shared/shared.types'

class SecretKeyController {
  constructor(
    private secretKeyService: SecretKeyService,
    private projectServie: ProjectService,
    private logger: Logger
  ) {}

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as unknown as ObjectId

    this.logger.info({
      msg: MSG.SECRET_KEY.GET_SECRET_KEY,
      data: { userId },
    })

    const secretKey = await this.secretKeyService.get(userId)
    return res
      .status(200)
      .json(new ApiResponse(200, secretKey, 'Secret key fetched successfully'))
  }

  async create(req: CustomRequest, res: Response) {
    const userId = req.user?._id as unknown as ObjectId

    this.logger.info({
      msg: MSG.SECRET_KEY.CREATE_SECRET_KEY,
      data: { userId },
    })

    const exist = await this.secretKeyService.get(userId)
    if (exist) throw new ApiError(400, 'Secret key already exist')

    const secretKey = await this.secretKeyService.create({
      userId,
      secretKey: generateSecretKey(),
    })
    return res
      .status(200)
      .json(new ApiResponse(200, secretKey, 'Secret key created successfully'))
  }

  async update(req: CustomRequest, res: Response) {
    const userId = req.user as unknown as ObjectId

    this.logger.info({
      msg: MSG.SECRET_KEY.UPDATE_SECRET_KEY,
      data: { userId },
    })

    const exist = await this.secretKeyService.get(userId)
    if (!exist) throw new ApiError(404, 'Secret key not found')

    const secretKey = await this.secretKeyService.update(userId, {
      userId,
      secretKey: generateSecretKey(),
    })
    return res
      .status(200)
      .json(new ApiResponse(200, secretKey, 'Secret key updated successfully'))
  }

  async delete(req: CustomRequest, res: Response) {
    const userId = req.user?._id as unknown as ObjectId

    this.logger.info({
      msg: MSG.SECRET_KEY.DELETE_SECRET_KEY,
      data: { userId },
    })

    const exist = await this.secretKeyService.get(userId)
    if (!exist) throw new ApiError(404, 'Secret key not found')

    await this.secretKeyService.delete(userId)
    return res
      .status(200)
      .json(new ApiResponse(200, { userId }, 'Secret key deleted successfully'))
  }
}

export default SecretKeyController
