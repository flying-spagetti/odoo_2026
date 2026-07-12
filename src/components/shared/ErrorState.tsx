import { Alert, Box, Button } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Box py="8" px="4">
      <Alert.Root status="error" variant="surface">
        <Alert.Indicator>
          <LuTriangleAlert />
        </Alert.Indicator>
        <Box flex="1">
          <Alert.Title>{title}</Alert.Title>
          <Alert.Description>{message}</Alert.Description>
        </Box>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </Alert.Root>
    </Box>
  );
}
