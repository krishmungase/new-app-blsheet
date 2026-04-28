import MSG from './msg'
import URLS from './urls'
import {
  PricingModel,
  UserLoginType,
  UserRoles,
} from '../types/auth/user.types'
import { DocAccessType, DocStatus } from '../types/projects/document.types'
import { InvitationStatus, MemberRole } from '../types/projects/member.types'
import { TaskPriority, TaskStatus } from './../types/projects/task.types'
import { IssuePriority, IssueStatus } from '../types/projects/issue.types'
import { LableType } from '../types/projects/lable.types'
import { KeyResultUnit, OKRStatus } from '../types/projects/objective.types'
import {
  AssessmentResponseStatus,
  AssessmentStatus,
  DisplayType,
  QuestionType,
} from '../types/projects/assessment.types'

export const AvailableUserRoles: string[] = Object.values(UserRoles)
export const AvailableSocialLogins: string[] = Object.values(UserLoginType)
export const AvailablePricingModels: string[] = Object.values(PricingModel)
export const AvailableTaskPriority: string[] = Object.values(TaskPriority)
export const AvailableTaskStatus: string[] = Object.values(TaskStatus)
export const AvailableMemberRoles: string[] = Object.values(MemberRole)
export const AvailableInvitationStatus: string[] =
  Object.values(InvitationStatus)
export const AvailableDocStatus: string[] = Object.values(DocStatus)
export const AvailableAccessType: string[] = Object.values(DocAccessType)
export const AvailableIssueStatus: string[] = Object.values(IssueStatus)
export const AvailableIssuePriority: string[] = Object.values(IssuePriority)
export const AvailableLableType: string[] = Object.values(LableType)
export const AvailableOKRStatus: string[] = Object.values(OKRStatus)
export const AvailableKeyResultUnits: string[] = Object.values(KeyResultUnit)
export const AvailableAssessmentStatus: string[] =
  Object.values(AssessmentStatus)
export const AvailableAssessmentCategoryDisplayType: string[] =
  Object.values(DisplayType)
export const AvailableQuestionType: string[] = Object.values(QuestionType)
export const AvailableAssessmentResponseStatus: string[] = Object.values(
  AssessmentResponseStatus
)

export const TASK_TYPE_OPTIONS = [
  {
    value: 'Bug Fix',
    label: 'Bug Fix',
  },
  {
    value: 'Feature Request',
    label: 'Feature Request',
  },
  {
    value: 'Enhancement',
    label: 'Enhancement',
  },
  {
    value: 'Documentation',
    label: 'Documentation',
  },
  {
    value: 'Frontend',
    label: 'Frontend',
  },
  { value: 'Backend', label: 'Backend' },
  { value: 'API', label: 'API' },
  { value: 'Testing', label: 'Testing' },
  { value: 'UI Design', label: 'UI Design' },
]

export const LABELS = [
  {
    name: 'feature',
    description: 'A new capability, functionality, or enhancement to be added.',
    color: '#2b90d9', // blue
  },
  {
    name: 'bug',
    description:
      'A defect or error that causes incorrect or unexpected behavior.',
    color: '#e74c3c',
  },
  {
    name: 'improvement',
    description: 'Enhancing an existing feature or optimizing performance.',
    color: '#27ae60',
  },
  {
    name: 'documentation',
    description: 'Writing or updating technical or user documentation.',
    color: '#f39c12',
  },
  {
    name: 'test',
    description:
      'Creating or updating test cases, QA tasks, or validation work.',
    color: '#8e44ad',
  },
  {
    name: 'design',
    description:
      'UI/UX design tasks, including wireframes, mockups, or user flows.',
    color: '#e67e22',
  },
  {
    name: 'research',
    description:
      'Investigation or exploration to inform future work or decision-making.',
    color: '#16a085',
  },
  {
    name: 'refactor',
    description:
      'Code cleanup or restructuring without changing functionality.',
    color: '#95a5a6',
  },
  {
    name: 'maintenance',
    description:
      'Routine system upkeep, such as dependency updates or server patches.',
    color: '#7f8c8d',
  },
  {
    name: 'deployment',
    description:
      'Tasks related to releasing or deploying software to environments.',
    color: '#34495e',
  },
  {
    name: 'task',
    description: 'A general-purpose task that doesn’t fit other categories.',
    color: '#bdc3c7',
  },
  {
    name: 'discussion',
    description:
      'Conversations or decision-making items not tied to direct implementation.',
    color: '#9b59b6',
  },
  {
    name: 'blocked',
    description:
      'Indicates a task is currently blocked by another issue or dependency.',
    color: '#c0392b',
  },
  {
    name: 'urgent',
    description: 'High-priority task requiring immediate attention.',
    color: '#d35400',
  },
  {
    name: 'review',
    description: 'Tasks involving code or design review.',
    color: '#2980b9',
  },
  {
    name: 'security',
    description:
      'Tasks related to fixing vulnerabilities or improving security posture.',
    color: '#e84393',
  },
]

export const SYSTEM_PROMPT = `You are a helpful and intelligent assistant. Your primary task is to respond to user queries in a clear, structured, and comprehensive manner. Always aim to provide informative and well-organized responses that improve understanding and usability.

**Guidelines for your responses:**

* **Use headings** to divide the response into logical sections.
* **Include bullet points or numbered lists** for clarity when presenting multiple items, steps, or factors.
* **Write in paragraphs** when explaining concepts or reasoning, maintaining a professional yet friendly tone.
* **Be concise but thorough** — avoid unnecessary repetition while ensuring all essential details are included.
* **Support answers with examples, analogies, or use cases** if they help enhance understanding.
* When appropriate, highlight **cautions, tips, or best practices**.
* Maintain factual accuracy and logical coherence throughout.
* Add relevant emojis wherever required, such as at the start of headings, references, and other sections.
* Add appropriate spacing where needed to make the output visually clean and readable.

Always prioritize helping the user effectively. Your goal is not just to respond, but to ensure the user clearly understands and can apply the information.
`

export const SYSTEM_PROMPT_TAB_NAME = `Create a concise browser tab title (maximum 4 words) that clearly reflects the main topic or theme of the given user queries.

**Instruction**
1) Return only the name without adding any formatting or special characters, no additional text.
2) The response should not have any punctuations special characters only text should be there
3) The tab name must be contextual taking into account the previous context as well 
4) The name should be STRICTLY whithin 4 words so that it is easy to display to users in the frontend
5) Your response must be strictly a json dictionary of following format (STRICTLY do not add \`\`\`json or \`\`\`python). STRICTLY Do not add any other additional information
{
 "tab_name": "tab name STRICTLY whithin 4 words"
}
`

export { URLS, MSG }
