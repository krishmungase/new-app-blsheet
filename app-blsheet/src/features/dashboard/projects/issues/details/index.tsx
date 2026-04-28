import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { Issue } from "@/types";
import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";
import { BackButton, Loader } from "@/components";

import apis from "../apis";
import IssueContext from "./provider";
import IssueHeader from "./components/issue-header";
import IssueInfoCard from "./components/issue-info-card";
import IssueCards from "./components/issue-cards";

const IssueDetails = () => {
  const { authToken } = useAuth();
  const { issueId, projectId } = useParams();
  const [issue, setIssue] = useState<Issue | null>();

  const { isLoading, refetch } = useQuery({
    queryKey: [QUERY.ISSUE.GET_ISSUES, issueId, projectId],
    queryFn: () => apis.getIssue({ params: { issueId, projectId }, authToken }),
    onSuccess: ({ data }) => {
      setIssue(data?.data);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
    retry: false,
  });

  if (isLoading || !issue) return <Loader />;

  return (
    <IssueContext.Provider value={{ issue, refetchIssue: refetch }}>
      <div className="relative">
        <div className="pb-5 scroll-smooth">
          <div className="absolute top-0 left-0 hidden sm:block">
            <BackButton url={`/dashboard/workspace/${projectId}/issues`} />
          </div>

          <div className="sm:px-6 sm:w-[95%] mx-auto overflow-y-auto h-[calc(100vh_-160px)]">
            <IssueHeader />
            <div className="space-y-5 md:grid grid-cols-6 md:gap-6">
              <IssueInfoCard />
              <IssueCards />
            </div>
          </div>
        </div>
      </div>
    </IssueContext.Provider>
  );
};

export default IssueDetails;
