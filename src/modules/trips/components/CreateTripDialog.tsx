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
import type {
  CreateTripInput,
  TripDriverOption,
  TripFailure,
  TripVehicleOption,
} from "../trip.types";
import { TripFailureAlert } from "./TripFailureAlert";

const inputStyles = {
  bg: "gray.800",
  borderColor: "gray.700",
  color: "gray.100",
  _placeholder: { color: "gray.500" },
};

interface CreateTripDialogProps {
  open: boolean;
  vehicles: TripVehicleOption[];
  drivers: TripDriverOption[];
  isSubmitting: boolean;
  failure: TripFailure | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateTripInput) => Promise<boolean>;
}

export function CreateTripDialog({
  open,
  vehicles,
  drivers,
  isSubmitting,
  failure,
  onOpenChange,
  onSubmit,
}: CreateTripDialogProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoWeightKg, setCargoWeightKg] = useState("");
  const [plannedDistanceKm, setPlannedDistanceKm] = useState("");
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [driverId, setDriverId] = useState(drivers[0]?.id ?? "");
  const [localFailure, setLocalFailure] = useState<TripFailure | null>(null);

  const selectedVehicleId = vehicles.some((vehicle) => vehicle.id === vehicleId)
    ? vehicleId
    : (vehicles[0]?.id ?? "");
  const selectedDriverId = drivers.some((driver) => driver.id === driverId)
    ? driverId
    : (drivers[0]?.id ?? "");
  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicleId,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const parsedCargo = Number(cargoWeightKg);
    const parsedDistance = Number(plannedDistanceKm);

    if (!source.trim() || !destination.trim()) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Source and destination are required.",
      });
      return;
    }

    if (!selectedVehicleId || !selectedDriverId) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Select an available vehicle and driver.",
      });
      return;
    }

    if (!Number.isInteger(parsedCargo) || parsedCargo <= 0) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Cargo weight must be a positive whole number of kilograms.",
      });
      return;
    }

    if (!Number.isInteger(parsedDistance) || parsedDistance <= 0) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Planned distance must be a positive whole number of kilometers.",
      });
      return;
    }

    if (selectedVehicle && parsedCargo > selectedVehicle.maxLoadKg) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: `Cargo weight exceeds ${selectedVehicle.registrationNumber} capacity (${selectedVehicle.maxLoadKg} kg).`,
      });
      return;
    }

    setLocalFailure(null);

    const succeeded = await onSubmit({
      source: source.trim(),
      destination: destination.trim(),
      cargoWeightKg: parsedCargo,
      plannedDistanceKm: parsedDistance,
      vehicleId: selectedVehicleId,
      driverId: selectedDriverId,
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
        onOpenChange(details.open);
      }}
      placement="center"
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.900" borderColor="gray.700">
            <Dialog.Header>
              <Dialog.Title>Create trip</Dialog.Title>
            </Dialog.Header>
            <form onSubmit={handleSubmit}>
              <Dialog.Body>
                <VStack align="stretch" gap="4">
                  <Text fontSize="sm" color="gray.400">
                    Create a draft trip with an available vehicle and driver.
                    Dispatch readiness is checked before the trip goes on the
                    road.
                  </Text>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      SOURCE
                    </Field.Label>
                    <Input
                      value={source}
                      onChange={(event) => setSource(event.target.value)}
                      placeholder="Hyderabad Warehouse"
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      DESTINATION
                    </Field.Label>
                    <Input
                      value={destination}
                      onChange={(event) => setDestination(event.target.value)}
                      placeholder="Vijayawada Hub"
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      VEHICLE
                    </Field.Label>
                    <NativeSelect.Root
                      disabled={isSubmitting || vehicles.length === 0}
                    >
                      <NativeSelect.Field
                        value={selectedVehicleId}
                        onChange={(event) => setVehicleId(event.target.value)}
                        aria-label="Select vehicle"
                        {...inputStyles}
                      >
                        {vehicles.length === 0 ? (
                          <option value="">No available vehicles</option>
                        ) : (
                          vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.registrationNumber} — {vehicle.name} (
                              {vehicle.maxLoadKg} kg)
                            </option>
                          ))
                        )}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator color="gray.400" />
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      DRIVER
                    </Field.Label>
                    <NativeSelect.Root
                      disabled={isSubmitting || drivers.length === 0}
                    >
                      <NativeSelect.Field
                        value={selectedDriverId}
                        onChange={(event) => setDriverId(event.target.value)}
                        aria-label="Select driver"
                        {...inputStyles}
                      >
                        {drivers.length === 0 ? (
                          <option value="">No available drivers</option>
                        ) : (
                          drivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name} · {driver.licenseNumber}
                            </option>
                          ))
                        )}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator color="gray.400" />
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      CARGO WEIGHT (KG)
                    </Field.Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={cargoWeightKg}
                      onChange={(event) => setCargoWeightKg(event.target.value)}
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                    {selectedVehicle && (
                      <Text fontSize="xs" color="gray.500" mt="1">
                        Max capacity: {selectedVehicle.maxLoadKg} kg
                      </Text>
                    )}
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      PLANNED DISTANCE (KM)
                    </Field.Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={plannedDistanceKm}
                      onChange={(event) =>
                        setPlannedDistanceKm(event.target.value)
                      }
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <TripFailureAlert failure={localFailure ?? failure} />
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
                  colorPalette="blue"
                  loading={isSubmitting}
                  disabled={
                    isSubmitting ||
                    vehicles.length === 0 ||
                    drivers.length === 0
                  }
                >
                  Create draft trip
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
