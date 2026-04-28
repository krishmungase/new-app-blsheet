import { Response } from 'express'
import { Logger } from 'winston'
import { ObjectId } from 'mongoose'

import {
  CommentService,
  DocumentService,
  MailgenService,
  MemberService,
  NotificationService,
  ProjectService,
} from '../../services'
import { MSG } from '../../constants'
import { ApiError, ApiResponse } from '../../utils'
import { CommentType, CustomRequest } from './../../types/shared/shared.types'
import {
  Document,
  DocAccessType,
  AssignOrRemoveMemberBody,
  GetDocsQuery,
  DocStatus,
} from '../../types/projects/document.types'
import { MemberRole } from '../../types/projects/member.types'
import { ENV } from '../../config'

class DocumentController {
  constructor(
    private documentService: DocumentService,
    private projectService: ProjectService,
    private memberService: MemberService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private mailgenService: MailgenService,
    private logger: Logger
  ) {}

  async getDocument(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { projectId, docId } = req.query as {
      projectId: string
      docId: string
    }

    this.logger.info({
      msg: MSG.DOCUMENT.GET_DOCUMENT,
      data: { userId, projectId, docId },
    })

    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const doc = await this.documentService.getFullDocumentById(
      docId,
      member._id as unknown as string
    )
    if (!doc) throw new ApiError(404, 'Document not found')

    if (
      doc.accessType === DocAccessType.PRIVATE &&
      doc.memberId.toString() !== member._id.toString()
    ) {
      throw new ApiError(403, 'You do not have permission to get this document')
    }

    return res
      .status(200)
      .json(new ApiResponse(200, doc, 'Document fetched successfully'))
  }

  async getDocuments(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const query = req.query as unknown as GetDocsQuery

    this.logger.info({
      msg: MSG.DOCUMENT.GET_DOCUMENTS,
      data: { userId, ...query },
    })

    const project = await this.projectService.getProjectById(
      query.projectId as unknown as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      query.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const documents = await this.documentService.getDocs(
      query.projectId as unknown as string,
      member._id as unknown as string,
      query
    )

    return res.json(
      new ApiResponse(200, documents, 'Documents retrieved successfully')
    )
  }

  async createDocument(req: CustomRequest<Document>, res: Response) {
    const userId = req.user?._id as string
    const { projectId } = req.body

    this.logger.info({
      msg: MSG.DOCUMENT.CREATE_DOCUMENT,
      data: { userId, projectId },
    })

    const project = await this.projectService.getProjectById(
      projectId as unknown as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const createdDocument = await this.documentService.createDocument({
      ...req.body,
      memberId: member.id as ObjectId,
    })

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { doc: createdDocument },
          'Document created successfully'
        )
      )
  }

  async updateDocument(
    req: CustomRequest<Document & { docId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { projectId, docId, ...document } = req.body

    this.logger.info({
      msg: MSG.DOCUMENT.CREATE_DOCUMENT,
      data: { userId, projectId, docId },
    })

    const project = await this.projectService.getProjectById(
      projectId as unknown as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const doc = await this.documentService.getDocumentById(docId)
    if (!doc) throw new ApiError(404, 'Document not found')

    if (
      doc.accessType === DocAccessType.PRIVATE &&
      doc.memberId.toString() !== member._id.toString()
    ) {
      throw new ApiError(
        403,
        'You do not have permission to update this document'
      )
    }

    const updateDocument = await this.documentService.updateDocument(
      docId,
      document
    )

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { doc: updateDocument },
          'Document updated successfully'
        )
      )
  }

  async deleteDocument(
    req: CustomRequest<{ docId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { docId, projectId } = req.body

    this.logger.info({
      msg: MSG.DOCUMENT.DELETE_DOCUMENT,
      data: { userId, docId, projectId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const doc = await this.documentService.getDocumentById(docId)
    if (!doc) throw new ApiError(404, 'Document not found')

    if (
      member.role !== MemberRole.MEMBER &&
      doc?.memberId.toString() !== member._id.toString()
    )
      throw new ApiError(
        403,
        'You do not have permission to delete this document'
      )

    await this.documentService.deleteDocument(docId)

    return res
      .status(204)
      .json(new ApiResponse(204, { docId }, 'Document deleted successfully'))
  }

  async assignMember(
    req: CustomRequest<AssignOrRemoveMemberBody>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { docId, memberId, projectId } = req.body

    this.logger.info({
      msg: MSG.DOCUMENT.ASSIGN_MEMBER,
      data: { userId, docId, memberId, projectId },
    })

    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const doc = await this.documentService.getDocumentById(docId)
    if (!doc) throw new ApiError(404, 'Document not found')

    if (doc.status !== DocStatus.PUBLISHED) {
      throw new ApiError(
        400,
        'Cannot assign member to a non-published document'
      )
    }

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    if (
      doc.memberId.toString() !== member._id.toString() &&
      member.role === MemberRole.MEMBER
    ) {
      throw new ApiError(
        403,
        'Only project owner, admins and creator can assign members to a document'
      )
    }

    const assignedMember = await this.memberService.getMemberById(memberId)
    if (!assignedMember) throw new ApiError(404, 'Assignee not found')

    const isAssigned = await this.documentService.checkMemberIsAssigned(
      docId,
      memberId
    )
    if (isAssigned) throw new ApiError(400, 'Member is assigned already')

    await this.documentService.assignMember(docId, memberId)
    const frontendDocumentLink = `${ENV.FRONTEND_URL}/dashboard/workspace/${projectId}/docs/${docId}`

    const { emailHTML, emailText } = this.mailgenService.assignDocHTML({
      assignee: assignedMember.email,
      link: frontendDocumentLink,
      projectName: project.name,
      documentName: doc.title,
    })

    if (ENV.NODE_ENV === 'production') {
      await this.notificationService.sendEmailInBackground({
        to: assignedMember.email,
        subject: `📄 New Document Assigned to You - ${doc.title}`,
        text: emailText,
        html: emailHTML,
      })
    }

    const createdComment = await this.commentService.createComment({
      content: `Assigned member: ${assignedMember.email}`,
      memberId: member._id,
      commentType: CommentType.ASSIGNED_MEMBER,
    })

    await this.documentService.addComment(
      docId,
      createdComment._id as unknown as string
    )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { docId, memberId },
          'Member assigned to document successfully'
        )
      )
  }

  async removeMember(
    req: CustomRequest<AssignOrRemoveMemberBody>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { docId, memberId, projectId } = req.body

    this.logger.info({
      msg: MSG.TASK.REMOVE_ASSINGED_MEMBER,
      data: { userId, docId, memberId, projectId },
    })

    const doc = await this.documentService.getDocumentById(docId)
    if (!doc) throw new ApiError(404, 'Document not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    if (
      doc.memberId.toString() !== member._id.toString() &&
      member.role === MemberRole.MEMBER
    ) {
      throw new ApiError(
        403,
        'Only project owner, admins and creator can remove assigned members to a document'
      )
    }

    const assignedMember = await this.memberService.getMemberById(memberId)
    if (!assignedMember) throw new ApiError(404, 'Assignee member not found')

    const isAssigned = await this.documentService.checkMemberIsAssigned(
      docId,
      memberId
    )
    if (!isAssigned) throw new ApiError(400, 'Member is not assigned')

    await this.documentService.removeMember(docId, memberId)

    const createdComment = await this.commentService.createComment({
      content: `Removed assigned member: ${assignedMember.email}`,
      memberId: member._id,
      commentType: CommentType.REMOVE_ASSIGNED_MEMBER,
    })

    await this.documentService.addComment(
      docId,
      createdComment._id as unknown as string
    )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { docId, memberId },
          'Assigned member removed successfully'
        )
      )
  }
}

export default DocumentController
