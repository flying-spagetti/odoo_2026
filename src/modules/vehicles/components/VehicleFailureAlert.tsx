"use client";

import { Alert, Box } from "@chakra-ui/react";
import { LuCircleX } from "react-icons/lu";
import type { VehicleFailure, VehicleFailureCode } from "../vehicle.types";

const FAILURE_TITLES: Partial<Record<VehicleFailureCode, string>> = {
  DUPLICATE_REGISTRATION: "Registration already exists",
  VALIDATION_ERROR: "Validation failed",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Permission denied",
};

interface VehicleFailureAlertProps {
  failure: VehicleFailure | null;
  title?: string;
}

export function VehicleFailureAlert({
  failure,
  title,
}: VehicleFailureAlertProps) {
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
