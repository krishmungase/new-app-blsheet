import { Logger } from 'winston'
import { Response } from 'express'
import { ObjectId } from 'mongoose'

import { MSG } from '../../constants'
import { ApiError, ApiResponse } from '../../utils'
import {
  CommentService,
  IssueService,
  MailgenService,
  MemberService,
  NotificationService,
  ProjectService,
} from '../../services'

import {
  GetIssuesFilters,
  Issue,
  IssueStatus,
} from '../../types/projects/issue.types'
import { Comment, CustomRequest } from '../../types/shared/shared.types'
import { InvitationStatus, MemberRole } from '../../types/projects/member.types'
import { ENV } from '../../config'

class IssueController {
  constructor(
    private issueService: IssueService,
    private projectService: ProjectService,
    private memberService: MemberService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private mailgenService: MailgenService,
    private logger: Logger
  ) {}

  async getIssue(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { issueId, projectId } = req.query

    this.logger.info({
      msg: MSG.ISSUE.GET_ISSUE,
      data: { userId, issueId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const project = await this.projectService.getProjectById(
      projectId as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const issue = await this.issueService.getIssue(
      issueId as string,
      member._id as unknown as string
    )
    if (!issue) throw new ApiError(404, 'Issue not found')

    return res
      .status(200)
      .json(new ApiResponse(200, issue, 'Issue fetched successfully'))
  }

  async createIssue(req: CustomRequest<Issue>, res: Response) {
    const userId = req.user?._id as string
    const issue = req.body

    this.logger.info({ msg: MSG.ISSUE.CREATE_ISSUE, data: { issue, userId } })

    const project = await this.projectService.getProjectById(
      issue.projectId as unknown as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      issue.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.invitationStatus !== InvitationStatus.ACCEPTED)
      throw new ApiError(403, 'Your are not allowed to create a issue')

    const createdIssue = await this.issueService.createIssue({
      ...issue,
      userId: userId as unknown as ObjectId,
      memberId: member._id,
    })

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { issue: createdIssue },
          'Issue created successfully'
        )
      )
  }

  async updateIssue(
    req: CustomRequest<Issue & { issueId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const issueId = req.body.issueId
    const issue = req.body

    this.logger.info({
      msg: MSG.ISSUE.UPDATE_ISSUE,
      data: { userId, issueId, issue },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      issue.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const existingIssue = await this.issueService.getByIssueId(issueId)
    if (!existingIssue) throw new ApiError(404, 'Issue not found')

    if (
      member.role === MemberRole.MEMBER &&
      member._id.toString() !== existingIssue.memberId.toString()
    )
      throw new ApiError(403, 'You are not allowed to update this task')

    const updatedIssue = await this.issueService.updateIsse(issueId, issue)

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { issue: updatedIssue },
          'Issue updated successfully'
        )
      )
  }

  async getIssues(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const projectId = req.query.projectId as string
    const query = req.query as unknown as GetIssuesFilters

    this.logger.info({ msg: MSG.ISSUE.GET_ISSUES, data: { userId, projectId } })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const issueCounts = await this.issueService.issueCounts(projectId)
    const issues = await this.issueService.getIssues(
      projectId,
      member._id as unknown as string,
      query
    )
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...issues, issueCounts },
          'Issues fetched successfully'
        )
      )
  }

  async deleteIssue(
    req: CustomRequest<{ projectId: string; issueId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { issueId, projectId } = req.body

    this.logger.info({
      msg: MSG.ISSUE.DELETE_ISSUE,
      data: { userId, issueId, projectId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const existingIssue = await this.issueService.getByIssueId(issueId)
    if (!existingIssue) throw new ApiError(404, 'Issue not found')

    if (
      member.role === MemberRole.MEMBER &&
      member._id.toString() !== existingIssue.memberId.toString()
    )
      throw new ApiError(403, 'You are not allowed to delete this issue')

    await this.issueService.deleteIssue(issueId)

    return res
      .status(200)
      .json(new ApiResponse(200, { issueId }, 'Issue deleted successfully'))
  }

  async assignMember(
    req: CustomRequest<{
      issueId: string
      memberId: string
      projectId: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const fullName = req.user?.fullName as string
    const { issueId, memberId, projectId } = req.body

    this.logger.info({
      msg: MSG.ISSUE.ASSIGN_MEMBER,
      data: { userId, issueId, memberId, projectId },
    })

    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const issue = await this.issueService.getByIssueId(issueId)
    if (!issue || issue.isDeleted) throw new ApiError(404, 'Issue not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You are not allowed to assign members to issue')

    const assignedMember = await this.memberService.getMemberById(memberId)
    if (!assignedMember) throw new ApiError(404, 'Assignee not found')

    const isAssigned = await this.issueService.checkMemberIsAssigned(
      issueId,
      memberId
    )
    if (isAssigned) throw new ApiError(400, 'Member is assigned already')

    await this.issueService.assignMember(issueId, memberId)
    const frontendIssueLink = `${ENV.FRONTEND_URL}/dashboard/workspace/${projectId}/issues/${issueId}`

    const { emailHTML, emailText } = this.mailgenService.assignIssueHTML({
      assignee: assignedMember.email,
      link: frontendIssueLink,
      projectAdminName: fullName,
    })

    if (ENV.NODE_ENV === 'production') {
      await this.notificationService.sendEmailInBackground({
        to: assignedMember.email,
        subject: `[${project.name}] New Issue`,
        text: emailText,
        html: emailHTML,
      })
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { issueId, memberId },
          'Member assigned to issue successfully'
        )
      )
  }

  async removeAssignedMember(
    req: CustomRequest<{
      issueId: string
      memberId: string
      projectId: string
    }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { issueId, memberId, projectId } = req.body

    this.logger.info({
      msg: MSG.ISSUE.REMOVE_ASSIGNED_MEMBER,
      data: { userId, issueId, memberId, projectId },
    })

    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const issue = await this.issueService.getByIssueId(issueId)
    if (!issue || issue.isDeleted) throw new ApiError(404, 'Issue not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(
        403,
        'You are not allowed to remove assigned members from issue'
      )

    const assignedMember = await this.memberService.getMemberById(memberId)
    if (!assignedMember) throw new ApiError(404, 'Assignee not found')

    const isAssigned = await this.issueService.checkMemberIsAssigned(
      issueId,
      memberId
    )
    if (!isAssigned) throw new ApiError(400, 'Member is not assigned')

    await this.issueService.removeAssignedMember(issueId, memberId)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { issueId, memberId },
          'Member successfully unassigned from the issue.'
        )
      )
  }

  async changeStatus(
    req: CustomRequest<{ status: IssueStatus; issueId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const issueId = req.body.issueId
    const { status } = req.body

    this.logger.info({
      msg: MSG.TASK.UPDATE_TASK,
      data: { userId, issueId, status },
    })

    const existingIssue = await this.issueService.getByIssueId(issueId)
    if (!existingIssue) throw new ApiError(404, 'Issue not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      existingIssue.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You have no permissions to change issue status.')

    await this.issueService.updateIsse(issueId, {
      status,
      ...(status === IssueStatus.CLOSED && {
        closedDate: new Date(),
        closedBy: userId as unknown as ObjectId,
      }),
    })

    res
      .status(200)
      .json(
        new ApiResponse(200, { issueId }, 'Issue status updated successfully')
      )
  }

  async addComment(
    req: CustomRequest<Comment & { issueId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { issueId, content } = req.body

    this.logger.info({
      msg: MSG.TASK.CREATE_COMMENT,
      data: { userId, issueId },
    })

    const issue = await this.issueService.getByIssueId(issueId)
    if (!issue) throw new ApiError(404, 'Issue not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      issue.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const createdComment = await this.commentService.createComment({
      content,
      memberId: member._id,
    })

    await this.issueService.addComment(
      issueId,
      createdComment._id as unknown as string
    )

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { commentId: createdComment._id },
          'Comment added successfully'
        )
      )
  }

  async removeComment(
    req: CustomRequest<{ issueId: string; commentId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { issueId, commentId } = req.body

    this.logger.info({
      msg: MSG.TASK.CREATE_COMMENT,
      data: { userId, issueId },
    })

    const issue = await this.issueService.getByIssueId(issueId)
    if (!issue) throw new ApiError(404, 'Issue not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      issue.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const comment = await this.commentService.getCommentById(commentId)
    if (!comment) throw new ApiError(404, 'Comment not found')

    if (
      member.role === MemberRole.MEMBER &&
      member._id.toString() !== comment.memberId.toString()
    )
      throw new ApiError(403, 'You have no permissions to remove this comment')

    await this.issueService.removeComment(
      issueId,
      comment._id as unknown as string
    )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { commentId: comment._id },
          'Comment removed successfully'
        )
      )
  }

  async updateComment(
    req: CustomRequest<Comment & { commentId: string; issueId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { issueId, content, commentId } = req.body

    this.logger.info({
      msg: MSG.TASK.CREATE_COMMENT,
      data: { userId, issueId },
    })

    const issue = await this.issueService.getByIssueId(issueId)
    if (!issue) throw new ApiError(404, 'Issue not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      issue.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const comment = await this.commentService.getCommentById(commentId)
    if (!comment) throw new ApiError(404, 'Comment not found')

    if (
      member._id.toString() !== comment.memberId.toString() ||
      member.role === MemberRole.MEMBER
    )
      throw new ApiError(403, 'You do not have permission to update comment')

    await this.commentService.updateComment({ content }, commentId)

    return res
      .status(201)
      .json(new ApiResponse(201, { commentId }, 'Comment added successfully'))
  }
}

export default IssueController
