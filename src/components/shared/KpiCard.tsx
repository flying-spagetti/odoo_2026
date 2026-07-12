import { Card, FormatNumber, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { Icon } from "@chakra-ui/react";

interface KpiCardProps {
  label: string;
  value: number | string;
  icon?: IconType;
  suffix?: string;
  description?: string;
}

export function KpiCard({
  label,
  value,
  icon,
  suffix,
  description,
}: KpiCardProps) {
  return (
    <Card.Root size="sm" variant="outline" bg="gray.900" borderColor="gray.700" borderRadius="lg">
      <Card.Body gap="3">
        <Card.Title
          display="flex"
          alignItems="center"
          gap="2"
          fontSize="sm"
          fontWeight="medium"
          color="gray.400"
        >
          {icon && <Icon as={icon} boxSize="4" />}
          {label}
        </Card.Title>
        <Text fontSize="2xl" fontWeight="semibold" lineHeight="1.2" color="gray.100">
          {typeof value === "number" ? (
            <FormatNumber value={value} />
          ) : (
            value
          )}
          {suffix && (
            <Text as="span" fontSize="md" fontWeight="medium" color="gray.400" ml="1">
              {suffix}
            </Text>
          )}
        </Text>
        {description && (
          <Text fontSize="xs" color="gray.500">
            {description}
          </Text>
        )}
      </Card.Body>
    </Card.Root>
  );
}
