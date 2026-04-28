import { response, Response } from 'express'
import { Logger } from 'winston'

import { MSG } from '../../constants'
import { ApiError, ApiResponse, divideHundred } from '../../utils'
import { CustomRequest } from '../../types/shared/shared.types'
import {
  Assessment,
  AssessmentResponseStatus,
  AssessmentStatus,
  AssignOrRemoveMemberBody,
  Category,
  FullAssessment,
  GetAssessmentsFilters,
  GetAssinedAssessment,
  PublishAssessmentBody,
  Question,
} from '../../types/projects/assessment.types'
import {
  AssessmentCategoryQuestionService,
  AssessmentCategoryResponseService,
  AssessmentCategoryService,
  AssessmentResponseService,
  AssessmentService,
  MemberService,
  ProjectService,
} from '../../services'
import { ObjectId } from 'mongoose'

class AssessmentController {
  constructor(
    private assessmentService: AssessmentService,
    private projectService: ProjectService,
    private memberService: MemberService,
    private assessmentResponseService: AssessmentResponseService,
    private assessmentCategoryResponseService: AssessmentCategoryResponseService,
    private logger: Logger
  ) {}

  async preCheck(userId: string, projectId: string) {
    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    return { project, member }
  }

  async create(req: CustomRequest<Assessment>, res: Response) {
    const userId = req.user?._id as string
    const assessment = req.body

    this.logger.info({
      msg: MSG.ASSESSMENT.CREATE_ASSESSMENT,
      data: { assessment, userId },
    })

    const { member } = await this.preCheck(
      userId,
      assessment.projectId as unknown as string
    )

    const createdAssessment = await this.assessmentService.create({
      ...assessment,
      memberId: member._id,
    })

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { assessment: createdAssessment },
          'Assessment created successfully'
        )
      )
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { assessmentId, projectId } = req.query as {
      assessmentId: string
      projectId: string
    }
    this.logger.info({
      msg: MSG.ASSESSMENT.GET_ASSESSMENT,
      data: { assessmentId, projectId, userId },
    })
    await this.preCheck(userId, projectId)
    const assessment =
      await this.assessmentService.getFullAssessment(assessmentId)
    res
      .status(200)
      .json(
        new ApiResponse(200, { assessment }, 'Assessment fetched successfully')
      )
  }

  async delete(
    req: CustomRequest<{ assessmentId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { assessmentId, projectId } = req.body as {
      assessmentId: string
      projectId: string
    }
    this.logger.info({
      msg: MSG.ASSESSMENT.DELETE_ASSESSMENT,
      data: { assessmentId, projectId, userId },
    })
    const { member } = await this.preCheck(userId, projectId)

    const assessment = await this.assessmentService.get(assessmentId)
    if (!assessment) throw new ApiError(404, 'Assessment not found')

    if (assessment.memberId.toString() !== member._id.toString())
      throw new ApiError(
        403,
        'You do not have permission to delete this assessment."'
      )

    if (assessment.status === AssessmentStatus.PUBLISHED)
      throw new ApiError(
        400,
        'Deletion is not allowed for published assessments.'
      )

    await this.assessmentService.delete(assessmentId)

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { assessmentId },
          'Assessment deleted successfully'
        )
      )
  }

  async update(
    req: CustomRequest<Assessment & { assessmentId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { assessmentId, ...assessment } = req.body

    this.logger.info({
      msg: MSG.ASSESSMENT.UPDATE_ASSESSMENT,
      data: { assessment, assessmentId, userId },
    })

    const { member } = await this.preCheck(
      userId,
      assessment.projectId as unknown as string
    )

    const existedAssessment = await this.assessmentService.get(assessmentId)
    if (!existedAssessment) throw new ApiError(404, 'Assessment not found')

    if (existedAssessment.memberId.toString() !== member._id.toString())
      throw new ApiError(
        403,
        'You have no permission to update this assessment.'
      )

    const updatedAssessment = await this.assessmentService.update(
      assessmentId,
      assessment
    )

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { assessment: updatedAssessment },
          'Assessment updated successfully'
        )
      )
  }

  async getAssessments(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, ...filters } = req.query as unknown as {
      projectId: string
      filters: GetAssessmentsFilters
    }

    this.logger.info({
      msg: MSG.ASSESSMENT.GET_ASSESSMENTS,
      data: { projectId, userId, filters },
    })

    const { member } = await this.preCheck(userId, projectId)

    const assessments = await this.assessmentService.getAssessments(
      projectId,
      member._id as unknown as string,
      filters as unknown as GetAssessmentsFilters
    )

    return res
      .status(200)
      .json(
        new ApiResponse(200, assessments, 'Assessments fetched successfully')
      )
  }

  async publishAssessment(
    req: CustomRequest<PublishAssessmentBody>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { assessmentId, projectId, assignee, startDate, endDate } = req.body

    this.logger.info({
      msg: MSG.ASSESSMENT.PUBLISH_ASSESSMENT,
      data: { userId, assessmentId, assignee },
    })

    if (!assignee.length) throw new ApiError(404, 'Assignee not found')

    const { member } = await this.preCheck(userId, projectId)

    const assessment = (await this.assessmentService.getFullAssessment(
      assessmentId
    )) as unknown as FullAssessment
    if (!assessment || assessment.isDeleted)
      throw new ApiError(404, 'Assessment not found')
    if (assessment.memberId.toString() !== member._id.toString())
      throw new ApiError(
        403,
        'You have no permission to publish this assessment'
      )
    if (assessment.status === AssessmentStatus.PUBLISHED)
      throw new ApiError(404, 'Assessment already published')

    const result: any = await Promise.all(
      assignee.map(async (memberId) => {
        const isPresent = assessment.responses.find(
          (r) => r?.memberId.toString() === memberId
        )

        if (isPresent) return isPresent

        const assessmentMemberResponse =
          await this.assessmentResponseService.create({
            assessmentId: assessment._id as unknown as ObjectId,
            categoryResponses: [],
            memberId: memberId as unknown as ObjectId,
            status: AssessmentResponseStatus.PENDING,
            projectId: projectId as unknown as ObjectId,
          })

        await Promise.all(
          assessment.categories.map(async (category) => {
            const categoryResponse =
              await this.assessmentCategoryResponseService.create({
                memberId: memberId as unknown as ObjectId,
                assessmentResponseId:
                  assessmentMemberResponse._id as unknown as ObjectId,
                answers: category.questions.map((p) => ({ questionId: p })),
                categoryId: category?._id as unknown as ObjectId,
                totalQuestions: category.questions.length,
                totalCompletedQuestions: 0,
              })

            await this.assessmentResponseService.addCategory(
              assessmentMemberResponse._id as unknown as string,
              categoryResponse._id as unknown as string
            )

            return categoryResponse
          })
        )

        return assessmentMemberResponse
      })
    )

    const newResponses = result.filter(Boolean).map((p: any) => ({
      memberId: p.memberId,
      assessmentResponseId: p?._id ?? p?.assessmentResponseId,
    }))

    await this.assessmentService.update(assessmentId, {
      responses: newResponses,
      startDate,
      endDate,
      status: AssessmentStatus.PUBLISHED,
    })

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { assessmentId },
          'Assessment published successfully'
        )
      )
  }

  async assignOrRemoveMember(
    req: CustomRequest<AssignOrRemoveMemberBody>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const data = req.body
    this.logger.info({
      msg: MSG.ASSESSMENT.ASSIGN_OR_REMOVE_MEMBER,
      data: { ...data },
    })

    const { member } = await this.preCheck(userId, data.projectId)

    const assessment = (await this.assessmentService.getFullAssessment(
      data.assessmentId
    )) as unknown as FullAssessment
    if (!assessment || assessment.isDeleted)
      throw new ApiError(404, 'Assessment not found')
    if (assessment.memberId.toString() !== member._id.toString())
      throw new ApiError(
        403,
        'You have no permission to assign or remove member from this assessment'
      )
    if (assessment.status !== AssessmentStatus.PUBLISHED)
      throw new ApiError(404, 'Assessment not published yet')

    const isExist = assessment.responses.find(
      (r) => r?.memberId.toString() === data.memberId
    )

    if (data.isRemove) {
      if (!isExist) throw new ApiError(404, 'Assignee not found!')
      const responses = assessment.responses.filter(
        (r) => r.memberId !== isExist.memberId
      )
      await this.assessmentService.update(data.assessmentId, { responses })

      await this.assessmentResponseService.delete(
        isExist.assessmentResponseId as unknown as string
      )

      await this.assessmentCategoryResponseService.deleteResponseCategories(
        data.memberId,
        isExist.assessmentResponseId as unknown as string
      )
    } else {
      if (isExist) throw new ApiError(404, 'Member already assigned')

      const assessmentMemberResponse =
        await this.assessmentResponseService.create({
          assessmentId: assessment._id as unknown as ObjectId,
          categoryResponses: [],
          memberId: data.memberId as unknown as ObjectId,
          status: AssessmentResponseStatus.PENDING,
          projectId: data.projectId as unknown as ObjectId,
        })

      await Promise.all(
        assessment.categories.map(async (category) => {
          const categoryResponse =
            await this.assessmentCategoryResponseService.create({
              memberId: data.memberId as unknown as ObjectId,
              assessmentResponseId:
                assessmentMemberResponse._id as unknown as ObjectId,
              answers: category.questions.map((p) => ({ questionId: p })),
              categoryId: category?._id as unknown as ObjectId,
              totalQuestions: category.questions.length,
              totalCompletedQuestions: 0,
            })

          await this.assessmentResponseService.addCategory(
            assessmentMemberResponse._id as unknown as string,
            categoryResponse._id as unknown as string
          )

          return categoryResponse
        })
      )

      await this.assessmentService.update(data.assessmentId, {
        responses: [
          ...assessment.responses,
          {
            memberId: data.memberId as unknown as ObjectId,
            assessmentResponseId:
              assessmentMemberResponse._id as unknown as ObjectId,
          },
        ],
        status: AssessmentStatus.PUBLISHED,
      })
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          `Member ${data.isRemove ? 'removed' : 'assigned'} successfully`
        )
      )
  }

  async getAssignedAssessment(
    req: CustomRequest<GetAssinedAssessment>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { assessmentResponseId, projectId } = req.query as {
      assessmentResponseId: string
      projectId: string
    }

    this.logger.info({
      msg: MSG.ASSESSMENT.GET_ASSINGED_ASSESSMENT,
      data: { assessmentResponseId, projectId, userId },
    })

    const { member } = await this.preCheck(userId, projectId)
    const assessment =
      await this.assessmentResponseService.get(assessmentResponseId)

    if (!assessment) throw new ApiError(404, 'Assessment not found')
    if (member._id.toString() !== assessment.memberId.toString())
      throw new ApiError(403, 'You have no permission to fetch this assessment')

    return res
      .status(200)
      .json(
        new ApiResponse(200, { assessment }, 'Assessment fetched successfully')
      )
  }

  async getAssignedAssessments(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, ...filters } = req.query as unknown as {
      projectId: string
      filters: GetAssessmentsFilters
    }

    this.logger.info({
      msg: MSG.ASSESSMENT.GET_ASSINGED_ASSESSMENTS,
      data: { projectId, userId, filters },
    })

    const { member } = await this.preCheck(userId, projectId)

    const assessments = await this.assessmentResponseService.getAssessments(
      projectId,
      member._id as unknown as string,
      filters as unknown as GetAssessmentsFilters
    )

    return res
      .status(200)
      .json(
        new ApiResponse(200, assessments, 'Assessments fetched successfully')
      )
  }
}

class AssessmentCategoryController {
  constructor(
    private assessmentService: AssessmentService,
    private assessmentCategoryService: AssessmentCategoryService,
    private projectService: ProjectService,
    private memberService: MemberService,
    private logger: Logger
  ) {}

  async preCheck(userId: string, projectId: string) {
    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    return { project, member }
  }

  async getAssessment(assessmentId: string) {
    const assessment = await this.assessmentService.get(assessmentId)
    if (!assessment) throw new ApiError(404, 'Assessment not found')
    return assessment
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { categoryId, projectId } = req.query as {
      categoryId: string
      projectId: string
    }

    this.logger.info({
      msg: MSG.ASSESSMENT.CATEGORY.GET_CATEGORY,
      data: { categoryId, projectId, userId },
    })

    await this.preCheck(userId, projectId)
    const category =
      await this.assessmentCategoryService.getFullCategory(categoryId)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { category },
          'Assessment Category fetched successfully'
        )
      )
  }

  async create(req: CustomRequest<Category>, res: Response) {
    const userId = req.user?._id as string
    const category = req.body

    this.logger.info({
      msg: MSG.ASSESSMENT.CATEGORY.CREATE_CATEGORY,
      data: { category, userId },
    })

    const { member } = await this.preCheck(
      userId,
      category.projectId as unknown as string
    )
    const assessment = await this.getAssessment(
      category.assessmentId as unknown as string
    )
    if (assessment.memberId.toString() !== member._id.toString())
      throw new ApiError(403, 'You have no permission to create category')

    const totalNumCategories = assessment.categories.length + 1
    const categoryWeightageArray = divideHundred(totalNumCategories)

    const updatePromises = assessment.categories.map((cat, i) => {
      return this.assessmentCategoryService.update(cat as unknown as string, {
        weightage: categoryWeightageArray[i],
      })
    })
    await Promise.all(updatePromises)

    const createdCategory = await this.assessmentCategoryService.create({
      ...category,
      weightage: categoryWeightageArray[totalNumCategories - 1],
    })

    await this.assessmentService.addCategory(
      category.assessmentId as unknown as string,
      createdCategory._id as unknown as string
    )

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { category: createdCategory },
          'Assessment Category created successfully'
        )
      )
  }

  async delete(
    req: CustomRequest<{ categoryId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { categoryId, projectId } = req.body as {
      categoryId: string
      projectId: string
    }
    this.logger.info({
      msg: MSG.ASSESSMENT.CATEGORY.DELETE_CATEGORY,
      data: { categoryId, projectId, userId },
    })
    const { member } = await this.preCheck(userId, projectId)

    const category = await this.assessmentCategoryService.get(categoryId)
    if (!category) throw new ApiError(404, 'Category not found')

    const assessment = await this.assessmentService.get(
      category.assessmentId as unknown as string
    )
    if (!assessment || assessment.isDeleted)
      throw new ApiError(404, 'Assessment not found')

    if (assessment.memberId.toString() !== member._id.toString())
      throw new ApiError(403, 'You have no permission to delete this category.')

    await this.assessmentService.removeCategory(
      assessment._id as unknown as string,
      categoryId
    )
    //TODO: Delete all question belong to this category
    await this.assessmentCategoryService.delete(categoryId)

    res
      .status(200)
      .json(
        new ApiResponse(200, { categoryId }, 'Category deleted successfully')
      )
  }

  async update(
    req: CustomRequest<Category & { categoryId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { categoryId, ...category } = req.body

    this.logger.info({
      msg: MSG.ASSESSMENT.CATEGORY.UPDATE_CATEGORY,
      data: { category, categoryId, userId },
    })

    const { member } = await this.preCheck(
      userId,
      category.projectId as unknown as string
    )

    const existedCategory = await this.assessmentCategoryService.get(categoryId)
    if (!existedCategory) throw new ApiError(404, 'Category not found')

    const existedAssessment = await this.assessmentService.get(
      category.assessmentId as unknown as string
    )
    if (!existedAssessment || existedAssessment.isDeleted)
      throw new ApiError(404, 'Assessment not found')

    if (existedAssessment.memberId.toString() !== member._id.toString())
      throw new ApiError(403, 'You have no permission to update this category.')

    const updatedCategory = await this.assessmentCategoryService.update(
      categoryId,
      category
    )

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { category: updatedCategory },
          'Category updated successfully'
        )
      )
  }
}

class AssessmentCategoryQuestionController {
  constructor(
    private assessmentService: AssessmentService,
    private assessmentCategoryQuestionService: AssessmentCategoryQuestionService,
    private assessmentCategoryService: AssessmentCategoryService,
    private projectService: ProjectService,
    private memberService: MemberService,
    private logger: Logger
  ) {}

  async preCheck(userId: string, projectId: string) {
    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    return { project, member }
  }

  async getCategory(categoryId: string) {
    const category = await this.assessmentCategoryService.get(categoryId)
    if (!category) throw new ApiError(404, 'Assessment Category not found')
    return category
  }

  async getAssessment(assessmentId: string) {
    const assessment = await this.assessmentService.get(assessmentId)
    if (!assessment) throw new ApiError(404, 'Assessment not found')
    return assessment
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { categoryId, questionId, projectId } = req.query as {
      categoryId: string
      projectId: string
      questionId: string
    }

    this.logger.info({
      msg: MSG.ASSESSMENT.QUESTION.GET_QUESTION,
      data: { categoryId, questionId, projectId, userId },
    })

    await this.preCheck(userId, projectId)
    const question =
      await this.assessmentCategoryQuestionService.get(questionId)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { question },
          'Assessment category question fetched successfully'
        )
      )
  }

  async create(
    req: CustomRequest<Question & { projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { projectId, ...question } = req.body

    this.logger.info({
      msg: MSG.ASSESSMENT.QUESTION.CREATE_QUESTION,
      data: { question, userId },
    })

    const { member } = await this.preCheck(userId, projectId)
    const category = await this.getCategory(
      question.categoryId as unknown as string
    )
    const assessment = await this.getAssessment(
      category.assessmentId as unknown as string
    )
    if (assessment.memberId.toString() !== member._id.toString())
      throw new ApiError(403, 'You have no permission to create question')

    const createdQuestion =
      await this.assessmentCategoryQuestionService.create(question)

    await this.assessmentCategoryService.addQuestion(
      question.categoryId as unknown as string,
      createdQuestion._id as unknown as string
    )

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { question: createdQuestion },
          'Assessment category question created successfully'
        )
      )
  }

  async delete(
    req: CustomRequest<{
      questionId: string
      projectId: string
      categoryId: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { questionId, categoryId, projectId } = req.body as {
      questionId: string
      projectId: string
      categoryId: string
    }
    this.logger.info({
      msg: MSG.ASSESSMENT.QUESTION.DELETE_QUESTION,
      data: { questionId, projectId, userId },
    })
    const { member } = await this.preCheck(userId, projectId)

    const category = await this.assessmentCategoryService.get(categoryId)
    if (!category) throw new ApiError(404, 'Category not found')

    const assessment = await this.assessmentService.get(
      category.assessmentId as unknown as string
    )
    if (!assessment || assessment.isDeleted)
      throw new ApiError(404, 'Assessment not found')

    if (assessment.memberId.toString() !== member._id.toString())
      throw new ApiError(403, 'You have no permission to delete this question.')

    const question =
      await this.assessmentCategoryQuestionService.get(questionId)
    if (!question) throw new ApiError(404, 'Question not found')

    await this.assessmentCategoryService.removeQuestion(categoryId, questionId)
    await this.assessmentCategoryQuestionService.delete(questionId)

    res
      .status(200)
      .json(
        new ApiResponse(200, { questionId }, 'Question deleted successfully')
      )
  }

  async update(
    req: CustomRequest<Question & { questionId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { questionId, projectId, ...question } = req.body

    this.logger.info({
      msg: MSG.ASSESSMENT.QUESTION.UPDATE_QUESTION,
      data: { question, questionId, userId },
    })

    const { member } = await this.preCheck(userId, projectId)

    const existedCategory = await this.assessmentCategoryService.get(
      question.categoryId as unknown as string
    )
    if (!existedCategory) throw new ApiError(404, 'Category not found')

    const existedAssessment = await this.assessmentService.get(
      existedCategory.assessmentId as unknown as string
    )
    if (!existedAssessment || existedAssessment.isDeleted)
      throw new ApiError(404, 'Assessment not found')

    if (existedAssessment.memberId.toString() !== member._id.toString())
      throw new ApiError(403, 'You have no permission to update this category.')

    const existedQuestion =
      await this.assessmentCategoryQuestionService.get(questionId)
    if (!existedQuestion) throw new ApiError(404, 'Question not found')

    const updatedCategory = await this.assessmentCategoryQuestionService.update(
      questionId,
      question
    )

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { question: updatedCategory },
          'Question updated successfully'
        )
      )
  }
}

class AssessmentResponseController {
  constructor(
    private assessmentResponseService: AssessmentResponseService,
    private projectService: ProjectService,
    private memberService: MemberService,
    private logger: Logger
  ) {}

  async preCheck(userId: string, projectId: string) {
    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    return { project, member }
  }

  async get(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { assessmentResponseId, projectId } = req.query as {
      assessmentResponseId: string
      projectId: string
    }

    this.logger.info({
      msg: MSG.ASSESSMENT.RESPONSE.GET_RESPONSE,
      data: { assessmentResponseId, projectId, userId },
    })

    const { member } = await this.preCheck(userId, projectId)

    const response =
      await this.assessmentResponseService.get(assessmentResponseId)
    if (!response) throw new ApiError(404, 'Response not found')

    if (response.memberId.toString() !== member._id.toString())
      throw new ApiError(403, 'You have no permission to get this response')

    return res
      .status(200)
      .json(new ApiResponse(200, { response }, 'Response fetched successfully'))
  }

  async startAssessment(
    req: CustomRequest<{
      assessmentResponseId: string
      projectId: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { assessmentResponseId, projectId } = req.body as {
      assessmentResponseId: string
      projectId: string
    }

    this.logger.info({
      msg: MSG.ASSESSMENT.RESPONSE.START_ASSESSMENT,
      data: { assessmentResponseId, projectId, userId },
    })

    const { member } = await this.preCheck(userId, projectId)

    const response =
      await this.assessmentResponseService.get(assessmentResponseId)
    if (!response) throw new ApiError(404, 'Response not found')

    if (response.memberId.toString() !== member._id.toString())
      throw new ApiError(403, 'You have no permission to start this assessment')

    if (response.status === AssessmentResponseStatus.SUBMITTED)
      throw new ApiError(400, 'Assessment already submitted')

    await this.assessmentResponseService.update(assessmentResponseId, {
      status: AssessmentResponseStatus.IN_PROGRESS,
    })

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { assessmentResponseId },
          'Assessment started successfully'
        )
      )
  }

  async submitAssessment(
    req: CustomRequest<{
      assessmentResponseId: string
      projectId: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { assessmentResponseId, projectId } = req.body as {
      assessmentResponseId: string
      projectId: string
    }

    this.logger.info({
      msg: MSG.ASSESSMENT.RESPONSE.SUBMIT_ASSESSMENT,
      data: { assessmentResponseId, projectId, userId },
    })

    const { member } = await this.preCheck(userId, projectId)

    const response =
      await this.assessmentResponseService.get(assessmentResponseId)
    if (!response) throw new ApiError(404, 'Response not found')

    if (response.memberId.toString() !== member._id.toString())
      throw new ApiError(
        403,
        'You have no permission to submit this assessment'
      )

    await this.assessmentResponseService.update(assessmentResponseId, {
      status: AssessmentResponseStatus.SUBMITTED,
    })

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { assessmentResponseId },
          'Assessment submitted successfully'
        )
      )
  }
}

export {
  AssessmentController,
  AssessmentCategoryController,
  AssessmentCategoryQuestionController,
  AssessmentResponseController,
}
