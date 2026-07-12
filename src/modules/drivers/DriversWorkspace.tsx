"use client";

import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import {
  canMutateDriversAction,
  createDriverAction,
  listDriversAction,
} from "./driver.actions";
import { AddDriverDialog } from "./components/AddDriverDialog";
import { DriverDirectory } from "./DriverDirectory";
import type {
  CreateDriverInput,
  DriverFailure,
  DriverListItem,
} from "./driver.types";

interface DriversWorkspaceProps {
  initialDrivers: DriverListItem[];
  canMutate: boolean;
  initialError: string | null;
}

export function DriversWorkspace({
  initialDrivers,
  canMutate: initialCanMutate,
  initialError,
}: DriversWorkspaceProps) {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [canMutate, setCanMutate] = useState(initialCanMutate);
  const [errorMessage, setErrorMessage] = useState(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createFailure, setCreateFailure] = useState<DriverFailure | null>(
    null,
  );
  const [createFormKey, setCreateFormKey] = useState(0);

  const refreshDrivers = async () => {
    const [listResult, mutateAllowed] = await Promise.all([
      listDriversAction(),
      canMutateDriversAction(),
    ]);

    setCanMutate(mutateAllowed);

    if (!listResult.success) {
      setErrorMessage(listResult.error.message);
      setDrivers([]);
      return false;
    }

    setErrorMessage(null);
    setDrivers(listResult.data);
    return true;
  };

  const handleRetry = async () => {
    setIsLoading(true);
    await refreshDrivers();
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

  const handleCreateDriver = async (input: CreateDriverInput) => {
    if (!canMutate || isCreating) {
      return false;
    }

    setIsCreating(true);
    setCreateFailure(null);

    const result = await createDriverAction(input);

    if (!result.success) {
      setCreateFailure(result.error);
      toaster.error({
        title:
          result.error.code === "DUPLICATE_LICENSE"
            ? "Licence already exists"
            : "Unable to add driver",
        description: result.error.message,
      });
      setIsCreating(false);
      return false;
    }

    toaster.success({
      title: "Driver added",
      description: `${result.data.name} is Available for trip assignment.`,
    });

    await refreshDrivers();
    setIsCreating(false);
    return true;
  };

  return (
    <>
      <DriverDirectory
        drivers={drivers}
        isLoading={isLoading}
        errorMessage={errorMessage}
        canMutate={canMutate}
        onRetry={() => {
          void handleRetry();
        }}
        onAddDriver={openCreateDialog}
      />

      {canMutate && (
        <AddDriverDialog
          key={createFormKey}
          open={createDialogOpen}
          isSubmitting={isCreating}
          failure={createFailure}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateDriver}
        />
      )}
    </>
  );
}
