import { Box, Button, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { Icon } from "@chakra-ui/react";

interface EmptyStateProps {
  icon?: IconType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      py="12"
      px="6"
      gap="3"
      bg="gray.900"
    >
      {icon && (
        <Icon as={icon} boxSize="10" color="gray.500" aria-hidden />
      )}
      <Text fontWeight="semibold" fontSize="md" color="gray.100">
        {title}
      </Text>
      {description && (
        <Text fontSize="sm" color="gray.400" maxW="md">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button size="sm" colorPalette="blue" onClick={onAction} mt="2">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
