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
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={onClick} variant="outline" className={className}>
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
