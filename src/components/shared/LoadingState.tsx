import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <Center py="16" px="6" bg="gray.900">
      <VStack gap="4">
        <Spinner size="lg" color="blue.400" />
        <Text fontSize="sm" color="gray.400">
          {message}
        </Text>
      </VStack>
    </Center>
  );
}
