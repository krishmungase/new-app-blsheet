import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DOC_TEMPLATES from "@/constants/doc-templates";
import { cn } from "@/lib/utils";

import useCreateDoc from "../hooks/use-create-doc";
import { useParams } from "react-router-dom";

const DocTemplates = () => {
  const { projectId } = useParams();
  const { isLoading: isCreating, mutate } = useCreateDoc();

  return (
    <div className="pb-5">
      <h2 className="font-medium pb-4">Start a new document</h2>
      <div className="px-16 flex flex-col gap-y-4">
        <Carousel>
          <CarouselContent className="-ml-4">
            {DOC_TEMPLATES.map((template) => (
              <CarouselItem
                key={template.id}
                className="basis-1/2 sm:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
              >
                <div
                  className={cn(
                    "aspect-[3/4] flex flex-col gap-y-2.5",
                    isCreating && "pointer-events-none opacity-50"
                  )}
                >
                  <button
                    disabled={isCreating}
                    onClick={() =>
                      mutate({
                        data: {
                          projectId,
                          title: "Untitled document",
                          content: template.content,
                        },
                      })
                    }
                    style={{
                      backgroundImage: `url(${template.imgUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="size-full hover:border-active rounded-sm border hover:bg-active/10 transition flex flex-col items-center  justify-center gap-y-4 bg-foreground"
                  />
                  <p className="text-sm font-medium truncate">
                    {template.label}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </div>
    </div>
  );
};

export default DocTemplates;
