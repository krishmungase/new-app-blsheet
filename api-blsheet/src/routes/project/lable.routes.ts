import express from 'express'

import { asyncHandler } from '../../utils'
import { LableController } from '../../controllers'
import { validate, verifyJWT } from '../../middlewares'
import { LableService, MemberService } from '../../services'
import {
  LableModel,
  LableModelType,
  MemberModel,
  MemberModelType,
} from '../../models'

const lableRoutes = express.Router()
const lableService = new LableService(LableModel as unknown as LableModelType)
const memberService = new MemberService(
  MemberModel as unknown as MemberModelType
)
const lableController = new LableController(lableService, memberService)

lableRoutes
  .route('/')
  .get(
    verifyJWT,
    validate,
    asyncHandler((req, res) => lableController.getLables(req, res))
  )
  .post(
    verifyJWT,
    validate,
    asyncHandler((req, res) => lableController.create(req, res))
  )
  .delete(
    verifyJWT,
    validate,
    asyncHandler((req, res) => lableController.delete(req, res))
  )
  .put(
    verifyJWT,
    validate,
    asyncHandler((req, res) => lableController.update(req, res))
  )

export default lableRoutes
