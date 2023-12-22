import { ComponentProps, FC } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type PaginationButtonProps = ComponentProps<typeof Link> & {
  disabled?: boolean;
};

const CustomButtonLink: FC<PaginationButtonProps> = ({
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <Button
      aria-disabled={disabled}
      className={cn(
        disabled && "pointer-events-none bg-muted hover:bg-muted",
        className,
      )}
      size="icon"
      tabIndex={disabled ? -1 : undefined}
      variant="outline"
      asChild
    >
      <Link {...rest} />
    </Button>
  );
};

export default CustomButtonLink;
