import { ChartSpline } from "lucide-react";
import { ProgressMetric } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import MetricAreaChart from "./metric-area-chart";
import { cn } from "@/lib/utils";
import Hint from "@/components/ui/hint";

function MetricDialog({
  data,
  title,
}: {
  data: ProgressMetric[];
  title?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "text-orange-500 cursor-pointer",
            title &&
              "sm:border sm:border-orange-500 sm:bg-orange-100 rounded-full sm:px-2 sm:py-0.5"
          )}
        >
          <Hint label="Progress Metric Chart">
            <div className="flex items-center justify-center gap-1">
              <ChartSpline size={15} />
              {title && (
                <span className="text-xs hidden sm:block">{title}</span>
              )}
            </div>
          </Hint>
        </button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <MetricAreaChart chartData={data} />
      </DialogContent>
    </Dialog>
  );
}

export default MetricDialog;
