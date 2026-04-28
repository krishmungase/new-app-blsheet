import mongoose, { ObjectId, PipelineStage } from 'mongoose'
import { DocumentModelType } from '../../models'
import {
  DocAccessType,
  DocStatus,
  Document,
  GetDocsQuery,
} from '../../types/projects/document.types'
import { getMongoosePaginationOptions } from '../../utils'

class DocumentService {
  constructor(private documentModel: DocumentModelType) {}

  async getFullDocumentById(docId: string, memberId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(docId), isDeleted: false } },
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: '_id',
          as: 'member',
        },
      },
      { $unwind: '$member' },
      {
        $lookup: {
          from: 'users',
          localField: 'member.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'members',
          localField: 'assignees',
          foreignField: '_id',
          as: 'membersDetails',
        },
      },
      {
        $addFields: {
          members: {
            $map: {
              input: '$membersDetails',
              as: 'member',
              in: {
                _id: '$$member._id',
                email: '$$member.email',
              },
            },
          },
          isCreator: {
            $eq: ['$memberId', new mongoose.Types.ObjectId(memberId)],
          },
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'commentsDetails',
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'commentsDetails.memberId',
          foreignField: '_id',
          as: 'commentAuthors',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'commentAuthors.userId',
          foreignField: '_id',
          as: 'commentAuthorsUsers',
        },
      },
      {
        $addFields: {
          comments: {
            $map: {
              input: '$commentsDetails',
              as: 'comment',
              in: {
                _id: '$$comment._id',
                content: '$$comment.content',
                commentType: '$$comment.commentType',
                createdAt: '$$comment.createdAt',
                updatedAt: '$$comment.updatedAt',
                author: {
                  $let: {
                    vars: {
                      authorMember: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$commentAuthors',
                              as: 'author',
                              cond: {
                                $eq: ['$$author._id', '$$comment.memberId'],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      _id: '$$authorMember._id',
                      email: '$$authorMember.email',
                      role: '$$authorMember.role',
                      isAuthor: {
                        $eq: [
                          '$$authorMember._id',
                          new mongoose.Types.ObjectId(memberId),
                        ],
                      },
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$commentAuthorsUsers',
                              as: 'user',
                              cond: {
                                $eq: ['$$user._id', '$$authorMember.userId'],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          memberId: 1,
          title: 1,
          content: 1,
          status: 1,
          accessType: 1,
          isCreator: 1,
          members: 1,
          docType: 1,
          creator: {
            fullName: '$user.fullName',
            email: '$member.email',
            role: '$member.role',
            avatar: '$user.avatar',
          },
          comments: {
            _id: 1,
            content: 1,
            commentType: 1,
            createdAt: 1,
            updatedAt: 1,
            author: {
              role: 1,
              email: 1,
              isAuthor: 1,
              user: {
                fullName: 1,
                avatar: 1,
              },
            },
          },
        },
      },
      {
        $addFields: {
          isMember: {
            $in: [new mongoose.Types.ObjectId(memberId), '$members._id'],
          },
        },
      },
    ]

    const result = await this.documentModel.aggregate(pipeline).exec()
    return result.length > 0 ? result[0] : null
  }

  async getDocumentById(documentId: string) {
    return await this.documentModel.findById(documentId)
  }

  async checkMemberIsAssigned(docId: string, memberId: string) {
    const task = await this.documentModel.findById(docId)
    return task?.assignees.includes(memberId as unknown as ObjectId)
  }

  async getAllDocuments() {
    return await this.documentModel.find()
  }

  async createDocument(document: Partial<Document>) {
    return this.documentModel.create(document)
  }

  async updateDocument(documentId: string, document: Partial<Document>) {
    return await this.documentModel.findByIdAndUpdate(documentId, document, {
      new: true,
    })
  }

  async deleteDocument(documentId: string) {
    return await this.documentModel.findByIdAndDelete(documentId)
  }

  async getDocumentsByProjectId(projectId: string) {
    return await this.documentModel.find({ projectId })
  }

  async addComment(docId: string, commentId: string) {
    return this.documentModel.findByIdAndUpdate(
      docId,
      { $push: { comments: commentId } },
      { new: true }
    )
  }

  async removeComment(docId: string, commentId: string) {
    return this.documentModel.findByIdAndUpdate(
      docId,
      { $pull: { comments: commentId } },
      { new: true }
    )
  }

  async assignMember(docId: string, memberId: string) {
    return this.documentModel.updateOne(
      { _id: docId },
      { $addToSet: { assignees: new mongoose.Types.ObjectId(memberId) } }
    )
  }

  async removeMember(docId: string, memberId: string) {
    return this.documentModel.findByIdAndUpdate(
      docId,
      { $pull: { assignees: memberId } },
      { new: true }
    )
  }

  async getDocs(projectId: string, memberId: string, filters: GetDocsQuery) {
    const {
      title,
      createdByMe,
      assignedToMe,
      status,
      sortByCreated,
      isPublic,
      limit,
      page,
    } = filters

    let searchQuery = new RegExp(title, 'i')

    let pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          isDeleted: false,
          ...(status && { status }),
          ...(createdByMe && {
            memberId: new mongoose.Types.ObjectId(memberId),
          }),
          ...(assignedToMe && {
            assignees: { $in: [memberId] },
            status: DocStatus.PUBLISHED,
          }),
          title: { $regex: searchQuery },
          ...(isPublic && {
            accessType: DocAccessType.PUBLIC,
            status: DocStatus.PUBLISHED,
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
          from: 'members',
          localField: 'assignees',
          foreignField: '_id',
          as: 'membersDetails',
        },
      },
      {
        $addFields: {
          members: {
            $map: {
              input: '$membersDetails',
              as: 'member',
              in: {
                _id: '$$member._id',
                email: '$$member.email',
              },
            },
          },
          commentCount: { $size: '$comments' },
        },
      },
      {
        $project: {
          projectId: 1,
          title: 1,
          status: 1,
          accessType: 1,
          docType: 1,
          isMember: 1,
          isDeleted: 1,
          commentCount: 1,
          createdAt: 1,
          creator: {
            memberId: '$creator._id',
            email: '$creator.email',
            role: '$creator.role',
            fullName: '$user.fullName',
            avatar: '$user.avatar',
          },
          members: 1,
        },
      },
      { $sort: { createdAt: sortByCreated ? 1 : -1 } },
      {
        $addFields: {
          isMember: {
            $in: [new mongoose.Types.ObjectId(memberId), '$members._id'],
          },
        },
      },
    ]

    const docs = await this.documentModel.aggregatePaginate(
      this.documentModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'docs',
        },
      })
    )

    return docs
  }
}

export default DocumentService
