"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Icon,
  NativeSelect,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format, isPast, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { LuPlus, LuTriangleAlert } from "react-icons/lu";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DRIVER_STATUSES, getStatusConfig } from "@/types/status";
import type { DriverListItem } from "./driver.types";

const headerCellStyles = {
  bg: "gray.900",
  color: "gray.300",
  fontSize: "xs",
  fontWeight: "semibold" as const,
  letterSpacing: "wider",
};

function maskContactNumber(contactNumber: string): string {
  const digits = contactNumber.replace(/\D/g, "");

  if (digits.length < 5) {
    return contactNumber;
  }

  return `${digits.slice(0, 5)}${"x".repeat(5)}`;
}

function LicenceExpiryCell({ expiry }: { expiry: string }) {
  const expiryDate = parseISO(expiry);
  const expired = isPast(expiryDate);

  return (
    <HStack gap="2" flexWrap="wrap">
      <Text fontSize="sm" color="gray.200">
        {format(expiryDate, "MM/yyyy")}
      </Text>
      {expired && (
        <Badge colorPalette="red" variant="subtle" size="sm">
          <Icon as={LuTriangleAlert} boxSize="3" mr="1" />
          Expire
        </Badge>
      )}
    </HStack>
  );
}

interface DriverDirectoryProps {
  drivers: DriverListItem[];
  isLoading?: boolean;
  errorMessage?: string | null;
  canMutate?: boolean;
  onRetry?: () => void;
  onAddDriver?: () => void;
}

export function DriverDirectory({
  drivers,
  isLoading = false,
  errorMessage = null,
  canMutate = false,
  onRetry,
  onAddDriver,
}: DriverDirectoryProps) {
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      return statusFilter === "ALL" || driver.status === statusFilter;
    });
  }, [drivers, statusFilter]);

  if (errorMessage && drivers.length === 0 && !isLoading) {
    return (
      <ErrorState
        title="Unable to load drivers"
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  return (
    <Flex direction="column" gap="5">
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap="3"
        align={{ base: "stretch", sm: "center" }}
        justify="space-between"
      >
        <NativeSelect.Root size="sm" width={{ base: "full", sm: "180px" }}>
          <NativeSelect.Field
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            bg="gray.800"
            borderColor="gray.700"
            color="gray.100"
          >
            <option value="ALL">Status: All</option>
            {DRIVER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {getStatusConfig(status).label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator color="gray.400" />
        </NativeSelect.Root>

        <Button
          size="sm"
          colorPalette="blue"
          flexShrink={0}
          disabled={!canMutate}
          onClick={onAddDriver}
        >
          <LuPlus />
          Add Driver
        </Button>
      </Flex>

      {!canMutate && (
        <Text fontSize="xs" color="gray.500">
          Adding drivers requires Fleet Manager or Safety Officer role.
        </Text>
      )}

      <Card.Root
        variant="outline"
        bg="gray.900"
        borderColor="gray.700"
        overflow="hidden"
        borderRadius="lg"
      >
        <Card.Body p="0">
          {isLoading ? (
            <LoadingState message="Loading drivers..." />
          ) : filteredDrivers.length === 0 ? (
            <EmptyState
              title="No drivers found"
              description={
                canMutate
                  ? "Try adjusting the status filter, or add a new driver profile."
                  : "Try adjusting the status filter."
              }
              actionLabel={canMutate ? "Add Driver" : undefined}
              onAction={canMutate ? onAddDriver : undefined}
            />
          ) : (
            <Table.ScrollArea bg="gray.900">
              <Table.Root size="sm" variant="line" bg="gray.900" color="gray.100">
                <Table.Header>
                  <Table.Row bg="gray.900" borderColor="gray.700">
                    <Table.ColumnHeader {...headerCellStyles}>
                      DRIVER
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      LICENSE NO.
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      {...headerCellStyles}
                      display={{ base: "none", sm: "table-cell" }}
                    >
                      CATEGORY
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      EXPIRY
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      {...headerCellStyles}
                      display={{ base: "none", md: "table-cell" }}
                    >
                      CONTACT
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      {...headerCellStyles}
                      display={{ base: "none", md: "table-cell" }}
                    >
                      TRIP COMPL.
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      {...headerCellStyles}
                      display={{ base: "none", lg: "table-cell" }}
                    >
                      SAFETY
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      STATUS
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredDrivers.map((driver) => (
                    <Table.Row key={driver.id} bg="gray.900" borderColor="gray.800">
                      <Table.Cell bg="gray.900">
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="white"
                        >
                          {driver.name}
                        </Text>
                      </Table.Cell>
                      <Table.Cell bg="gray.900">
                        <Text
                          fontSize="sm"
                          color="gray.200"
                          fontFamily="mono"
                        >
                          {driver.licenseNumber}
                        </Text>
                      </Table.Cell>
                      <Table.Cell bg="gray.900" display={{ base: "none", sm: "table-cell" }}>
                        <Text fontSize="sm" color="gray.200">
                          {driver.licenseCategory}
                        </Text>
                      </Table.Cell>
                      <Table.Cell bg="gray.900">
                        <LicenceExpiryCell expiry={driver.licenseExpiryDate} />
                      </Table.Cell>
                      <Table.Cell bg="gray.900" display={{ base: "none", md: "table-cell" }}>
                        <Text fontSize="sm" color="gray.200" fontFamily="mono">
                          {maskContactNumber(driver.contactNumber)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell bg="gray.900" display={{ base: "none", md: "table-cell" }}>
                        <Text fontSize="sm" color="gray.200">
                          {driver.tripCompletionPercent === null
                            ? "—"
                            : `${driver.tripCompletionPercent}%`}
                        </Text>
                      </Table.Cell>
                      <Table.Cell bg="gray.900" display={{ base: "none", lg: "table-cell" }}>
                        <VStack align="start" gap="1">
                          <StatusBadge status={driver.safetyClearance} />
                          <Text fontSize="xs" color="gray.400">
                            Score {driver.safetyScore}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Auto from trips &amp; licence
                          </Text>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell bg="gray.900">
                        <StatusBadge status={driver.status} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          )}
        </Card.Body>
      </Card.Root>

      <VStack align="stretch" gap="3">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          letterSpacing="wider"
          color="gray.500"
        >
          TOGGLE STAT
        </Text>
        <HStack gap="2" flexWrap="wrap">
          <Button
            size="sm"
            variant={statusFilter === "ALL" ? "solid" : "outline"}
            colorPalette="gray"
            onClick={() => setStatusFilter("ALL")}
          >
            All
          </Button>
          {DRIVER_STATUSES.map((status) => {
            const config = getStatusConfig(status);
            return (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? "solid" : "outline"}
                colorPalette={config.colorPalette}
                onClick={() => setStatusFilter(status)}
              >
                {config.label}
              </Button>
            );
          })}
        </HStack>
      </VStack>

      <Box>
        <Text fontSize="xs" color="gray.500">
          Expired licence or Suspended status blocks trip assignment.
        </Text>
      </Box>
    </Flex>
  );
}
