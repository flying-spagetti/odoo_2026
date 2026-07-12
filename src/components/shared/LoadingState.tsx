import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <Center py="16" px="6">
      <VStack gap="4">
        <Spinner size="lg" color="blue.500" />
        <Text fontSize="sm" color="fg.muted">
          {message}
        </Text>
      </VStack>
    </Center>
  );
}
