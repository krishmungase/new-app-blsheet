import { useMutation } from "react-query";
import { LoaderCircle } from "lucide-react";

import { toast, useAuth } from "@/hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvailableDocStatusType } from "@/constants";
import { DocStatus } from "@/types";

import apis from "../../apis";
import { useParams } from "react-router-dom";

interface ChangeStatusProps {
  refetch: () => void;
  docId: string;
  value: DocStatus;
}

const ChangeStatus = ({ docId, value, refetch }: ChangeStatusProps) => {
  const { authToken } = useAuth();
  const { projectId } = useParams();
  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updateDoc({ data, authToken }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Doc status updated successfully",
      });
      refetch();
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.response?.data?.message,
      });
    },
    retry: false,
  });

  const onChange = (value: DocStatus) => {
    mutate({ data: { docId, status: value, projectId } });
  };

  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a  status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {AvailableDocStatusType.map((status) => (
            <SelectItem className="cursor-pointer" key={status} value={status}>
              <div className="flex items-center">
                {isLoading && (
                  <LoaderCircle size={15} className="animate-spin mr-1" />
                )}
                <span>{status}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ChangeStatus;
