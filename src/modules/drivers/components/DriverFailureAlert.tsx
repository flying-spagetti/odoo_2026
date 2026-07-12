"use client";

import { Alert, Box } from "@chakra-ui/react";
import { LuCircleX } from "react-icons/lu";
import type { DriverFailure, DriverFailureCode } from "../driver.types";

const FAILURE_TITLES: Partial<Record<DriverFailureCode, string>> = {
  DUPLICATE_LICENSE: "Licence already exists",
  VALIDATION_ERROR: "Validation failed",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Permission denied",
};

interface DriverFailureAlertProps {
  failure: DriverFailure | null;
  title?: string;
}

export function DriverFailureAlert({
  failure,
  title,
}: DriverFailureAlertProps) {
  if (!failure) {
    return null;
  }

  const alertTitle = title ?? FAILURE_TITLES[failure.code] ?? "Action failed";

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
      </Box>
    </Alert.Root>
  );
}
