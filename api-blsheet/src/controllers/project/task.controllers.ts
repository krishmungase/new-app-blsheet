import { Response } from 'express'
import { Logger } from 'winston'
import { ObjectId } from 'mongoose'

import { ENV } from '../../config'
import { ApiError, ApiResponse } from '../../utils'
import { AvailableTaskStatus, MSG } from '../../constants'
import {
  Comment,
  CommentType,
  CustomRequest,
} from '../../types/shared/shared.types'
import {
  GetTasksQuery,
  Task,
  TaskStatus,
} from '../../types/projects/task.types'
import {
  CommentService,
  MailgenService,
  MemberService,
  NotificationService,
  ProjectService,
  TaskService,
} from '../../services'
import { InvitationStatus, MemberRole } from '../../types/projects/member.types'
import { getDateInStr, getLastNDaysData } from '../../utils/date-formatters'

class TaskController {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private memberService: MemberService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private mailgenService: MailgenService,
    private logger: Logger
  ) {}

  async getTask(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const { taskId, projectId } = req.query

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const project = await this.projectService.getProjectById(
      projectId as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const task = await this.taskService.getTask(
      taskId as string,
      member._id as unknown as string
    )
    if (!task) throw new ApiError(404, 'Task not found')

    return res
      .status(200)
      .json(new ApiResponse(200, { task }, 'Task fetched successfully'))
  }

  async getTasks(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const projectId = req.query.projectId as string
    const query = req.query as unknown as GetTasksQuery

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const tasks = await this.taskService.getTasks(
      projectId,
      member._id as unknown as string,
      query
    )
    return res
      .status(200)
      .json(new ApiResponse(200, { tasks }, 'Tasks fetched successfully'))
  }

  async createTask(req: CustomRequest<Task>, res: Response) {
    const userId = req.user?._id as string
    const task = req.body

    this.logger.info({
      msg: MSG.TASK.CREATE_TASK,
      data: { userId, task },
    })

    const project = await this.projectService.getProjectById(
      task.projectId as unknown as string
    )
    if (!project) throw new ApiError(404, 'Project not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      task.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.invitationStatus !== InvitationStatus.ACCEPTED)
      throw new ApiError(403, 'Your are not allowed to create a task')

    const taskNumber = await this.taskService.getTaskNumber(
      task.projectId as unknown as string
    )
    const createdTask = await this.taskService.createTask({
      ...task,
      memberId: member._id,
      taskNumber,
      userId: userId as unknown as ObjectId,
    })

    //TODO: Send notification to owner of task creation

    res
      .status(201)
      .json(
        new ApiResponse(201, { task: createdTask }, 'Task created successfully')
      )
  }

  async updateTask(
    req: CustomRequest<Task & { taskId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const fullName = req.user?.fullName as string
    const taskId = req.body.taskId
    const task = req.body

    this.logger.info({
      msg: MSG.TASK.UPDATE_TASK,
      data: { userId, taskId, task },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      task.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Task not found')

    const existingTask = await this.taskService.getTaskById(taskId)
    if (!existingTask) throw new ApiError(404, 'Task not found')

    if (
      member.role === MemberRole.MEMBER &&
      member._id.toString() !== existingTask.memberId.toString()
    )
      throw new ApiError(403, 'You are not allowed to update this task')

    const updatedTask = await this.taskService.updateTask(taskId, {
      ...task,
      ...(task.status === TaskStatus.COMPLETED && {
        completedDate: new Date(),
      }),
    })

    const isSubtaskAdded = task?.subTasks
      ? task.subTasks.length !== existingTask.subTasks.length
      : false

    if (!isSubtaskAdded) {
      const createdComment = await this.commentService.createComment({
        content: `Task updated by ${fullName}`,
        memberId: member._id,
        commentType: CommentType.COMMENT_UPDATED,
      })

      await this.taskService.addComment(
        taskId,
        createdComment._id as unknown as string
      )
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, { task: updatedTask }, 'Task updated successfully')
      )
  }

  async deleteTask(
    req: CustomRequest<{ projectId: string; taskId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { taskId, projectId } = req.body

    this.logger.info({
      msg: MSG.TASK.DELETE_TASK,
      data: { userId, taskId },
    })

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const existingTask = await this.taskService.getTaskById(taskId)
    if (!existingTask) throw new ApiError(404, 'Task not found')

    if (
      member.role === MemberRole.MEMBER &&
      member._id.toString() !== existingTask.memberId.toString()
    )
      throw new ApiError(403, 'You are not allowed to delete this task')

    await this.taskService.deleteTask(taskId)

    return res
      .status(200)
      .json(new ApiResponse(200, { taskId }, 'Task deleted successfully'))
  }

  async assignMember(
    req: CustomRequest<{ taskId: string; memberId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const fullName = req.user?.fullName as string
    const { taskId, memberId, projectId } = req.body

    this.logger.info({
      msg: MSG.TASK.ASSIGN_MEMBER,
      data: { userId, taskId, memberId, projectId },
    })

    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const task = await this.taskService.getTaskById(taskId)
    if (!task) throw new ApiError(404, 'Task not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You are not allowed to assign members to tasks')

    const assignedMember = await this.memberService.getMemberById(memberId)
    if (!assignedMember) throw new ApiError(404, 'Assignee not found')

    const isAssigned = await this.taskService.checkMemberIsAssigned(
      taskId,
      memberId
    )
    if (isAssigned) throw new ApiError(400, 'Member is assigned already')

    await this.taskService.assignMember(taskId, memberId)
    const frontendTaskLink = `${ENV.FRONTEND_URL}/dashboard/workspace/${projectId}/tasks/${taskId}`

    const { emailHTML, emailText } = this.mailgenService.assignTaskHTML({
      assignee: assignedMember.email,
      link: frontendTaskLink,
      projectAdminName: fullName,
    })

    if (ENV.NODE_ENV === 'production') {
      await this.notificationService.sendEmailInBackground({
        to: assignedMember.email,
        subject: `[${project.name} - ${task.taskNumber}] New Task`,
        text: emailText,
        html: emailHTML,
      })
    }

    const createdComment = await this.commentService.createComment({
      content: `Assigned member: ${assignedMember.email}`,
      memberId: member._id,
      commentType: CommentType.ASSIGNED_MEMBER,
    })

    await this.taskService.addComment(
      taskId,
      createdComment._id as unknown as string
    )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { taskId, memberId },
          'Member assigned to task successfully'
        )
      )
  }

  async removeAssignedMember(
    req: CustomRequest<{ taskId: string; memberId: string; projectId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { taskId, memberId, projectId } = req.body

    this.logger.info({
      msg: MSG.TASK.REMOVE_ASSINGED_MEMBER,
      data: { userId, taskId, memberId, projectId },
    })

    const task = await this.taskService.getTaskById(taskId)
    if (!task) throw new ApiError(404, 'Task not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')
    if (member.role === MemberRole.MEMBER)
      throw new ApiError(403, 'You are not allowed to assign members to tasks')

    const assignedMember = await this.memberService.getMemberById(memberId)
    if (!assignedMember) throw new ApiError(404, 'Assignee member not found')

    const isAssigned = await this.taskService.checkMemberIsAssigned(
      taskId,
      memberId
    )
    if (!isAssigned) throw new ApiError(400, 'Member is not assigned')

    await this.taskService.removeAssignedMember(taskId, memberId)

    const createdComment = await this.commentService.createComment({
      content: `Removed assigned member: ${assignedMember.email}`,
      memberId: member._id,
      commentType: CommentType.REMOVE_ASSIGNED_MEMBER,
    })

    await this.taskService.addComment(
      taskId,
      createdComment._id as unknown as string
    )

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { taskId, memberId },
          'Assigned member removed successfully'
        )
      )
  }

  async addComment(
    req: CustomRequest<Comment & { taskId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { taskId, content } = req.body

    this.logger.info({
      msg: MSG.TASK.CREATE_COMMENT,
      data: { userId, taskId },
    })

    const task = await this.taskService.getTaskById(taskId)
    if (!task) throw new ApiError(404, 'Task not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      task.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const createdComment = await this.commentService.createComment({
      content,
      memberId: member._id,
    })

    await this.taskService.addComment(
      task._id as unknown as string,
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
    req: CustomRequest<{ taskId: string; commentId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { taskId, commentId } = req.body

    this.logger.info({
      msg: MSG.TASK.CREATE_COMMENT,
      data: { userId, taskId },
    })

    const task = await this.taskService.getTaskById(taskId)
    if (!task) throw new ApiError(404, 'Task not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      task.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const comment = await this.commentService.getCommentById(commentId)
    if (!comment) throw new ApiError(404, 'Comment not found')

    if (
      member.role === MemberRole.MEMBER &&
      member._id.toString() !== comment.memberId.toString()
    )
      throw new ApiError(403, 'You have no permissions to remove this comment')

    await this.taskService.removeComment(
      task._id as unknown as string,
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
    req: CustomRequest<Comment & { commentId: string; taskId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const { taskId, content, commentId } = req.body

    this.logger.info({
      msg: MSG.TASK.CREATE_COMMENT,
      data: { userId, taskId },
    })

    const task = await this.taskService.getTaskById(taskId)
    if (!task) throw new ApiError(404, 'Task not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      task.projectId as unknown as string
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

  async changeStatus(
    req: CustomRequest<{ status: TaskStatus; taskId: string }>,
    res: Response
  ) {
    const userId = req.user?._id as string
    const taskId = req.body.taskId
    const { status } = req.body

    this.logger.info({
      msg: MSG.TASK.UPDATE_TASK,
      data: { userId, taskId, status },
    })

    const existingTask = await this.taskService.getTaskById(taskId)
    if (!existingTask) throw new ApiError(404, 'Task not found')

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      existingTask.projectId as unknown as string
    )
    if (!member) throw new ApiError(404, 'Member not found')

    await this.taskService.updateTask(taskId, {
      status,
      ...(status === TaskStatus.COMPLETED && { completedDate: new Date() }),
    })

    const createdComment = await this.commentService.createComment({
      content: `Updated status: ${existingTask.status} → ${status}`,
      memberId: member._id,
      commentType: CommentType.STATUS_UPDATED,
    })

    await this.taskService.addComment(
      taskId,
      createdComment._id as unknown as string
    )

    res
      .status(200)
      .json(
        new ApiResponse(200, { taskId }, 'Task status updated successfully')
      )
  }

  async getLast30DaysTasks(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const projectId = req.query.projectId as string

    this.logger.info({
      msg: MSG.TASK.GET_LAST_30_DAYS_TASKS,
      data: { userId },
    })

    const tasks = await this.taskService.getUserAssignedTasks(userId, projectId)
    let result: any = getLastNDaysData(30)
    tasks.map((task: any) => {
      const f = result.findIndex(
        (tt: any) => tt.completedDate === getDateInStr(task.completedDate)
      )
      if (f !== -1) {
        result[f].count += 1
      } else {
        result.push({
          completedDate: getDateInStr(task.completedDate),
          count: 1,
        })
      }
    })

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Last 30 days completed tasks'))
  }

  async getUserAssignedTasks(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const projectId = req.query.projectId as string

    this.logger.info({
      msg: MSG.TASK.GET_USER_ASSIGNED_TASKS,
      data: { userId },
    })

    const tasks = await this.taskService.getUserAssignedTasks(
      userId,
      projectId,
      true
    )
    const result = AvailableTaskStatus.map((status) => {
      const f = tasks.findIndex((t: any) => t._id === status)
      if (f !== -1) return { status, count: tasks[f].count }
      else return { status, count: 0 }
    })

    const createdTasks = await this.taskService.getUserCreatedTask(userId)

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { tasks: result, createdTasks },
          'Fetched users assigned tasks successfully'
        )
      )
  }

  async getCompletedTasks(req: CustomRequest, res: Response) {
    const userId = req.user?._id as string
    const projectId = req.query.projectId as string
    const query = req.query as unknown as GetTasksQuery

    const member = await this.memberService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    )
    if (!member) throw new ApiError(404, 'Member not found')

    const tasks = await this.taskService.getCompletedTasks(
      projectId,
      member._id as unknown as string,
      query
    )
    return res
      .status(200)
      .json(new ApiResponse(200, tasks, 'Completed tasks fetched successfully'))
  }

  async getMembersCompletedTasks(req: CustomRequest, res: Response) {
    const userId = req.user?._id
    const projectId = req.query.projectId as string
    this.logger.info({
      msg: MSG.TASK.GET_MEMBERS_COMPLETED_TASKS,
      data: { projectId, userId },
    })
    const project = await this.projectService.getProjectById(projectId)
    if (!project) throw new ApiError(404, 'Project not found')

    const details = await this.taskService.getMembersCompletedTasks(projectId)
    return res
      .status(200)
      .json(
        new ApiResponse(200, details, 'Completed tasks fetched successfully')
      )
  }
}

export default TaskController
