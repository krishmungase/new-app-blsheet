import { NavLinkType } from "@/types";
import {
  CircleDotIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LayoutGridIcon,
  ReceiptTextIcon,
  SquareCheckIcon,
  TagIcon,
  TargetIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react";

export const NAV_LINKS: NavLinkType[] = [
  {
    id: 1,
    title: "Home",
    isProtected: false,
    path: "/",
    icon: HomeIcon,
  },
  {
    id: 2,
    title: "Pricing",
    isProtected: false,
    path: "/pricing",
    icon: CreditCardIcon,
  },
  {
    id: 3,
    title: "Dashboard",
    isProtected: true,
    path: "/dashboard/profile",
    icon: LayoutGridIcon,
  },
];

export const PROJECT_LINKS: NavLinkType[] = [
  {
    id: 1,
    title: "Details",
    isProtected: true,
    path: "details",
    icon: ReceiptTextIcon,
  },
  {
    id: 2,
    title: "Members",
    isProtected: true,
    path: "members",
    icon: UserRoundIcon,
  },
  {
    id: 3,
    title: "Teams",
    isProtected: true,
    path: "teams",
    icon: UsersIcon,
  },
  {
    id: 4,
    title: "Tasks",
    isProtected: true,
    path: "tasks",
    icon: SquareCheckIcon,
  },
  {
    id: 5,
    title: "Issues",
    isProtected: true,
    path: "issues",
    icon: CircleDotIcon,
  },
  {
    id: 6,
    title: "Docs",
    isProtected: true,
    path: "docs?createdByMe=true",
    icon: FileTextIcon,
  },
];

export const SETUP_LINKS: NavLinkType[] = [
  {
    id: 1,
    title: "Details",
    isProtected: true,
    path: "details",
    icon: ReceiptTextIcon,
  },
  {
    id: 2,
    title: "Members",
    isProtected: true,
    path: "members",
    icon: UserRoundIcon,
  },
  {
    id: 3,
    title: "Teams",
    isProtected: true,
    path: "teams",
    icon: UsersIcon,
  },
  {
    id: 4,
    title: "Labels",
    isProtected: true,
    path: "labels",
    icon: TagIcon,
  },
];

export const WORKSPACE_LINKS: NavLinkType[] = [
  {
    id: 1,
    title: "Tasks",
    isProtected: true,
    path: "tasks",
    icon: SquareCheckIcon,
  },
  {
    id: 2,
    title: "Issues",
    isProtected: true,
    path: "issues",
    icon: CircleDotIcon,
  },
  {
    id: 3,
    title: "Objectives",
    isProtected: true,
    path: "time-frame",
    icon: TargetIcon,
  },
  {
    id: 4,
    title: "Docs",
    isProtected: true,
    path: "docs?createdByMe=true",
    icon: FileTextIcon,
  },
];
