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
import { VEHICLE_TYPES } from "../vehicle.schema";
import type {
  CreateVehicleInput,
  VehicleFailure,
} from "../vehicle.types";
import { VehicleFailureAlert } from "./VehicleFailureAlert";
import { VEHICLE_TYPE_LABELS } from "@/types/vehicle";
import type { VehicleType } from "@/types/vehicle";

const inputStyles = {
  bg: "gray.800",
  borderColor: "gray.700",
  color: "gray.100",
  _placeholder: { color: "gray.500" },
  _focusVisible: {
    borderColor: "blue.500",
    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
  },
};

interface AddVehicleDialogProps {
  open: boolean;
  isSubmitting: boolean;
  failure: VehicleFailure | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateVehicleInput) => Promise<boolean>;
}

export function AddVehicleDialog({
  open,
  isSubmitting,
  failure,
  onOpenChange,
  onSubmit,
}: AddVehicleDialogProps) {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState<VehicleType>("VAN");
  const [maxLoadKg, setMaxLoadKg] = useState("");
  const [odometerKm, setOdometerKm] = useState("0");
  const [acquisitionCostRupees, setAcquisitionCostRupees] = useState("");
  const [region, setRegion] = useState("");
  const [localFailure, setLocalFailure] = useState<VehicleFailure | null>(null);

  const displayedFailure = localFailure ?? failure;

  const resetForm = () => {
    setRegistrationNumber("");
    setName("");
    setModel("");
    setType("VAN");
    setMaxLoadKg("");
    setOdometerKm("0");
    setAcquisitionCostRupees("");
    setRegion("");
    setLocalFailure(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) {
      return;
    }
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const parsedMaxLoad = Number(maxLoadKg);
    const parsedOdometer = Number(odometerKm);
    const parsedCost = Number(acquisitionCostRupees);

    if (!registrationNumber.trim()) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Registration number is required.",
      });
      return;
    }

    if (!name.trim() || !model.trim()) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Name and model are required.",
      });
      return;
    }

    if (!Number.isInteger(parsedMaxLoad) || parsedMaxLoad <= 0) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Capacity must be a positive whole number of kilograms.",
      });
      return;
    }

    if (!Number.isInteger(parsedOdometer) || parsedOdometer < 0) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Odometer must be a whole number of kilometres (0 or more).",
      });
      return;
    }

    if (!Number.isFinite(parsedCost) || parsedCost <= 0) {
      setLocalFailure({
        code: "VALIDATION_ERROR",
        message: "Acquisition cost must be a positive amount in rupees.",
      });
      return;
    }

    setLocalFailure(null);

    const succeeded = await onSubmit({
      registrationNumber: registrationNumber.trim(),
      name: name.trim(),
      model: model.trim(),
      type,
      maxLoadKg: parsedMaxLoad,
      odometerKm: parsedOdometer,
      acquisitionCostRupees: parsedCost,
      ...(region.trim() ? { region: region.trim() } : {}),
    });

    if (succeeded) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => handleOpenChange(details.open)}
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.900" borderColor="gray.700" borderWidth="1px">
            <Dialog.Header>
              <Dialog.Title color="gray.100">Add vehicle</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>

            <Dialog.Body>
              <form onSubmit={handleSubmit} id="add-vehicle-form">
                <VStack align="stretch" gap="4">
                  <Text fontSize="sm" color="gray.400">
                    New vehicles are registered as Available and enter the
                    dispatch pool immediately.
                  </Text>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      REGISTRATION NUMBER
                    </Field.Label>
                    <Input
                      value={registrationNumber}
                      onChange={(event) => {
                        setRegistrationNumber(event.target.value.toUpperCase());
                        setLocalFailure(null);
                      }}
                      placeholder="AP31TV5005"
                      disabled={isSubmitting}
                      autoComplete="off"
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      NAME
                    </Field.Label>
                    <Input
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setLocalFailure(null);
                      }}
                      placeholder="Van-05"
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      MODEL
                    </Field.Label>
                    <Input
                      value={model}
                      onChange={(event) => {
                        setModel(event.target.value);
                        setLocalFailure(null);
                      }}
                      placeholder="Transit Custom"
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      TYPE
                    </Field.Label>
                    <NativeSelect.Root disabled={isSubmitting}>
                      <NativeSelect.Field
                        value={type}
                        onChange={(event) =>
                          setType(event.target.value as VehicleType)
                        }
                        aria-label="Select vehicle type"
                        {...inputStyles}
                      >
                        {VEHICLE_TYPES.map((vehicleType) => (
                          <option key={vehicleType} value={vehicleType}>
                            {VEHICLE_TYPE_LABELS[vehicleType]}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator color="gray.400" />
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      CAPACITY (KG)
                    </Field.Label>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={maxLoadKg}
                      onChange={(event) => {
                        setMaxLoadKg(event.target.value);
                        setLocalFailure(null);
                      }}
                      placeholder="500"
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
                      min={0}
                      step={1}
                      value={odometerKm}
                      onChange={(event) => {
                        setOdometerKm(event.target.value);
                        setLocalFailure(null);
                      }}
                      placeholder="0"
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontSize="xs" color="gray.400">
                      ACQUISITION COST (₹)
                    </Field.Label>
                    <Input
                      type="number"
                      min={1}
                      step="1"
                      value={acquisitionCostRupees}
                      onChange={(event) => {
                        setAcquisitionCostRupees(event.target.value);
                        setLocalFailure(null);
                      }}
                      placeholder="1850000"
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label fontSize="xs" color="gray.400">
                      REGION (OPTIONAL)
                    </Field.Label>
                    <Input
                      value={region}
                      onChange={(event) => setRegion(event.target.value)}
                      placeholder="Andhra Pradesh"
                      disabled={isSubmitting}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <VehicleFailureAlert failure={displayedFailure} />
                </VStack>
              </form>
            </Dialog.Body>

            <Dialog.Footer gap="3">
              <Button
                variant="outline"
                colorPalette="gray"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-vehicle-form"
                colorPalette="blue"
                loading={isSubmitting}
              >
                Add vehicle
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
