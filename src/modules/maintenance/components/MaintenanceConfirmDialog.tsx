"use client";

import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import type { MaintenanceListItem } from "../maintenance.types";

export type MaintenanceConfirmAction = "start" | "close";

interface MaintenanceConfirmDialogProps {
  record: MaintenanceListItem | null;
  action: MaintenanceConfirmAction | null;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (actualCostRupees?: string) => void;
}

export function MaintenanceConfirmDialog({
  record,
  action,
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: MaintenanceConfirmDialogProps) {
  const [actualCostRupees, setActualCostRupees] = useState("");

  if (!record || !action) {
    return null;
  }

  const isStart = action === "start";
  const title = isStart
    ? `Start maintenance for ${record.vehicle.registrationNumber}?`
    : `Close maintenance for ${record.vehicle.registrationNumber}?`;

  const description = isStart
    ? `This will move "${record.title}" from Open to In Progress. The vehicle remains In Shop and unavailable for dispatch.`
    : `This will close "${record.title}" and restore the vehicle to Available unless it is retired.`;

  return (
    <Dialog.Root
      role="alertdialog"
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          setActualCostRupees("");
        }
        onOpenChange(details.open);
      }}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.900" borderColor="gray.700">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack align="stretch" gap="4">
                <Text fontSize="sm" color="gray.300">
                  {record.vehicle.name} · {record.title}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  {description}
                </Text>
                {!isStart && (
                  <Field.Root>
                    <Field.Label fontSize="xs" color="gray.400">
                      ACTUAL COST (₹) — OPTIONAL
                    </Field.Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={actualCostRupees}
                      onChange={(event) =>
                        setActualCostRupees(event.target.value)
                      }
                      placeholder="Enter actual cost"
                      disabled={isPending}
                      bg="gray.800"
                      borderColor="gray.700"
                      color="gray.100"
                      _placeholder={{ color: "gray.500" }}
                    />
                  </Field.Root>
                )}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer gap="2">
              <Button
                variant="outline"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                colorPalette={isStart ? "orange" : "green"}
                loading={isPending}
                onClick={() =>
                  onConfirm(isStart ? undefined : actualCostRupees)
                }
              >
                {isStart ? "Start Maintenance" : "Close Maintenance"}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
