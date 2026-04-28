import { ReactNode } from "react";

const GridLines = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white [--pattern-fg:var(--color-gray-950)]/5 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">
      <div className="col-start-3 row-start-3 flex max-w-lg flex-col bg-gray-100 p-2 dark:bg-white/10">
        <div className="rounded-xl bg-white p-10 text-sm/7 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
          {children}
        </div>
      </div>
      <div className="relative -right-px col-start-2 row-span-full row-start-1 border-x border-x-border bg-[image:repeating-linear-gradient(315deg,#F3F4F6_0,#F3F4F6_1px,_transparent_0,_transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,#1E202A_0,#1E202A_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
      <div className="relative -left-px col-start-4 row-span-full row-start-1 border-x border-x-border bg-[image:repeating-linear-gradient(315deg,#F3F4F6_0,#F3F4F6_1px,_transparent_0,_transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,#1E202A_0,#1E202A_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
      <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-border"></div>
      <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-border"></div>
    </div>
  );
};

export default GridLines;
