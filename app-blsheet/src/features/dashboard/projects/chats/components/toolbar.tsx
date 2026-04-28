import { Button } from "@/components";
import { Info, Search } from "lucide-react";

const Toolbar = () => {
  return (
    <div className="flex items-center justify-between h-10 p-1.5 bg-muted/50 border-t border-l border-r">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-primary/10 hover:bg-primary/10 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-primary mr-2 " />
          <span className="text-primary text-xs">Search workspace</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
