"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { LuCircleCheck, LuCircleX } from "react-icons/lu";
import { Icon } from "@chakra-ui/react";
import type { DispatchReadiness } from "../trip.types";

interface DispatchReadinessPanelProps {
  readiness: DispatchReadiness | null;
  isLoading?: boolean;
}

export function DispatchReadinessPanel({
  readiness,
  isLoading = false,
}: DispatchReadinessPanelProps) {
  if (isLoading) {
    return (
      <Box borderWidth="1px" borderColor="gray.700" borderRadius="md" p="4">
        <Text fontSize="sm" color="gray.400">
          Evaluating dispatch readiness...
        </Text>
      </Box>
    );
  }

  if (!readiness) {
    return null;
  }

  return (
    <VStack align="stretch" gap="2">
      <Text
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="wider"
        color="gray.400"
        textTransform="uppercase"
      >
        Dispatch readiness
      </Text>
      <Box
        borderWidth="1px"
        borderColor={readiness.ready ? "green.700" : "red.700"}
        borderRadius="md"
        bg={readiness.ready ? "green.950" : "red.950"}
        p="3"
      >
        <VStack align="stretch" gap="2">
          {readiness.checks.map((check) => (
            <HStack key={check.code} align="flex-start" gap="2">
              <Icon
                as={check.passed ? LuCircleCheck : LuCircleX}
                boxSize="4"
                color={check.passed ? "green.400" : "red.400"}
                mt="0.5"
                flexShrink={0}
              />
              <Box minW="0">
                <Text fontSize="sm" color="gray.100">
                  {check.label}
                </Text>
                {!check.passed && check.reason && (
                  <Text fontSize="xs" color="red.300" mt="0.5">
                    {check.reason}
                  </Text>
                )}
              </Box>
            </HStack>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
