import { useRef } from "react";

import { useAuth } from "@/hooks";
import { Button } from "@/components";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useUpdateProfile from "../hooks/use-update-profile-img";

const UpdateProfileImg = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const { isLoading, mutate } = useUpdateProfile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      mutate(formData);
    }
    e.target.value = "";
  };

  return (
    <div className="relative">
      <Avatar className="bg-primary size-48">
        <AvatarImage src={user?.avatar?.url} alt="profile" />
        <AvatarFallback className="flex bg-foreground items-center justify-center w-full sm:text-4xl h-full text-card">
          {user?.fullName[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
          <div className="w-12 h-12 border-4 border-t-primary border-b-secondary border-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="absolute top-40">
        <Button
          size="sm"
          variant="outline"
          onClick={handleButtonClick}
          className="rounded-full"
        >
          {isLoading ? "Uploading..." : "Edit"}
        </Button>
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default UpdateProfileImg;
