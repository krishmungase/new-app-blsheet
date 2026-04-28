import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  AppLayout,
  AuthLayout,
  DashboardLayout,
  RootLayout,
  WorkspaceLayout,
  ProjectSetupLayout,
  ChatLayout,
} from "@/layouts";
import {
  HomePage,
  DashboardHome,
  SignUpPage,
  SignInPage,
  ForgotPassword,
  VerifyUser,
  TermsServices,
  PrivacyPolicy,
  Todos,
  Settings,
  Profile,
  CreatePassword,
  ResetPassword,
  Verification,
  ProjectDetails,
  ProjectMembers,
  Invitation,
  ProjectTasks,
  TaskDetails,
  ProjectIssues,
  ProjectDocs,
  ProjectSettings,
  IssueDetails,
  CompletedTasks,
  PricingPage,
  ProjectTeams,
  NotFoundPage,
  TeamDetails,
  SingleDocPage,
  ProjectChatPage,
  Channel,
  Labels,
  Conversation,
  TimeFrame,
  Objective,
  ObjectiveDetails,
  UserSettingsPage,
} from "@/features";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="auth" element={<AuthLayout />}>
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="create-password" element={<CreatePassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="terms-of-service" element={<TermsServices />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="verify" element={<VerifyUser />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="guidance">
        <Route path="verification" element={<Verification />} />
        <Route path="invitation" element={<Invitation />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="pricing" element={<PricingPage />} />
      </Route>

      <Route path="dashboard" element={<DashboardLayout />}>
        <Route path="home" element={<DashboardHome />} />
        <Route path="workspace">
          <Route path=":projectId" element={<WorkspaceLayout />}>
            <Route path="tasks">
              <Route index element={<ProjectTasks />} />
              <Route path="completed" element={<CompletedTasks />} />
              <Route path=":taskId" element={<TaskDetails />} />
            </Route>

            <Route path="issues">
              <Route index element={<ProjectIssues />} />
              <Route path=":issueId" element={<IssueDetails />} />
            </Route>

            <Route path="docs">
              <Route index element={<ProjectDocs />} />
              <Route path=":docId" element={<SingleDocPage />} />
            </Route>

            <Route path="time-frame">
              <Route index element={<TimeFrame />} />
              <Route path=":timeFrameId">
                <Route index element={<Objective />} />
                <Route path="objective">
                  <Route path=":objectiveId" element={<ObjectiveDetails />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="setup">
          <Route path=":projectId" element={<ProjectSetupLayout />}>
            <Route path="details" element={<ProjectDetails />} />
            <Route path="members" element={<ProjectMembers />} />
            <Route path="teams">
              <Route index element={<ProjectTeams />} />
              <Route path=":teamId">
                <Route path="details" element={<TeamDetails />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
            <Route path="labels" element={<Labels />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="settings">
          <Route path=":projectId">
            <Route path="general" element={<ProjectSettings />} />
          </Route>
        </Route>

        <Route path="chats" element={<ChatLayout />}>
          <Route path=":projectId">
            <Route path="channels">
              <Route index element={<ProjectChatPage />} />
              <Route path=":channelId" element={<Channel />} />
            </Route>
            <Route path="conversation">
              <Route index element={<ProjectChatPage />} />
              <Route path=":conversationId" element={<Conversation />} />
            </Route>
          </Route>
        </Route>

        <Route path="todos" element={<Todos />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="user-settings" element={<UserSettingsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
