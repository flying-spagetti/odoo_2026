"use client";

import {
  Button,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { listTripOptionsForVehicleAction } from "../expense.actions";
import type {
  CreateFuelLogInput,
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

interface LogFuelDialogProps {
  open: boolean;
  vehicles: ExpenseVehicleOption[];
  isSubmitting: boolean;
  failure: ExpenseFailure | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateFuelLogInput) => Promise<boolean>;
}

export function LogFuelDialog({
  open,
  vehicles,
  isSubmitting,
  failure,
  onOpenChange,
  onSubmit,
}: LogFuelDialogProps) {
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [tripId, setTripId] = useState("");
  const [liters, setLiters] = useState("");
  const [costRupees, setCostRupees] = useState("");
  const [odometerKm, setOdometerKm] = useState(
    String(vehicles[0]?.odometerKm ?? ""),
  );
  const [loggedAt, setLoggedAt] = useState(() =>
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
    const vehicle = vehicles.find((item) => item.id === nextVehicleId);
    if (vehicle) {
      setOdometerKm(String(vehicle.odometerKm));
    }
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

    const parsedLiters = Number(liters);
    const parsedCost = Number(costRupees);
    const parsedOdometer = Number(odometerKm);

    if (!selectedVehicleId) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Select a vehicle.",
      });
      return;
    }

    if (!Number.isFinite(parsedLiters) || parsedLiters <= 0) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Liters must be greater than zero.",
      });
      return;
    }

    if (!Number.isFinite(parsedCost) || parsedCost <= 0) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Fuel cost must be greater than zero.",
      });
      return;
    }

    if (!Number.isFinite(parsedOdometer) || parsedOdometer < 0) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Odometer must be zero or greater.",
      });
      return;
    }

    if (!loggedAt) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Logged date/time is required.",
      });
      return;
    }

    setLocalFailure(null);

    const succeeded = await onSubmit({
      vehicleId: selectedVehicleId,
      ...(tripId ? { tripId } : {}),
      liters: parsedLiters,
      costRupees: parsedCost,
      odometerKm: Math.trunc(parsedOdometer),
      loggedAt: new Date(loggedAt).toISOString(),
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
              <Dialog.Title>Log fuel</Dialog.Title>
            </Dialog.Header>
            <form onSubmit={handleSubmit}>
              <Dialog.Body>
                <VStack align="stretch" gap="4">
                  <Text fontSize="sm" color="gray.400">
                    Record a fuel purchase. Cost is entered in rupees and stored
                    in paise.
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
                      LITRES
                    </Field.Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={liters}
                      onChange={(event) => setLiters(event.target.value)}
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      FUEL COST (₹)
                    </Field.Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={costRupees}
                      onChange={(event) => setCostRupees(event.target.value)}
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      ODOMETER (KM)
                    </Field.Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={odometerKm}
                      onChange={(event) => setOdometerKm(event.target.value)}
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      LOGGED AT
                    </Field.Label>
                    <Input
                      type="datetime-local"
                      value={loggedAt}
                      onChange={(event) => setLoggedAt(event.target.value)}
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
                  Save fuel log
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
