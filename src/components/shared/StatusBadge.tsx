import { Badge } from "@chakra-ui/react";
import { getStatusConfig } from "@/types/status";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <Badge
      colorPalette={config.colorPalette}
      variant="subtle"
      size="sm"
      textTransform="none"
    >
      {config.label}
    </Badge>
  );
}
