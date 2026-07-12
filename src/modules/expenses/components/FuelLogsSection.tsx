"use client";

import { Box, Card, Table, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { formatOdometer, formatPaiseAsRupees } from "@/lib/utils/format";
import type { FuelLogListItem } from "../expense.types";

const headerCellStyles = {
  bg: "gray.900",
  color: "gray.300",
  fontSize: "xs",
  fontWeight: "semibold" as const,
  letterSpacing: "wider",
};

function formatDate(value: string): string {
  try {
    return format(parseISO(value), "dd MMM yyyy");
  } catch {
    return "—";
  }
}

interface FuelLogsSectionProps {
  fuelLogs: FuelLogListItem[];
  isLoading: boolean;
  actions?: React.ReactNode;
}

export function FuelLogsSection({
  fuelLogs,
  isLoading,
  actions,
}: FuelLogsSectionProps) {
  return (
    <Card.Root
      variant="outline"
      bg="gray.900"
      borderColor="gray.700"
      overflow="hidden"
      borderRadius="lg"
    >
      <Card.Body gap="4" p="0">
        <Box
          px="5"
          pt="5"
          display="flex"
          alignItems={{ base: "stretch", sm: "center" }}
          justifyContent="space-between"
          gap="3"
          flexDirection={{ base: "column", sm: "row" }}
        >
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            color="gray.400"
          >
            FUEL LOGS
          </Text>
          {actions}
        </Box>

        {isLoading ? (
          <LoadingState message="Loading fuel logs..." />
        ) : fuelLogs.length === 0 ? (
          <EmptyState
            title="No fuel logs"
            description="Log fuel purchases to track fleet fuel expenditure."
          />
        ) : (
          <Table.ScrollArea bg="gray.900">
            <Table.Root size="sm" variant="line" bg="gray.900" color="gray.100">
              <Table.Header>
                <Table.Row bg="gray.900" borderColor="gray.700">
                  <Table.ColumnHeader {...headerCellStyles}>
                    VEHICLE
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    {...headerCellStyles}
                    display={{ base: "none", md: "table-cell" }}
                  >
                    TRIP
                  </Table.ColumnHeader>
                  <Table.ColumnHeader {...headerCellStyles}>
                    DATE
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    {...headerCellStyles}
                    display={{ base: "none", sm: "table-cell" }}
                  >
                    LITRES
                  </Table.ColumnHeader>
                  <Table.ColumnHeader {...headerCellStyles}>
                    FUEL COST
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    {...headerCellStyles}
                    display={{ base: "none", lg: "table-cell" }}
                  >
                    ODOMETER
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {fuelLogs.map((log) => (
                  <Table.Row key={log.id} bg="gray.900" borderColor="gray.800">
                    <Table.Cell bg="gray.900">
                      <Text fontSize="sm" fontWeight="semibold" color="white">
                        {log.vehicle.registrationNumber}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {log.vehicle.name}
                      </Text>
                    </Table.Cell>
                    <Table.Cell bg="gray.900" display={{ base: "none", md: "table-cell" }}>
                      <Text fontSize="sm" color="gray.200" fontFamily="mono">
                        {log.trip?.tripCode ?? "—"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell bg="gray.900">
                      <Text fontSize="sm" color="gray.200">
                        {formatDate(log.loggedAt)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell bg="gray.900" display={{ base: "none", sm: "table-cell" }}>
                      <Text fontSize="sm" color="gray.200">
                        {log.liters} L
                      </Text>
                    </Table.Cell>
                    <Table.Cell bg="gray.900">
                      <Text fontSize="sm" color="gray.200">
                        {formatPaiseAsRupees(log.costPaise)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell bg="gray.900" display={{ base: "none", lg: "table-cell" }}>
                      <Text fontSize="sm" color="gray.200">
                        {formatOdometer(log.odometerKm)} km
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
      </Card.Body>
    </Card.Root>
  );
}
