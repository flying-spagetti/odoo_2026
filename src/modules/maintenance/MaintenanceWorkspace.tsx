"use client";

import { Box, Grid, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { toaster } from "@/components/ui/toaster";
import { rupeesToPaise } from "@/lib/utils/format";
import {
  closeMaintenanceAction,
  createMaintenanceRecordAction,
  listEligibleVehiclesForMaintenanceAction,
  listMaintenanceRecordsAction,
  startMaintenanceAction,
} from "./maintenance.actions";
import {
  CreateMaintenanceForm,
  type CreateMaintenanceFormValues,
} from "./components/CreateMaintenanceForm";
import {
  MaintenanceConfirmDialog,
  type MaintenanceConfirmAction,
} from "./components/MaintenanceConfirmDialog";
import { MaintenanceRecordsList } from "./components/MaintenanceRecordsList";
import { MaintenanceSummaryCards } from "./components/MaintenanceSummaryCards";
import type {
  EligibleVehicleOption,
  MaintenanceFailure,
  MaintenanceListItem,
} from "./maintenance.types";

function parseOptionalRupeesToPaise(
  value: string,
): { ok: true; paise?: number } | { ok: false; message: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: true };
  }

  const rupees = Number(trimmed);

  if (!Number.isFinite(rupees) || rupees < 0) {
    return {
      ok: false,
      message: "Cost must be a valid non-negative amount in rupees.",
    };
  }

  return { ok: true, paise: rupeesToPaise(rupees) };
}

interface MaintenanceWorkspaceProps {
  initialRecords: MaintenanceListItem[];
  initialVehicles: EligibleVehicleOption[];
  canMutate: boolean;
  initialError: string | null;
}

export function MaintenanceWorkspace({
  initialRecords,
  initialVehicles,
  canMutate,
  initialError,
}: MaintenanceWorkspaceProps) {
  const [records, setRecords] = useState(initialRecords);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [loadError, setLoadError] = useState(initialError);
  const [isRetrying, setIsRetrying] = useState(false);
  const [createFailure, setCreateFailure] = useState<MaintenanceFailure | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] =
    useState<MaintenanceConfirmAction | null>(null);
  const [confirmRecord, setConfirmRecord] =
    useState<MaintenanceListItem | null>(null);
  const [pendingRecordId, setPendingRecordId] = useState<string | null>(null);

  const isMutating = isCreating || isStarting || isClosing;

  const refreshWorkspace = async () => {
    const [recordsResult, vehiclesResult] = await Promise.all([
      listMaintenanceRecordsAction(),
      listEligibleVehiclesForMaintenanceAction(),
    ]);

    if (!recordsResult.success) {
      setLoadError(recordsResult.error.message);
      setRecords([]);
      return {
        recordsOk: false,
        vehiclesOk: vehiclesResult.success,
      };
    }

    setLoadError(null);
    setRecords(recordsResult.data);

    if (vehiclesResult.success) {
      setVehicles(vehiclesResult.data);
    } else {
      setVehicles([]);
      toaster.error({
        title: "Unable to load eligible vehicles",
        description: vehiclesResult.error.message,
      });
    }

    return {
      recordsOk: true,
      vehiclesOk: vehiclesResult.success,
    };
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await refreshWorkspace();
    setIsRetrying(false);
  };

  const handleCreate = async (values: CreateMaintenanceFormValues) => {
    if (isMutating) {
      return false;
    }

    if (!values.vehicleId || !values.title.trim() || !values.description.trim()) {
      setCreateFailure({
        code: "VALIDATION_ERROR",
        message: "Vehicle, title, and description are required.",
      });
      return false;
    }

    const costParse = parseOptionalRupeesToPaise(values.estimatedCostRupees);

    if (!costParse.ok) {
      setCreateFailure({
        code: "VALIDATION_ERROR",
        message: costParse.message,
      });
      return false;
    }

    setIsCreating(true);
    setCreateFailure(null);

    const result = await createMaintenanceRecordAction({
      vehicleId: values.vehicleId,
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      ...(costParse.paise !== undefined
        ? { estimatedCostPaise: costParse.paise }
        : {}),
    });

    if (!result.success) {
      setCreateFailure(result.error);
      toaster.error({
        title: "Unable to create maintenance",
        description: result.error.message,
      });
      setIsCreating(false);
      return false;
    }

    toaster.success({
      title: "Maintenance created",
      description: `${result.data.vehicle.registrationNumber} is now In Shop and unavailable for dispatch.`,
    });

    await refreshWorkspace();
    setIsCreating(false);
    return true;
  };

  const handleLifecycleRequest = (
    record: MaintenanceListItem,
    action: MaintenanceConfirmAction,
  ) => {
    if (isMutating) {
      return;
    }

    setConfirmRecord(record);
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const handleLifecycleConfirm = async (actualCostRupees?: string) => {
    if (!confirmRecord || !confirmAction || isMutating) {
      return;
    }

    setPendingRecordId(confirmRecord.id);

    if (confirmAction === "start") {
      setIsStarting(true);

      const result = await startMaintenanceAction(confirmRecord.id);

      if (!result.success) {
        toaster.error({
          title: "Unable to start maintenance",
          description: result.error.message,
        });
        setIsStarting(false);
        setPendingRecordId(null);
        return;
      }

      setConfirmOpen(false);
      toaster.success({
        title: "Maintenance started",
        description: `${result.data.vehicle.registrationNumber} remains In Shop while work is in progress.`,
      });

      await refreshWorkspace();
      setIsStarting(false);
      setPendingRecordId(null);
      setConfirmRecord(null);
      setConfirmAction(null);
      return;
    }

    const costParse = parseOptionalRupeesToPaise(actualCostRupees ?? "");

    if (!costParse.ok) {
      toaster.error({
        title: "Validation failed",
        description: costParse.message,
      });
      setPendingRecordId(null);
      return;
    }

    setIsClosing(true);

    const result = await closeMaintenanceAction(confirmRecord.id, {
      ...(costParse.paise !== undefined
        ? { actualCostPaise: costParse.paise }
        : {}),
    });

    if (!result.success) {
      toaster.error({
        title: "Unable to close maintenance",
        description: result.error.message,
      });
      setIsClosing(false);
      setPendingRecordId(null);
      return;
    }

    const restoredStatus = result.data.vehicle.status;
    setConfirmOpen(false);
    toaster.success({
      title: "Maintenance closed",
      description:
        restoredStatus === "RETIRED"
          ? `${result.data.vehicle.registrationNumber} remains Retired.`
          : `${result.data.vehicle.registrationNumber} returned to Available.`,
    });

    await refreshWorkspace();
    setIsClosing(false);
    setPendingRecordId(null);
    setConfirmRecord(null);
    setConfirmAction(null);
  };

  if (loadError && records.length === 0) {
    return (
      <ErrorState
        title="Unable to load maintenance"
        message={loadError}
        onRetry={() => {
          void handleRetry();
        }}
      />
    );
  }

  return (
    <>
      <VStack align="stretch" gap="6">
        <Box>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            color="gray.400"
            mb="3"
          >
            SUMMARY
          </Text>
          <MaintenanceSummaryCards records={records} />
        </Box>

        <Grid
          templateColumns={{ base: "1fr", xl: "minmax(320px, 380px) 1fr" }}
          gap={{ base: "6", xl: "8" }}
          alignItems="start"
        >
          <CreateMaintenanceForm
            vehicles={vehicles}
            canMutate={canMutate}
            isSubmitting={isCreating}
            failure={createFailure}
            onSubmit={handleCreate}
          />

          <MaintenanceRecordsList
            records={records}
            isLoading={isRetrying}
            canMutate={canMutate}
            isMutating={isMutating}
            pendingRecordId={pendingRecordId}
            onLifecycleAction={handleLifecycleRequest}
          />
        </Grid>
      </VStack>

      <MaintenanceConfirmDialog
        record={confirmRecord}
        action={confirmAction}
        open={confirmOpen}
        isPending={isStarting || isClosing}
        onOpenChange={(open) => {
          if (!open && (isStarting || isClosing)) {
            return;
          }
          setConfirmOpen(open);
          if (!open) {
            setConfirmRecord(null);
            setConfirmAction(null);
          }
        }}
        onConfirm={(actualCostRupees) => {
          void handleLifecycleConfirm(actualCostRupees);
        }}
      />
    </>
  );
}
