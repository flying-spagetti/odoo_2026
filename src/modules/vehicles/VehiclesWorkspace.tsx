"use client";

import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import {
  canMutateVehiclesAction,
  createVehicleAction,
  listVehiclesAction,
} from "./vehicle.actions";
import { AddVehicleDialog } from "./components/AddVehicleDialog";
import { VehicleDirectory } from "./VehicleDirectory";
import type {
  CreateVehicleInput,
  VehicleFailure,
  VehicleListItem,
} from "./vehicle.types";

interface VehiclesWorkspaceProps {
  initialVehicles: VehicleListItem[];
  canMutate: boolean;
  initialError: string | null;
}

export function VehiclesWorkspace({
  initialVehicles,
  canMutate: initialCanMutate,
  initialError,
}: VehiclesWorkspaceProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [canMutate, setCanMutate] = useState(initialCanMutate);
  const [errorMessage, setErrorMessage] = useState(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createFailure, setCreateFailure] = useState<VehicleFailure | null>(
    null,
  );
  const [createFormKey, setCreateFormKey] = useState(0);

  const refreshVehicles = async () => {
    const [listResult, mutateAllowed] = await Promise.all([
      listVehiclesAction(),
      canMutateVehiclesAction(),
    ]);

    setCanMutate(mutateAllowed);

    if (!listResult.success) {
      setErrorMessage(listResult.error.message);
      setVehicles([]);
      return false;
    }

    setErrorMessage(null);
    setVehicles(listResult.data);
    return true;
  };

  const handleRetry = async () => {
    setIsLoading(true);
    await refreshVehicles();
    setIsLoading(false);
  };

  const openCreateDialog = () => {
    if (!canMutate || isCreating) {
      return;
    }

    setCreateFailure(null);
    setCreateFormKey((current) => current + 1);
    setCreateDialogOpen(true);
  };

  const handleCreateVehicle = async (input: CreateVehicleInput) => {
    if (!canMutate || isCreating) {
      return false;
    }

    setIsCreating(true);
    setCreateFailure(null);

    const result = await createVehicleAction(input);

    if (!result.success) {
      setCreateFailure(result.error);
      toaster.error({
        title:
          result.error.code === "DUPLICATE_REGISTRATION"
            ? "Registration already exists"
            : "Unable to add vehicle",
        description: result.error.message,
      });
      setIsCreating(false);
      return false;
    }

    toaster.success({
      title: "Vehicle added",
      description: `${result.data.registrationNumber} is Available for dispatch.`,
    });

    await refreshVehicles();
    setIsCreating(false);
    return true;
  };

  return (
    <>
      <VehicleDirectory
        vehicles={vehicles}
        isLoading={isLoading}
        errorMessage={errorMessage}
        canMutate={canMutate}
        onRetry={() => {
          void handleRetry();
        }}
        onAddVehicle={openCreateDialog}
      />

      {canMutate && (
        <AddVehicleDialog
          key={createFormKey}
          open={createDialogOpen}
          isSubmitting={isCreating}
          failure={createFailure}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateVehicle}
        />
      )}
    </>
  );
}
