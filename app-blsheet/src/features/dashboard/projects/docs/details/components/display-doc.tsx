import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Document } from "@/types";

const DispayDoc = ({ doc }: { doc: Document }) => {
  return (
    <div className="relative">
      <div className="bg-muted p-3 md:p-6 rounded-lg border xl:w-[816px] mx-auto">
        <h1 className="font-medium text-sm text-primary">{doc?.title}</h1>
        <div className="flex items-center justify-end">
          <div className="flex items-center justify-center space-x-2">
            <Avatar className="flex items-center justify-center size-6">
              <AvatarImage
                src={doc?.creator?.avatar?.url}
                alt="profile-picture"
              />
              <AvatarFallback className="flex items-center text-sm justify-center w-full h-full bg-primary text-white">
                {doc?.creator?.fullName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="ml-2 text-primary text-sm">
              {doc?.creator?.fullName}
            </span>
          </div>
        </div>
      </div>
      <div
        className="mx-auto flex justify-center py-2 mt-4 w-full xl:w-[816px] border p-[20px] xl:px-[56px] min-h-screen"
        dangerouslySetInnerHTML={{
          __html: `<div class="tiptap min-w-full">${doc?.content}</div>`,
        }}
      />
    </div>
  );
};

export default DispayDoc;
