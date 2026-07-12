"use client";

import { Box, Card, Flex, Text, VStack } from "@chakra-ui/react";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { TripBoardItem } from "../trip.types";

interface LiveTripBoardProps {
  trips: TripBoardItem[];
  selectedTripId: string | null;
  isLoading: boolean;
  onSelectTrip: (tripId: string) => void;
}

export function LiveTripBoard({
  trips,
  selectedTripId,
  isLoading,
  onSelectTrip,
}: LiveTripBoardProps) {
  if (isLoading) {
    return <LoadingState message="Loading live board..." />;
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        title="No trips on the board"
        description="Operational trips will appear here once they are created in the database."
      />
    );
  }

  return (
    <VStack align="stretch" gap="3">
      <Text
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="wider"
        color="gray.400"
        textTransform="uppercase"
      >
        Live board
      </Text>
      {trips.map((trip) => {
        const isSelected = trip.id === selectedTripId;

        return (
          <Card.Root
            key={trip.id}
            variant="outline"
            bg={isSelected ? "gray.800" : "gray.900"}
            borderColor={isSelected ? "blue.600" : "gray.700"}
            borderWidth={isSelected ? "2px" : "1px"}
            cursor="pointer"
            onClick={() => onSelectTrip(trip.id)}
            _hover={{ borderColor: isSelected ? "blue.500" : "gray.600" }}
          >
            <Card.Body gap="2" py="3" px="4">
              <Flex justify="space-between" align="center" gap="3">
                <Text fontSize="sm" fontWeight="semibold" color="gray.100">
                  {trip.tripCode}
                </Text>
                <StatusBadge status={trip.status} />
              </Flex>
              <Text fontSize="sm" color="gray.300" truncate>
                {trip.source} → {trip.destination}
              </Text>
              <Flex justify="space-between" align="center" gap="3" wrap="wrap">
                <Text fontSize="xs" color="gray.500">
                  {trip.vehicle.name} / {trip.driver.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {trip.boardNote}
                </Text>
              </Flex>
            </Card.Body>
          </Card.Root>
        );
      })}
      <Box pt="2">
        <Text fontSize="xs" color="gray.600">
          On complete: odometer → fuel log → expenses → vehicle &amp; driver
          available
        </Text>
      </Box>
    </VStack>
  );
}
