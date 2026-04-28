import mongoose, { ObjectId, PipelineStage } from 'mongoose'

import {
  AssessmentCategoryQuestionModel,
  AssessmentCategoryResponseModel,
  AssessmentModelType,
  AssessmentResponseModelType,
} from '../../models'
import { AssessmentCategoryModel } from '../../models'
import {
  Assessment,
  AssessmentCategoryResponse,
  AssessmentResponse,
  Category,
  GetAssessmentsFilters,
  Question,
} from '../../types/projects/assessment.types'
import { getMongoosePaginationOptions } from '../../utils'

class AssessmentService {
  constructor(private assessmentModel: AssessmentModelType) {}

  async create(assessment: Assessment) {
    return await this.assessmentModel.create(assessment)
  }

  async update(assessmentId: string, assessment: Partial<Assessment>) {
    return await this.assessmentModel.findByIdAndUpdate(
      assessmentId,
      assessment,
      { new: true }
    )
  }

  async delete(assessmentId: string) {
    return await this.assessmentModel.findByIdAndUpdate(
      assessmentId,
      { isDeleted: true },
      { new: true }
    )
  }

  async get(assessmentId: string) {
    return await this.assessmentModel.findById(assessmentId)
  }

  async getFullAssessment(assessmentId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(assessmentId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      {
        $lookup: {
          from: 'users',
          localField: 'creator.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'assessment_categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          status: 1,
          isDeleted: 1,
          projectId: 1,
          memberId: 1,
          responses: 1,
          creator: {
            fullName: '$user.fullName',
            email: '$creator.email',
            role: '$creator.role',
            avatar: '$user.avatar',
          },
          categories: {
            _id: 1,
            name: 1,
            description: 1,
            totalQuestions: 1,
            displayType: 1,
            weightage: 1,
            questions: 1,
            createdAt: 1,
          },
        },
      },
    ]
    const result = await this.assessmentModel.aggregate(pipeline)
    if (result.length > 0) return result[0]
    return null
  }

  async assignMember(assessmentId: string, memberId: string) {
    return this.assessmentModel.updateOne(
      { _id: assessmentId },
      { $addToSet: { assignees: new mongoose.Types.ObjectId(memberId) } }
    )
  }

  async removeAssignedMember(assessmentId: string, memberId: string) {
    return this.assessmentModel.findByIdAndUpdate(
      assessmentId,
      { $pull: { assignees: memberId } },
      { new: true }
    )
  }

  async checkMemberIsAssigned(assessmentId: string, memberId: string) {
    const assessment = await this.assessmentModel.findById(assessmentId)
    return assessment?.assignees.includes(memberId as unknown as ObjectId)
  }

  async addCategory(assessmentId: string, categoryId: string) {
    return this.assessmentModel.updateOne(
      { _id: assessmentId },
      { $addToSet: { categories: new mongoose.Types.ObjectId(categoryId) } }
    )
  }

  async removeCategory(assessmentId: string, categoryId: string) {
    return this.assessmentModel.findByIdAndUpdate(
      assessmentId,
      { $pull: { categories: categoryId } },
      { new: true }
    )
  }

  async getAssessments(
    projectId: string,
    memberId: string,
    filters: GetAssessmentsFilters
  ) {
    const {
      page,
      limit,
      name,
      status,
      sortByCreatedAt,
      isAssignedToCurrentUser,
      isCreatedByCurrentUser,
    } = filters

    const searchQuery = new RegExp(name, 'i')

    const pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          isDeleted: false,
          ...(status && { status }),
          ...(isCreatedByCurrentUser && {
            memberId: new mongoose.Types.ObjectId(memberId),
          }),
          ...(isAssignedToCurrentUser && {
            'responses.memberId': {
              $in: [new mongoose.Types.ObjectId(memberId)],
            },
          }),
          ...(searchQuery && {
            name: { $regex: searchQuery },
          }),
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $unwind: {
          path: '$creator',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creator.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'assignees',
          foreignField: '_id',
          as: 'assignees',
        },
      },
      {
        $addFields: {
          isCreator: {
            $eq: ['$memberId', new mongoose.Types.ObjectId(memberId)],
          },
        },
      },
      {
        $project: {
          projectId: 1,
          name: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
          commentCount: 1,
          createdAt: 1,
          isCreator: 1,
          creator: {
            memberId: '$creator._id',
            email: '$creator.email',
            role: '$creator.role',
            fullName: '$user.fullName',
            avatar: '$user.avatar',
          },
          assignees: {
            _id: 1,
            email: 1,
            role: 1,
          },
        },
      },
      {
        $sort: {
          createdAt: sortByCreatedAt ? 1 : -1,
        },
      },
    ]

    const assessments = await this.assessmentModel.aggregatePaginate(
      this.assessmentModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'assessments',
        },
      })
    )

    return assessments
  }
}

class AssessmentCategoryService {
  constructor(
    private assessmentCategoryModel: typeof AssessmentCategoryModel
  ) {}

  async get(categoryId: string) {
    return await this.assessmentCategoryModel.findById(categoryId)
  }

  async getFullCategory(categoryId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
      {
        $lookup: {
          from: 'assessment_category_questions',
          localField: 'questions',
          foreignField: '_id',
          as: 'questions',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          displayType: 1,
          weightage: 1,
          questions: {
            _id: 1,
            questionType: 1,
            question: 1,
            options: 1,
          },
        },
      },
    ]
    const result = await this.assessmentCategoryModel.aggregate(pipeline)
    if (result.length > 0) return result[0]
    return null
  }

  async create(category: Category) {
    return await this.assessmentCategoryModel.create(category)
  }

  async update(categoryId: string, category: Partial<Category>) {
    return await this.assessmentCategoryModel.findByIdAndUpdate(
      categoryId,
      category,
      { new: true }
    )
  }

  async delete(categoryId: string) {
    return await this.assessmentCategoryModel.deleteOne({ _id: categoryId })
  }

  async addQuestion(categoryId: string, questionId: string) {
    return this.assessmentCategoryModel.updateOne(
      { _id: categoryId },
      { $addToSet: { questions: new mongoose.Types.ObjectId(questionId) } }
    )
  }

  async removeQuestion(categoryId: string, questionId: string) {
    return this.assessmentCategoryModel.findByIdAndUpdate(
      categoryId,
      { $pull: { questions: questionId } },
      { new: true }
    )
  }
}

class AssessmentCategoryQuestionService {
  constructor(
    private assessmentCategoryQuestionModel: typeof AssessmentCategoryQuestionModel
  ) {}

  async create(question: Question) {
    return await this.assessmentCategoryQuestionModel.create(question)
  }

  async update(questionId: string, question: Partial<Question>) {
    return await this.assessmentCategoryQuestionModel.findByIdAndUpdate(
      questionId,
      question,
      { new: true }
    )
  }

  async delete(questionId: string) {
    return await this.assessmentCategoryQuestionModel.deleteOne({
      _id: questionId,
    })
  }

  async get(questionId: string) {
    return await this.assessmentCategoryQuestionModel.findById(questionId)
  }
}

class AssessmentResponseService {
  constructor(private assessmentResponseModel: AssessmentResponseModelType) {}

  async create(assessmentResponse: AssessmentResponse) {
    return await this.assessmentResponseModel.create(assessmentResponse)
  }

  async addCategory(assessmentResponseId: string, categoryId: string) {
    return this.assessmentResponseModel.updateOne(
      { _id: assessmentResponseId },
      {
        $addToSet: {
          categoryResponses: new mongoose.Types.ObjectId(categoryId),
        },
      }
    )
  }

  async removeCategory(assessmentResponseId: string, categoryId: string) {
    return this.assessmentResponseModel.findByIdAndUpdate(
      assessmentResponseId,
      { $pull: { categoryResponses: categoryId } },
      { new: true }
    )
  }

  async delete(assessmentResponseId: string) {
    return await this.assessmentResponseModel.deleteOne({
      _id: assessmentResponseId,
    })
  }

  async get(assessmentResponseId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(assessmentResponseId),
        },
      },
      {
        $lookup: {
          from: 'assessment_category_responses',
          localField: 'categoryResponses',
          foreignField: '_id',
          as: 'categoryResponses',
        },
      },
      {
        $unwind: {
          path: '$categoryResponses',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'assessment_categories',
          localField: 'categoryResponses.categoryId',
          foreignField: '_id',
          as: 'categoryResponses.category',
        },
      },
      {
        $unwind: {
          path: '$categoryResponses.category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          memberId: { $first: '$memberId' },
          assessmentId: { $first: '$assessmentId' },
          submittedAt: { $first: '$submittedAt' },
          startTime: { $first: '$startTime' },
          status: { $first: '$status' },
          categoryResponses: { $push: '$categoryResponses' },
        },
      },
      {
        $lookup: {
          from: 'assessments',
          localField: 'assessmentId',
          foreignField: '_id',
          as: 'assessment',
        },
      },
      {
        $unwind: '$assessment',
      },
      {
        $lookup: {
          from: 'members',
          localField: 'assessment.memberId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $unwind: '$creator',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creator.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          assessmentResponseId: '$_id',
          _id: '$assessmentId',
          memberId: 1,
          name: '$assessment.name',
          submittedAt: 1,
          startTime: 1,
          status: 1,
          creator: {
            email: 1,
            fullName: '$user.fullName',
            avatar: '$user.avatar',
            role: 1,
          },
          categories: {
            $map: {
              input: '$categoryResponses',
              as: 'catResp',
              in: {
                categoryResponseId: '$$catResp._id',
                _id: '$$catResp.category._id',
                name: '$$catResp.category.name',
                description: '$$catResp.category.description',
                weightage: '$$catResp.category.weightage',
                displayType: '$$catResp.category.displayType',
                totalCompletedQuestions: '$$catResp.totalCompletedQuestions',
                totalQuestions: '$$catResp.totalQuestions',
              },
            },
          },
        },
      },
    ]
    const result = await this.assessmentResponseModel.aggregate(pipeline)
    if (result.length > 0) return result[0]
    return null
  }

  async getAssessments(
    projectId: string,
    memberId: string,
    filters: GetAssessmentsFilters
  ) {
    const { page, limit, name, status, sortByCreatedAt } = filters
    const searchQuery = new RegExp(name, 'i')

    const pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          memberId: new mongoose.Types.ObjectId(memberId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'assessments',
          localField: 'assessmentId',
          foreignField: '_id',
          as: 'assessment',
        },
      },
      { $unwind: '$assessment' },
      {
        $lookup: {
          from: 'members',
          localField: 'assessment.memberId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $unwind: {
          path: '$creator',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creator.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: sortByCreatedAt ? 1 : -1,
        },
      },
      {
        $project: {
          assessmentResponseId: '$_id',
          _id: '$assessementId',
          status: 1,
          name: '$assessment.name',
          startDate: '$assessment.startDate',
          endDate: '$assessment.endDate',
          submittedAt: 1,
          startTime: 1,
          creator: {
            email: 1,
            fullName: '$user.fullName',
            avatar: '$user.avatar',
            role: 1,
          },
        },
      },
      {
        $match: {
          ...(searchQuery && {
            name: { $regex: searchQuery },
          }),
        },
      },
    ]

    const assessments = await this.assessmentResponseModel.aggregatePaginate(
      this.assessmentResponseModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'assessments',
        },
      })
    )

    return assessments
  }

  async update(
    assessmentResponseId: string,
    assessmentResponse: Partial<AssessmentResponse>
  ) {
    return await this.assessmentResponseModel.findByIdAndUpdate(
      assessmentResponseId,
      assessmentResponse,
      { new: true }
    )
  }
}

class AssessmentCategoryResponseService {
  constructor(
    private assessmentCategoryResponseModel: typeof AssessmentCategoryResponseModel
  ) {}

  async create(category: AssessmentCategoryResponse) {
    return await this.assessmentCategoryResponseModel.create(category)
  }

  async deleteResponseCategories(
    memberId: string,
    assessmentResponseId: string
  ) {
    return await this.assessmentCategoryResponseModel.deleteMany({
      memberId,
      assessmentResponseId,
    })
  }
}

export {
  AssessmentService,
  AssessmentCategoryService,
  AssessmentCategoryQuestionService,
  AssessmentResponseService,
  AssessmentCategoryResponseService,
}
