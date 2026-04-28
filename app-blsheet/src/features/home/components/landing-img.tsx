import { AspectRatio } from "@/components/ui/aspect-ratio";

const LandingImg = () => {
  return (
    <div className="relative pb-8">
      <div className="mx-auto bg-muted overflow-hidden p-4 md:p-8 shadow-sm relative">
        <div className="rounded-lg border overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <img
              className="hidden dark:block"
              src="/images/dark-task-img.png"
              alt="demo img"
            />
            <img
              className="dark:hidden block"
              src="/images/light-task-img.png"
              alt="demo img"
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  );
};

export default LandingImg;
