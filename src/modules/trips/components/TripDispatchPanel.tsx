"use client";

import {
  Box,
  Button,
  Field,
  Flex,
  Input,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { DispatchReadiness, TripDetailView, TripFailure } from "../trip.types";
import { CompleteTripForm } from "./CompleteTripForm";
import { DispatchReadinessPanel } from "./DispatchReadinessPanel";
import { TripFailureAlert } from "./TripFailureAlert";
import { TripLifecycleStrip } from "./TripLifecycleStrip";

interface TripDispatchPanelProps {
  trip: TripDetailView | null;
  readiness: DispatchReadiness | null;
  dispatchFailure: TripFailure | null;
  completeFailure: TripFailure | null;
  cancelFailure: TripFailure | null;
  isLoading: boolean;
  isReadinessLoading: boolean;
  isMutating: boolean;
  isDispatching: boolean;
  isCompleting: boolean;
  canMutate: boolean;
  onDispatch: () => void;
  onComplete: (finalOdometerKm: number) => void;
  onCancelRequest: () => void;
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
  completeFailure,
  cancelFailure,
  isLoading,
  isReadinessLoading,
  isMutating,
  isDispatching,
  isCompleting,
  canMutate,
  onDispatch,
  onComplete,
  onCancelRequest,
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
  const isDispatched = trip.status === "DISPATCHED";
  const isTerminal = trip.status === "COMPLETED" || trip.status === "CANCELLED";
  const canCancel = (isDraft || isDispatched) && canMutate && !isMutating;
  const dispatchEnabled =
    isDraft &&
    canMutate &&
    readiness?.ready === true &&
    !isMutating &&
    !isDispatching;

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="md"
      bg="gray.900"
      p={{ base: "4", md: "5" }}
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
            <Flex justify="space-between" align="center" gap="3" wrap="wrap">
              <Text fontSize="sm" color="gray.300">
                {trip.vehicle.name}
              </Text>
              <StatusBadge status={trip.vehicle.status} />
            </Flex>
            <Flex justify="space-between" align="center" gap="3" wrap="wrap">
              <Text fontSize="sm" color="gray.300">
                {trip.driver.name}
              </Text>
              <StatusBadge status={trip.driver.status} />
            </Flex>
          </VStack>
        </Box>

        {isDraft && (
          <>
            <Separator borderColor="gray.700" />
            <DispatchReadinessPanel
              readiness={readiness}
              isLoading={isReadinessLoading}
            />
            <TripFailureAlert failure={dispatchFailure} title="Dispatch blocked" />
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
          </>
        )}

        {isDispatched && (
          <>
            <Separator borderColor="gray.700" />
            <CompleteTripForm
              key={trip.id}
              trip={trip}
              canMutate={canMutate}
              isCompleting={isCompleting}
              completeFailure={completeFailure}
              onComplete={onComplete}
            />
          </>
        )}

        {isTerminal && (
          <Box
            borderWidth="1px"
            borderColor="gray.700"
            borderRadius="md"
            bg="gray.950"
            p="3"
          >
            <Flex align="center" gap="2" wrap="wrap">
              <Text fontSize="sm" color="gray.400">
                This trip is closed with status
              </Text>
              <StatusBadge status={trip.status} />
            </Flex>
          </Box>
        )}

        {(isDraft || isDispatched) && (
          <>
            <Separator borderColor="gray.700" />
            <TripFailureAlert failure={cancelFailure} title="Cancellation failed" />
            <Button
              variant="outline"
              colorPalette="red"
              size="md"
              w="full"
              disabled={!canCancel}
              onClick={onCancelRequest}
            >
              Cancel trip
            </Button>
            {!canMutate && (
              <Text fontSize="xs" color="gray.500" textAlign="center">
                Cancelling trips requires Fleet Manager or Dispatcher role.
              </Text>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
}
