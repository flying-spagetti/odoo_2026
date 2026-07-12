"use client";

import {
  Badge,
  Button,
  Card,
  Field,
  HStack,
  Input,
  NativeSelect,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { MAINTENANCE_PRIORITIES } from "../maintenance.schema";
import type {
  EligibleVehicleOption,
  MaintenanceFailure,
} from "../maintenance.types";
import { MaintenanceFailureAlert } from "./MaintenanceFailureAlert";

const inputStyles = {
  bg: "gray.800",
  borderColor: "gray.700",
  color: "gray.100",
  _placeholder: { color: "gray.500" },
};

const labelStyles = {
  color: "gray.400",
  fontSize: "xs",
  letterSpacing: "wider",
};

export type CreateMaintenanceFormValues = {
  vehicleId: string;
  title: string;
  description: string;
  priority: (typeof MAINTENANCE_PRIORITIES)[number];
  estimatedCostRupees: string;
};

function getEmptyFormValues(): Omit<CreateMaintenanceFormValues, "vehicleId"> {
  return {
    title: "",
    description: "",
    priority: "MEDIUM",
    estimatedCostRupees: "",
  };
}

interface CreateMaintenanceFormProps {
  vehicles: EligibleVehicleOption[];
  canMutate: boolean;
  isSubmitting: boolean;
  failure: MaintenanceFailure | null;
  onSubmit: (values: CreateMaintenanceFormValues) => Promise<boolean>;
}

export function CreateMaintenanceForm({
  vehicles,
  canMutate,
  isSubmitting,
  failure,
  onSubmit,
}: CreateMaintenanceFormProps) {
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [fields, setFields] = useState(getEmptyFormValues);

  const selectedVehicleId = vehicles.some((vehicle) => vehicle.id === vehicleId)
    ? vehicleId
    : (vehicles[0]?.id ?? "");

  const handleFieldChange = <K extends keyof typeof fields>(
    field: K,
    value: (typeof fields)[K],
  ) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canMutate || isSubmitting) {
      return;
    }

    const succeeded = await onSubmit({
      vehicleId: selectedVehicleId,
      ...fields,
    });

    if (succeeded) {
      setFields(getEmptyFormValues());
    }
  };

  if (!canMutate) {
    return (
      <Card.Root variant="outline" bg="gray.900" borderColor="gray.700" borderRadius="lg">
        <Card.Body gap="3">
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            color="gray.400"
          >
            CREATE MAINTENANCE
          </Text>
          <Text fontSize="sm" color="gray.400">
            Only fleet managers can create maintenance records. You can still
            view existing records and vehicle shop status.
          </Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="outline" bg="gray.900" borderColor="gray.700" borderRadius="lg">
      <Card.Body gap="5">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          letterSpacing="wider"
          color="gray.400"
        >
          CREATE MAINTENANCE
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack align="stretch" gap="4">
            <Field.Root required>
              <Field.Label {...labelStyles}>VEHICLE</Field.Label>
              <NativeSelect.Root
                disabled={isSubmitting || vehicles.length === 0}
              >
                <NativeSelect.Field
                  value={selectedVehicleId}
                  onChange={(event) => setVehicleId(event.target.value)}
                  aria-label="Select eligible vehicle"
                  {...inputStyles}
                >
                  {vehicles.length === 0 ? (
                    <option value="">No eligible vehicles</option>
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

            <Field.Root required>
              <Field.Label {...labelStyles}>TITLE / SERVICE TYPE</Field.Label>
              <Input
                value={fields.title}
                onChange={(event) =>
                  handleFieldChange("title", event.target.value)
                }
                placeholder="Oil Change"
                disabled={isSubmitting}
                {...inputStyles}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label {...labelStyles}>DESCRIPTION</Field.Label>
              <Textarea
                value={fields.description}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
                placeholder="Describe the work required"
                rows={3}
                disabled={isSubmitting}
                {...inputStyles}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label {...labelStyles}>PRIORITY</Field.Label>
              <NativeSelect.Root disabled={isSubmitting}>
                <NativeSelect.Field
                  value={fields.priority}
                  onChange={(event) =>
                    handleFieldChange(
                      "priority",
                      event.target
                        .value as CreateMaintenanceFormValues["priority"],
                    )
                  }
                  aria-label="Select priority"
                  {...inputStyles}
                >
                  {MAINTENANCE_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0) + priority.slice(1).toLowerCase()}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator color="gray.400" />
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root>
              <Field.Label {...labelStyles}>ESTIMATED COST (₹)</Field.Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={fields.estimatedCostRupees}
                onChange={(event) =>
                  handleFieldChange("estimatedCostRupees", event.target.value)
                }
                placeholder="2500"
                disabled={isSubmitting}
                {...inputStyles}
              />
            </Field.Root>

            <MaintenanceFailureAlert failure={failure} />

            <Button
              type="submit"
              size="lg"
              colorPalette="blue"
              loading={isSubmitting}
              disabled={isSubmitting || vehicles.length === 0}
              w="full"
              mt="2"
            >
              Create maintenance
            </Button>
          </VStack>
        </form>

        <VStack align="stretch" gap="3" pt="2">
          <HStack gap="2" fontSize="sm" color="gray.300" flexWrap="wrap">
            <Badge colorPalette="green" variant="subtle">
              Available
            </Badge>
            <LuArrowRight />
            <Badge colorPalette="orange" variant="subtle">
              In Shop
            </Badge>
            <Text fontSize="xs" color="gray.500">
              creating a record
            </Text>
          </HStack>

          <HStack gap="2" fontSize="sm" color="gray.300" flexWrap="wrap">
            <Badge colorPalette="orange" variant="subtle">
              In Shop
            </Badge>
            <LuArrowRight />
            <Badge colorPalette="green" variant="subtle">
              Available
            </Badge>
            <Text fontSize="xs" color="gray.500">
              closing maintenance
            </Text>
          </HStack>

          <Text fontSize="sm" color="orange.400">
            Note: In Shop vehicles are unavailable for dispatch.
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
