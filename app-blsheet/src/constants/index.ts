import QUERY from "./query";
import FEATURES from "./features";
import {
  NAV_LINKS,
  PROJECT_LINKS,
  WORKSPACE_LINKS,
  SETUP_LINKS,
} from "./nav-links";
import {
  DocAccessType,
  DocStatus,
  InvitationStatus,
  MemberRole,
  OKRStatus,
  Options,
  PricingModel,
  TaskPriority,
  TaskStatus,
} from "@/types";

import { Zap, Shield, Users, Star, Clock, Cloud, Lock } from "lucide-react";

export const MEMBER_ROLE_COLORS = {
  [MemberRole.OWNER]: "text-orange-500 bg-orange-100",
  [MemberRole.ADMIN]: "text-red-500 bg-red-100",
  [MemberRole.MEMBER]: "text-blue-500 bg-blue-100",
};

export const INVITATION_STATUS_COLORS = {
  [InvitationStatus.ACCEPTED]: "text-green-500 bg-green-100",
  [InvitationStatus.PENDING]: "text-orange-500 bg-orange-100",
  [InvitationStatus.REJECTED]: "text-red-500 bg-red-100",
};

export const STATUS_TEXT_WITH_ICON = {
  [TaskStatus.TODO]: "📋 TO DO",
  [TaskStatus.IN_PROGRESS]: "🧑🏻‍💻 Working In Progress",
  [TaskStatus.UNDER_REVIEW]: "👀 Under Review",
  [TaskStatus.COMPLETED]: "✅ Today's Completed",
};

export const TASK_LEVLE = {
  [TaskStatus.TODO]: [0, 3],
  [TaskStatus.IN_PROGRESS]: [1, 3],
  [TaskStatus.UNDER_REVIEW]: [2, 3],
  [TaskStatus.COMPLETED]: [0, 4],
};

export const OKR_STATUS_COLOR = {
  [OKRStatus.NOT_STARTED]: "text-red-500 bg-red-100",
  [OKRStatus.IN_PROGRESS]: "text-blue-500 bg-blue-100",
  [OKRStatus.COMPLETED]: "text-green-500 bg-green-100",
};

export const TASK_TYPE_COLOR: Record<string, string> = {
  "Bug Fix": "text-red-500 bg-red-100",
  "Feature Request": "text-blue-500 bg-blue-100",
  Enhancement: "text-orange-500 bg-orange-100",
  Documentation: "text-green-500 bg-green-100",
  Frontend: "text-purple-500 bg-purple-100",
  Backend: "text-pink-500 bg-pink-100",
  API: "text-cyan-500 bg-cyan-100",
  Testing: "text-violet-500 bg-violet-100",
  "UI Design": "text-yellow-500 bg-yellow-100",
};

export const TASK_STATUS_COLOR = {
  [TaskStatus.TODO]: "text-gray-500 bg-gray-100 border border-gray-500",
  [TaskStatus.IN_PROGRESS]: "text-blue-500 bg-blue-100 border border-blue-500",
  [TaskStatus.UNDER_REVIEW]:
    "text-yellow-500 bg-yellow-100 border border-yellow-500",
  [TaskStatus.COMPLETED]: "text-green-500 bg-green-100 border border-green-500",
};

export const TASK_TYPE_OPTIONS: Options[] = [
  {
    value: "Bug Fix",
    label: "Bug Fix",
  },
  {
    value: "Feature Request",
    label: "Feature Request",
  },
  {
    value: "Enhancement",
    label: "Enhancement",
  },
  {
    value: "Documentation",
    label: "Documentation",
  },
  {
    value: "Frontend",
    label: "Frontend",
  },
  { value: "Backend", label: "Backend" },
  { value: "API", label: "API" },
  { value: "Testing", label: "Testing" },
  { value: "UI Design", label: "UI Design" },
];

export const TASK_PRIORITY_COLOR = {
  [TaskPriority.LOW]: "text-green-500 bg-green-100 border border-green-500",
  [TaskPriority.MEDIUM]:
    "text-orange-500 bg-orange-100 border border-orange-500",
  [TaskPriority.HIGH]: "text-red-500 bg-red-100 border border-red-500",
};

export const STATUS_OPTIONS: Options[] = [
  { value: TaskStatus.TODO, label: "📋 Todo" },
  { value: TaskStatus.IN_PROGRESS, label: "🧑🏻‍💻 In Progress" },
  { value: TaskStatus.UNDER_REVIEW, label: "👀 Under Review" },
  { value: TaskStatus.COMPLETED, label: "✅ Completed" },
];

export const PRIORITY_OPTIONS: Options[] = [
  { value: TaskPriority.LOW, label: "⬇️ Low" },
  { value: TaskPriority.MEDIUM, label: "➡️ Medium" },
  { value: TaskPriority.HIGH, label: "⬆️ High" },
];

export const TASK_VIEW_OPTIONS: Options[] = [
  { value: "board", label: "Board" },
  { value: "table", label: "Table" },
  { value: "calendar", label: "Calendar" },
];

export const AvailabeMemberRole: string[] = Object.values(MemberRole);
export const AvailableTaskStatus: string[] = Object.values(TaskStatus);
export const AvailableDocAccessType: string[] = Object.values(DocAccessType);
export const AvailableDocStatusType: string[] = Object.values(DocStatus);

export const PricingInfo = {
  [PricingModel.FREE]: {
    projectCount: 1,
    memberCount: 1,
  },
  [PricingModel.PREMIUM]: {
    projectCount: 10,
    memberCount: 50,
  },
  [PricingModel.ENTERPRISE]: {
    projectCount: 25,
    memberCount: 150,
  },
};

const FAQ = [
  {
    q: "How does the 14-day free trial work?",
    a: "Start your trial with full access to all Premium features. No credit card required. Cancel anytime before the trial ends.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes! You can upgrade, downgrade, or cancel your plan at any time from your account settings.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and offer enterprise billing options for larger organizations.",
  },
  {
    q: "Is there a discount for annual billing?",
    a: "Yes! Save 20% when you choose annual billing on our Premium plan.",
  },
];

const PricingFeatures = {
  basic: [
    { icon: Users, text: "Up to 5 team members" },
    { icon: Cloud, text: "5GB storage space" },
    { icon: Clock, text: "Basic support (24h response)" },
    { icon: Lock, text: "Standard security" },
  ],
  premium: [
    { icon: Users, text: "Up to 50 team members" },
    { icon: Cloud, text: "100GB storage space" },
    { icon: Zap, text: "Priority support (4h response)" },
    { icon: Shield, text: "Advanced security features" },
    { icon: Star, text: "Custom integrations" },
  ],
  enterprise: [
    { icon: Users, text: "Unlimited team members" },
    { icon: Cloud, text: "Unlimited storage" },
    { icon: Zap, text: "24/7 dedicated support" },
    { icon: Shield, text: "Enterprise-grade security" },
    { icon: Star, text: "Custom solutions & API access" },
  ],
};

const PricingPlans = [
  {
    name: "Basic",
    title: "Free",
    description:
      "Perfect for individuals and small teams getting started with BL Sheet.",
    features: PricingFeatures.basic,
    highlights: [
      "No credit card required",
      "Basic collaboration tools",
      "Community support",
    ],
    button: {
      text: "Get Started",
      variant: "default" as const,
    },
  },
  {
    name: "Premium",
    title: "$10",
    period: "/month",
    popular: true,
    description:
      "Ideal for growing teams looking for advanced features and collaboration tools.",
    features: PricingFeatures.premium,
    highlights: [
      "All Basic features",
      "Priority support",
      "Advanced analytics",
    ],
    savings: "Save 20% with annual billing",
    button: {
      text: "Start Free Trial",
      variant: "default" as const,
    },
  },
  {
    name: "Enterprise",
    title: "Custom",
    description:
      "Built for large organizations needing scalability and custom solutions.",
    features: PricingFeatures.enterprise,
    highlights: [
      "All Premium features",
      "Custom contract",
      "Dedicated success manager",
    ],
    button: {
      text: "Contact Sales",
      variant: "default" as const,
    },
  },
];

export const DOC_ACCESS_TYPE_COLOR = {
  [DocAccessType.PRIVATE]: "bg-red-500",
  [DocAccessType.PUBLIC]: "bg-green-500",
};

export const DOC_STATUS_TYPE_COLOR = {
  [DocStatus.ARCHIVED]: "bg-red-500",
  [DocStatus.DRAFT]: "bg-blue-500",
  [DocStatus.PUBLISHED]: "bg-green-500",
};

export const TASK_STATUS_DOT_COLOR = {
  [TaskStatus.TODO]: "bg-red-500",
  [TaskStatus.IN_PROGRESS]: "bg-orange-500",
  [TaskStatus.UNDER_REVIEW]: "bg-blue-500",
  [TaskStatus.COMPLETED]: "bg-green-500",
};

export const TASK_CARD_BORDER_COLOR = {
  [TaskPriority.HIGH]: "border-l-red-500",
  [TaskPriority.MEDIUM]: "border-l-yellow-500",
  [TaskPriority.LOW]: "border-l-green-500",
};

export {
  NAV_LINKS,
  FEATURES,
  QUERY,
  PROJECT_LINKS,
  FAQ,
  PricingPlans,
  WORKSPACE_LINKS,
  SETUP_LINKS,
};
