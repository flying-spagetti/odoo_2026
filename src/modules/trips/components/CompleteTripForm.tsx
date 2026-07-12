"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Field,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formatOdometer } from "@/lib/utils/format";
import type { TripDetailView, TripFailure } from "../trip.types";
import { TripFailureAlert } from "./TripFailureAlert";

interface CompleteTripFormProps {
  trip: TripDetailView;
  canMutate: boolean;
  isCompleting: boolean;
  completeFailure: TripFailure | null;
  onComplete: (finalOdometerKm: number) => void;
}

function parseOdometerInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function CompleteTripForm({
  trip,
  canMutate,
  isCompleting,
  completeFailure,
  onComplete,
}: CompleteTripFormProps) {
  const [finalOdometerInput, setFinalOdometerInput] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const parsedOdometer = useMemo(
    () => parseOdometerInput(finalOdometerInput),
    [finalOdometerInput],
  );

  const validationMessage = useMemo(() => {
    if (!finalOdometerInput.trim()) {
      return "Enter the vehicle's final odometer reading.";
    }

    if (parsedOdometer === null) {
      return "Odometer must be a whole number of kilometres.";
    }

    if (parsedOdometer < trip.vehicle.odometerKm) {
      return `Final odometer cannot be lower than the current reading (${formatOdometer(trip.vehicle.odometerKm)}).`;
    }

    return null;
  }, [finalOdometerInput, parsedOdometer, trip.vehicle.odometerKm]);

  const canSubmit =
    canMutate &&
    !isCompleting &&
    parsedOdometer !== null &&
    validationMessage === null;

  const handleSubmit = () => {
    if (parsedOdometer === null || validationMessage) {
      setClientError(validationMessage ?? "Enter a valid odometer reading.");
      return;
    }

    setClientError(null);
    onComplete(parsedOdometer);
  };

  return (
    <VStack align="stretch" gap="3">
      <Text
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="wider"
        color="gray.400"
        textTransform="uppercase"
      >
        Complete trip
      </Text>

      <Text fontSize="sm" color="gray.400">
        Current vehicle odometer:{" "}
        <Text as="span" color="gray.200" fontWeight="medium">
          {formatOdometer(trip.vehicle.odometerKm)}
        </Text>
      </Text>

      <Field.Root invalid={Boolean(clientError || completeFailure)}>
        <Field.Label fontSize="xs" color="gray.400">
          Final odometer (km)
        </Field.Label>
        <Input
          type="number"
          inputMode="numeric"
          min={trip.vehicle.odometerKm}
          step={1}
          value={finalOdometerInput}
          onChange={(event) => {
            setFinalOdometerInput(event.target.value);
            setClientError(null);
          }}
          placeholder={String(trip.vehicle.odometerKm)}
          size="sm"
          bg="gray.900"
          borderColor="gray.700"
          color="gray.100"
          disabled={!canMutate || isCompleting}
        />
        {(clientError || validationMessage) && finalOdometerInput && (
          <Field.ErrorText fontSize="xs">
            {clientError ?? validationMessage}
          </Field.ErrorText>
        )}
        <Field.HelperText fontSize="xs" color="gray.500">
          Must be at or above the current odometer reading.
        </Field.HelperText>
      </Field.Root>

      <TripFailureAlert failure={completeFailure} />

      <Button
        colorPalette="green"
        size="lg"
        w="full"
        loading={isCompleting}
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        Complete trip
      </Button>

      {!canMutate && (
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Completing trips requires Fleet Manager or Dispatcher role.
        </Text>
      )}
    </VStack>
  );
}
