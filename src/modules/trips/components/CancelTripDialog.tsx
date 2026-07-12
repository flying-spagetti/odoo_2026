"use client";

import {
  Button,
  Dialog,
  Portal,
  Text,
} from "@chakra-ui/react";
import type { TripDetailView } from "../trip.types";

interface CancelTripDialogProps {
  trip: TripDetailView | null;
  open: boolean;
  isCancelling: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function CancelTripDialog({
  trip,
  open,
  isCancelling,
  onOpenChange,
  onConfirm,
}: CancelTripDialogProps) {
  if (!trip) {
    return null;
  }

  const restoresResources = trip.status === "DISPATCHED";

  return (
    <Dialog.Root
      role="alertdialog"
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.900" borderColor="gray.700">
            <Dialog.Header>
              <Dialog.Title>Cancel trip {trip.tripCode}?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize="sm" color="gray.300">
                {trip.source} → {trip.destination}
              </Text>
              <Text fontSize="sm" color="gray.400" mt="3">
                This trip will be marked as cancelled and cannot be dispatched
                again.
                {restoresResources
                  ? " The assigned vehicle and driver will be restored to Available."
                  : ""}
              </Text>
            </Dialog.Body>
            <Dialog.Footer gap="2">
              <Button
                variant="outline"
                disabled={isCancelling}
                onClick={() => onOpenChange(false)}
              >
                Keep trip
              </Button>
              <Button
                colorPalette="red"
                loading={isCancelling}
                onClick={onConfirm}
              >
                Cancel trip
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
