"use client";

import { Alert, Box } from "@chakra-ui/react";
import { LuCircleX } from "react-icons/lu";
import type { ExpenseFailure, ExpenseFailureCode } from "../expense.types";

const FAILURE_TITLES: Partial<Record<ExpenseFailureCode, string>> = {
  VEHICLE_NOT_FOUND: "Vehicle not found",
  TRIP_NOT_FOUND: "Trip not found",
  TRIP_VEHICLE_MISMATCH: "Trip does not match vehicle",
  VALIDATION_ERROR: "Validation failed",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Permission denied",
};

interface ExpenseFailureAlertProps {
  failure: ExpenseFailure | null;
  title?: string;
}

export function ExpenseFailureAlert({
  failure,
  title,
}: ExpenseFailureAlertProps) {
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
