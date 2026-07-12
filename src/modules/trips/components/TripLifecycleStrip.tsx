"use client";

import { Box, Circle, Flex, HStack, Text } from "@chakra-ui/react";
import type { TripStatus } from "@/generated/prisma/client";

const LIFECYCLE_STEPS: { status: TripStatus; label: string }[] = [
  { status: "DRAFT", label: "Draft" },
  { status: "DISPATCHED", label: "Dispatched" },
  { status: "COMPLETED", label: "Completed" },
  { status: "CANCELLED", label: "Cancelled" },
];

const STATUS_ORDER: TripStatus[] = [
  "DRAFT",
  "DISPATCHED",
  "COMPLETED",
  "CANCELLED",
];

function stepColor(
  step: TripStatus,
  currentStatus: TripStatus,
): "green" | "blue" | "gray" | "red" {
  if (currentStatus === "CANCELLED") {
    return step === "CANCELLED" ? "red" : "gray";
  }

  if (currentStatus === "COMPLETED") {
    const stepIndex = STATUS_ORDER.indexOf(step);
    const completedIndex = STATUS_ORDER.indexOf("COMPLETED");
    return stepIndex <= completedIndex ? "green" : "gray";
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const stepIndex = STATUS_ORDER.indexOf(step);

  if (stepIndex < currentIndex) {
    return "green";
  }

  if (stepIndex === currentIndex) {
    return currentStatus === "DISPATCHED" ? "blue" : "green";
  }

  return "gray";
}

interface TripLifecycleStripProps {
  status: TripStatus;
}

export function TripLifecycleStrip({ status }: TripLifecycleStripProps) {
  return (
    <HStack gap="0" w="full" justify="space-between">
      {LIFECYCLE_STEPS.map((step, index) => {
        const color = stepColor(step.status, status);
        const palette =
          color === "green"
            ? "green.400"
            : color === "blue"
              ? "blue.400"
              : color === "red"
                ? "red.400"
                : "gray.600";

        return (
          <Flex key={step.status} align="center" flex="1" minW="0">
            <HStack gap="2" minW="0">
              <Circle size="2.5" bg={palette} flexShrink={0} />
              <Text
                fontSize="xs"
                fontWeight={color !== "gray" ? "semibold" : "normal"}
                color={color !== "gray" ? "gray.100" : "gray.500"}
                truncate
              >
                {step.label}
              </Text>
            </HStack>
            {index < LIFECYCLE_STEPS.length - 1 && (
              <Box flex="1" h="1px" bg="gray.700" mx="2" minW="2" />
            )}
          </Flex>
        );
      })}
    </HStack>
  );
}
