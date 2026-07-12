"use client";

import {
  Box,
  Button,
  Field,
  Flex,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { DispatchReadiness, TripDetailView, TripFailure } from "../trip.types";
import { DispatchFailureAlert } from "./DispatchFailureAlert";
import { DispatchReadinessPanel } from "./DispatchReadinessPanel";
import { TripLifecycleStrip } from "./TripLifecycleStrip";

interface TripDispatchPanelProps {
  trip: TripDetailView | null;
  readiness: DispatchReadiness | null;
  dispatchFailure: TripFailure | null;
  isLoading: boolean;
  isReadinessLoading: boolean;
  isDispatching: boolean;
  canDispatch: boolean;
  onDispatch: () => void;
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Field.Root>
      <Field.Label fontSize="xs" color="gray.400">
        {label}
      </Field.Label>
      <Input
        value={value}
        readOnly
        size="sm"
        bg="gray.900"
        borderColor="gray.700"
        color="gray.100"
      />
    </Field.Root>
  );
}

export function TripDispatchPanel({
  trip,
  readiness,
  dispatchFailure,
  isLoading,
  isReadinessLoading,
  isDispatching,
  canDispatch,
  onDispatch,
}: TripDispatchPanelProps) {
  if (isLoading) {
    return (
      <Box
        borderWidth="1px"
        borderColor="gray.700"
        borderRadius="md"
        bg="gray.900"
        p="5"
      >
        <Text fontSize="sm" color="gray.400">
          Loading trip details...
        </Text>
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box
        borderWidth="1px"
        borderColor="gray.700"
        borderRadius="md"
        bg="gray.900"
        p="5"
      >
        <Text fontSize="sm" color="gray.400">
          Select a trip from the live board to review dispatch readiness.
        </Text>
      </Box>
    );
  }

  const isDraft = trip.status === "DRAFT";
  const dispatchEnabled =
    isDraft && canDispatch && readiness?.ready === true && !isDispatching;

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="md"
      bg="gray.900"
      p="5"
    >
      <VStack align="stretch" gap="5">
        <Box>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            color="gray.400"
            textTransform="uppercase"
            mb="3"
          >
            Trip lifecycle
          </Text>
          <TripLifecycleStrip status={trip.status} />
        </Box>

        <Box>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            color="gray.400"
            textTransform="uppercase"
            mb="3"
          >
            Trip details
          </Text>
          <VStack align="stretch" gap="3">
            <ReadOnlyField label="Trip code" value={trip.tripCode} />
            <ReadOnlyField label="Source" value={trip.source} />
            <ReadOnlyField label="Destination" value={trip.destination} />
            <ReadOnlyField
              label="Vehicle"
              value={`${trip.vehicle.name} · ${trip.vehicle.maxLoadKg} kg capacity`}
            />
            <ReadOnlyField label="Driver" value={trip.driver.name} />
            <ReadOnlyField
              label="Cargo weight (kg)"
              value={String(trip.cargoWeightKg)}
            />
            <ReadOnlyField
              label="Planned distance (km)"
              value={String(trip.plannedDistanceKm)}
            />
          </VStack>
        </Box>

        <Box>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            color="gray.400"
            textTransform="uppercase"
            mb="2"
          >
            Resource status
          </Text>
          <VStack align="stretch" gap="2">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text fontSize="sm" color="gray.300">
                {trip.vehicle.name}
              </Text>
              <StatusBadge status={trip.vehicle.status} />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text fontSize="sm" color="gray.300">
                {trip.driver.name}
              </Text>
              <StatusBadge status={trip.driver.status} />
            </Box>
          </VStack>
        </Box>

        {isDraft && (
          <>
            <DispatchReadinessPanel
              readiness={readiness}
              isLoading={isReadinessLoading}
            />
            <DispatchFailureAlert failure={dispatchFailure} />
            <Button
              colorPalette="blue"
              size="lg"
              w="full"
              loading={isDispatching}
              disabled={!dispatchEnabled}
              onClick={onDispatch}
            >
              {dispatchEnabled ? "Dispatch" : "Dispatch (blocked)"}
            </Button>
            {!canDispatch && (
              <Text fontSize="xs" color="gray.500" textAlign="center">
                Dispatch requires Fleet Manager or Dispatcher role.
              </Text>
            )}
          </>
        )}

        {!isDraft && (
          <Box
            borderWidth="1px"
            borderColor="gray.700"
            borderRadius="md"
            bg="gray.950"
            p="3"
          >
            <Flex align="center" gap="2" wrap="wrap">
              <Text fontSize="sm" color="gray.400">
                Only draft trips can be dispatched. This trip is currently
              </Text>
              <StatusBadge status={trip.status} />
            </Flex>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
