"use client";

import { Alert, Box, Text, VStack } from "@chakra-ui/react";
import { LuCircleX } from "react-icons/lu";
import type { TripFailure, TripFailureCode } from "../trip.types";

const FAILURE_TITLES: Partial<Record<TripFailureCode, string>> = {
  DISPATCH_BLOCKED: "Dispatch blocked",
  INVALID_ODOMETER: "Invalid odometer reading",
  INVALID_TRIP_STATE: "Action not allowed",
  VEHICLE_NOT_FOUND: "Vehicle not found",
  DRIVER_NOT_FOUND: "Driver not found",
  VEHICLE_UNAVAILABLE: "Vehicle unavailable",
  DRIVER_UNAVAILABLE: "Driver unavailable",
  VALIDATION_ERROR: "Validation failed",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Permission denied",
};

interface TripFailureAlertProps {
  failure: TripFailure | null;
  title?: string;
}

export function TripFailureAlert({ failure, title }: TripFailureAlertProps) {
  if (!failure) {
    return null;
  }

  const readiness = failure.details?.readiness;
  const alertTitle =
    title ?? FAILURE_TITLES[failure.code] ?? "Action failed";

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
        <Alert.Title fontSize="sm">{alertTitle}</Alert.Title>
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
