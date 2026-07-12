"use client";

import { Alert, Box } from "@chakra-ui/react";
import { LuCircleX } from "react-icons/lu";
import type {
  MaintenanceFailure,
  MaintenanceFailureCode,
} from "../maintenance.types";

const FAILURE_TITLES: Partial<Record<MaintenanceFailureCode, string>> = {
  VEHICLE_RETIRED: "Vehicle retired",
  VEHICLE_ON_TRIP: "Vehicle on trip",
  ACTIVE_MAINTENANCE_EXISTS: "Active maintenance exists",
  INVALID_MAINTENANCE_STATE: "Invalid maintenance state",
  VEHICLE_UNAVAILABLE: "Vehicle unavailable",
  FORBIDDEN: "Permission denied",
  UNAUTHORIZED: "Authentication required",
  VALIDATION_ERROR: "Validation failed",
  VEHICLE_NOT_FOUND: "Vehicle not found",
  MAINTENANCE_NOT_FOUND: "Record not found",
};

interface MaintenanceFailureAlertProps {
  failure: MaintenanceFailure | null;
  title?: string;
}

export function MaintenanceFailureAlert({
  failure,
  title,
}: MaintenanceFailureAlertProps) {
  if (!failure) {
    return null;
  }

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
      </Box>
    </Alert.Root>
  );
}
