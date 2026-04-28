import { LucideIcon } from "lucide-react";

export interface RequestType {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH";
  authToken?: string | null;
  data?: any;
  params?: any;
  url?: string;
  isFormData?: boolean;
}

export interface NavLinkType {
  id: number;
  title: string;
  path: string;
  isProtected: boolean;
  icon: LucideIcon;
}

export interface FeatureType {
  id: number;
  title: string;
  description: string;
  Icon: LucideIcon;
  color: string;
}

export interface Avatar {
  url: string;
}

export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserLoginType {
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
  EMAIL_PASSWORD = "EMAIL_PASSWORD",
}

export enum PricingModel {
  FREE = "Free",
  PREMIUM = "Premium",
  ENTERPRISE = "Enterprise",
}

export interface User {
  _id?: string;
  fullName: string;
  email: string;
  avatar: Avatar;
  role: UserRoles;
  password: string;
  loginType: UserLoginType;
  pricingModel: PricingModel;
}

export enum MemberRole {
  ADMIN = "Admin",
  MEMBER = "Member",
  OWNER = "Owner",
}

export enum InvitationStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

export interface Member {
  _id?: string;
  userId: string;
  projectId: string;
  email: string;
  role: MemberRole;
  invitationStatus?: InvitationStatus;
  user: User;
}

export interface Project {
  _id: string;
  memberId: string;
  projectId: string;
  role: MemberRole;
  name: string;
  description: string;
  tags: string[];
  isDeleted: boolean;
  openAiKey?: string;
  geminiKey?: string;
  owner: User;
}

export enum TaskStatus {
  TODO = "Todo",
  IN_PROGRESS = "In Progress",
  UNDER_REVIEW = "Under Review",
  COMPLETED = "Completed",
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export interface Comment {
  _id: string;
  content: string;
  commentType: CommentType;
  author: {
    email: string;
    role: MemberRole;
    isAuthor: boolean;
    user: {
      fullName: string;
      avatar: Avatar;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  title: string;
  completed: boolean;
  id: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  members: Member[];
  completedDate: Date;
  commentCount: number;
  subTasks: Subtask[];
  taskType: string;
  taskNumber: number;
  isDeleted: boolean;
  isCreator: boolean;
  comments: Comment[];
  creator: Member & { fullName: string; avatar: Avatar };
  isMember: boolean;
  createdAt: Date;
}

export interface GetTasksQuery {
  projectId: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToMe: boolean;
  createdByMe: boolean;
  sortByCreated: boolean;
}

export interface Options {
  label: string;
  value: string;
}

export enum IssueStatus {
  OPEN = "Open",
  CLOSED = "Closed",
}

export enum IssuePriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export interface Issue {
  _id: string;
  memberId: string;
  projectId: string;
  userId: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  comments: Comment[];
  members: Member[];
  attachments: string[];
  labels: string[];
  closedDate: Date;
  isDeleted: boolean;
  creator: Member & { fullName: string; avatar: Avatar };
  isMember: boolean;
  createdAt: Date;
  updatedAt: Date;
  isCreator: boolean;
  closedBy: {
    fullName: string;
    avatar: Avatar;
  };
}

export enum CommentType {
  GENERAL = "General",
  STATUS_UPDATED = "Status Update",
  COMMENT_UPDATED = "Comment Updated",
  ASSIGNED_MEMBER = "Assigned Member",
  REMOVE_ASSIGNED_MEMBER = "Remove Assigned Member",
  SUBTASK_UPDATED = "Subtask Updated",
}

export interface Team {
  _id: string;
  name: string;
  members: Member[];
  leader: Member;
}

export interface Doc {
  _id: string;
  title: string;
  members: Member[];
  content: string;
}

export enum DocStatus {
  PUBLISHED = "Published",
  DRAFT = "Draft",
  ARCHIVED = "Archived",
}

export enum DocAccessType {
  PRIVATE = "Private",
  PUBLIC = "Public",
}

export interface Document {
  _id: string;
  projectId: string;
  title: string;
  content: string;
  accessType: DocAccessType;
  status: DocStatus;
  members: Member[];
  teams: string[];
  comments: Comment[];
  attachments: string[];
  isDeleted: boolean;
  leftMargin: number;
  rightMargin: number;
  isMember: boolean;
  isCreator: boolean;
  commentCount: number;
  creator: Member & { fullName: string; avatar: Avatar };
}

export interface AssignOrRemoveMemberBody {
  memberId: string;
  docId: string;
  projectId: string;
}

export interface Channel {
  _id: string;
  name: string;
  member: Member & { fullName: string; avatar: Avatar; email: string };
  createdAt: Date;
  members: Member[];
}

export interface Message {
  _id: string;
  body: string;
  image: {
    url: string;
    _id: string;
    id: string;
  };
  isCreator: boolean;
  member: Member & { user: User };
  createdAt: Date;
  updatedAt: Date;
  reactions: Reaction[];
}

export interface Reaction {
  memberIds: string[];
  count: number;
  value: string;
}

export interface Conversation {
  _id: string;
  memberOne: Member & { user: User };
  memberTwo: Member & { user: User };
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  name: string;
  description: string;
  color: string;
  _id: string;
}

export interface TimeFrame {
  _id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  projectId: string;
  isActive: boolean;
  creator: Member & { fullName: string; avatar: Avatar };
}

export enum OKRStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export interface ProgressMetric {
  date: Date;
  progress: number;
}
export interface Objective {
  _id: string;
  title: string;
  description: string;
  status: OKRStatus;
  progress: number;
  startDate: Date;
  endDate: Date;
  completedDate: Date;

  timeFrameId: string;
  projectId: string;
  creator: Member & { fullName: string; avatar: Avatar };
  owner: Member & { fullName: string; avatar: Avatar };
  team: Team;
  parentObjectiveId: string | null;

  keyResults: KeyResult[];
  assignees: Member[];
  comments: Comment[];

  isDeleted: boolean;
  progressMetric: ProgressMetric[];
}

export enum KeyResultUnit {
  PERCENTAGE = "%",
  NUMBER = "Number",
  TASKS = "Tasks",
  REVENUE = "Revenue",
  LEADS = "Leads",
  HOURS = "Hours",
  BUGS = "Bugs",
  MILESTONES = "Milestones",
  CUSTOM = "Custom",
}

export interface KeyResult {
  _id: string;
  title: string;
  description?: string;
  unit: KeyResultUnit;
  progress: number;
  targetValue: number;
  currentValue: number;
  status: OKRStatus;
  completedDate: Date;

  objectiveId: string;
  creator: Member & { fullName: string; avatar: Avatar };
  owner: Member & { fullName: string; avatar: Avatar };
  team: Team;
  projectId: string;

  assignees: Member[];
  progressMetric: ProgressMetric[];
}

export interface SecretKey {
  secretKey: string;
  userId: string;
}
