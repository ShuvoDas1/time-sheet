import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ButtonWithTooltip({
  buttonName,
  tooltipTitle,
  onClick,
  loading,
  className = "",
  Icon = "",
  disabled = false,
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            variant="outline"
            className={className}
            disabled={disabled}
          >
            {Icon} {loading ? "Submitting..." : `${buttonName}`}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipTitle}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
