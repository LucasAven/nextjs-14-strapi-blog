import { FC } from "react";

import { cn } from "@/lib/utils";

export interface CalloutBlockProps {
  children: string;
  className?: string;
}

const CalloutBlock: FC<CalloutBlockProps> = ({ children, className = "" }) => {
  return (
    <div
      className={cn(
        "rounded bg-[#ffaa0052] p-4 px-6 py-5 text-sm leading-normal",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default CalloutBlock;
