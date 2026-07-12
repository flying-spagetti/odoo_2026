import { Box, Card, Text } from "@chakra-ui/react";
import type { AnalyticsAccentColor } from "@/types/analytics";

interface AccentKpiCardProps {
  label: string;
  value: string;
  accentColor: AnalyticsAccentColor;
}

const accentColorMap: Record<AnalyticsAccentColor, string> = {
  blue: "blue.400",
  green: "green.400",
  orange: "orange.400",
};

export function AccentKpiCard({ label, value, accentColor }: AccentKpiCardProps) {
  return (
    <Card.Root
      variant="outline"
      bg="gray.900"
      borderColor="gray.700"
      overflow="hidden"
      size="sm"
      position="relative"
    >
      <Box
        position="absolute"
        left="0"
        top="0"
        bottom="0"
        width="1"
        bg={accentColorMap[accentColor]}
      />
      <Card.Body gap="2" ps="4">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          letterSpacing="wider"
          color="gray.500"
          textTransform="uppercase"
        >
          {label}
        </Text>
        <Text fontSize="2xl" fontWeight="semibold" color="gray.100" lineHeight="1.2">
          {value}
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
