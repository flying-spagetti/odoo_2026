"use client";

import {
  Button,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Portal,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { listTripOptionsForVehicleAction } from "../expense.actions";
import { EXPENSE_TYPES } from "../expense.schema";
import type {
  CreateExpenseInput,
  ExpenseFailure,
  ExpenseTripOption,
  ExpenseVehicleOption,
} from "../expense.types";
import { ExpenseFailureAlert } from "./ExpenseFailureAlert";

const inputStyles = {
  bg: "gray.800",
  borderColor: "gray.700",
  color: "gray.100",
  _placeholder: { color: "gray.500" },
};

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface AddExpenseDialogProps {
  open: boolean;
  vehicles: ExpenseVehicleOption[];
  isSubmitting: boolean;
  failure: ExpenseFailure | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateExpenseInput) => Promise<boolean>;
}

export function AddExpenseDialog({
  open,
  vehicles,
  isSubmitting,
  failure,
  onOpenChange,
  onSubmit,
}: AddExpenseDialogProps) {
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [tripId, setTripId] = useState("");
  const [type, setType] = useState<(typeof EXPENSE_TYPES)[number]>("TOLL");
  const [description, setDescription] = useState("");
  const [amountRupees, setAmountRupees] = useState("");
  const [incurredAt, setIncurredAt] = useState(() =>
    toDateTimeLocalValue(new Date()),
  );
  const [trips, setTrips] = useState<ExpenseTripOption[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [localFailure, setLocalFailure] = useState<ExpenseFailure | null>(null);

  const selectedVehicleId = vehicles.some((vehicle) => vehicle.id === vehicleId)
    ? vehicleId
    : (vehicles[0]?.id ?? "");

  const loadTrips = async (nextVehicleId: string) => {
    if (!nextVehicleId) {
      setTrips([]);
      return;
    }

    setIsLoadingTrips(true);
    const result = await listTripOptionsForVehicleAction(nextVehicleId);
    setTrips(result.success ? result.data : []);
    setIsLoadingTrips(false);
  };

  const handleVehicleChange = (nextVehicleId: string) => {
    setVehicleId(nextVehicleId);
    setTripId("");
    void loadTrips(nextVehicleId);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && selectedVehicleId) {
      void loadTrips(selectedVehicleId);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const parsedAmount = Number(amountRupees);

    if (!selectedVehicleId) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Select a vehicle.",
      });
      return;
    }

    if (!description.trim()) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Description is required.",
      });
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Amount must be greater than zero.",
      });
      return;
    }

    if (!incurredAt) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Incurred date/time is required.",
      });
      return;
    }

    setLocalFailure(null);

    const succeeded = await onSubmit({
      vehicleId: selectedVehicleId,
      ...(tripId ? { tripId } : {}),
      type,
      description: description.trim(),
      amountRupees: parsedAmount,
      incurredAt: new Date(incurredAt).toISOString(),
    });

    if (succeeded) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open && isSubmitting) {
          return;
        }
        handleOpenChange(details.open);
      }}
      placement="center"
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.900" borderColor="gray.700">
            <Dialog.Header>
              <Dialog.Title>Add expense</Dialog.Title>
            </Dialog.Header>
            <form onSubmit={handleSubmit}>
              <Dialog.Body>
                <VStack align="stretch" gap="4">
                  <Text fontSize="sm" color="gray.400">
                    Capture toll, parking, repair, or other operating costs.
                    Amount is entered in rupees and stored in paise.
                  </Text>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      VEHICLE
                    </Field.Label>
                    <NativeSelect.Root
                      disabled={isSubmitting || vehicles.length === 0}
                    >
                      <NativeSelect.Field
                        value={selectedVehicleId}
                        onChange={(event) =>
                          handleVehicleChange(event.target.value)
                        }
                        aria-label="Select vehicle"
                        {...inputStyles}
                      >
                        {vehicles.length === 0 ? (
                          <option value="">No vehicles available</option>
                        ) : (
                          vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.registrationNumber} — {vehicle.name}
                            </option>
                          ))
                        )}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator color="gray.400" />
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label fontSize="xs" color="gray.400">
                      TRIP (OPTIONAL)
                    </Field.Label>
                    <NativeSelect.Root
                      disabled={
                        isSubmitting || !selectedVehicleId || isLoadingTrips
                      }
                    >
                      <NativeSelect.Field
                        value={tripId}
                        onChange={(event) => setTripId(event.target.value)}
                        aria-label="Select trip"
                        {...inputStyles}
                      >
                        <option value="">No linked trip</option>
                        {trips.map((trip) => (
                          <option key={trip.id} value={trip.id}>
                            {trip.tripCode} · {trip.source} →{" "}
                            {trip.destination}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator color="gray.400" />
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      TYPE
                    </Field.Label>
                    <NativeSelect.Root disabled={isSubmitting}>
                      <NativeSelect.Field
                        value={type}
                        onChange={(event) =>
                          setType(
                            event.target.value as (typeof EXPENSE_TYPES)[number],
                          )
                        }
                        aria-label="Select expense type"
                        {...inputStyles}
                      >
                        {EXPENSE_TYPES.map((expenseType) => (
                          <option key={expenseType} value={expenseType}>
                            {expenseType.charAt(0) +
                              expenseType.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator color="gray.400" />
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      DESCRIPTION
                    </Field.Label>
                    <Textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={3}
                      disabled={isSubmitting}
                      placeholder="Describe the expense"
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      AMOUNT (₹)
                    </Field.Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amountRupees}
                      onChange={(event) => setAmountRupees(event.target.value)}
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      INCURRED AT
                    </Field.Label>
                    <Input
                      type="datetime-local"
                      value={incurredAt}
                      onChange={(event) => setIncurredAt(event.target.value)}
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <ExpenseFailureAlert failure={localFailure ?? failure} />
                </VStack>
              </Dialog.Body>
              <Dialog.Footer gap="2">
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorPalette="orange"
                  loading={isSubmitting}
                  disabled={isSubmitting || vehicles.length === 0}
                >
                  Save expense
                </Button>
              </Dialog.Footer>
            </form>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
