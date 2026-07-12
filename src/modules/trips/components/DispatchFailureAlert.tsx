"use client";

import { Alert, Box, Text, VStack } from "@chakra-ui/react";
import { LuCircleX } from "react-icons/lu";
import type { TripFailure } from "../trip.types";

interface DispatchFailureAlertProps {
  failure: TripFailure | null;
}

export function DispatchFailureAlert({ failure }: DispatchFailureAlertProps) {
  if (!failure) {
    return null;
  }

  const readiness = failure.details?.readiness;

  return (
    <Alert.Root
      status="error"
      variant="surface"
      bg="red.950"
      borderColor="red.700"
      borderWidth="1px"
    >
      <Alert.Indicator>
        <LuCircleX />
      </Alert.Indicator>
      <Box flex="1">
        <Alert.Title fontSize="sm">Dispatch blocked</Alert.Title>
        <Alert.Description fontSize="sm" mt="1">
          {failure.message}
        </Alert.Description>
        {readiness && (
          <VStack align="stretch" gap="1" mt="3">
            {readiness.checks
              .filter((check) => !check.passed)
              .map((check) => (
                <Text key={check.code} fontSize="xs" color="red.200">
                  {check.reason ?? check.label}
                </Text>
              ))}
          </VStack>
        )}
      </Box>
    </Alert.Root>
  );
}
