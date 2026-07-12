"use client";

import {
  Button,
  Card,
  Flex,
  HStack,
  Input,
  NativeSelect,
  Table,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatIndianCurrency, formatOdometer } from "@/lib/utils/format";
import { VEHICLE_STATUSES } from "@/types/status";
import { VEHICLE_TYPE_LABELS } from "@/types/vehicle";
import type { VehicleListItem } from "./vehicle.types";

const VEHICLE_TYPE_FILTERS = ["All", ...Object.values(VEHICLE_TYPE_LABELS)] as const;

interface VehicleDirectoryProps {
  vehicles: VehicleListItem[];
  isLoading?: boolean;
  errorMessage?: string | null;
  canMutate?: boolean;
  onRetry?: () => void;
  onAddVehicle?: () => void;
}

export function VehicleDirectory({
  vehicles,
  isLoading = false,
  errorMessage = null,
  canMutate = false,
  onRetry,
  onAddVehicle,
}: VehicleDirectoryProps) {
  const [registrationSearch, setRegistrationSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredVehicles = useMemo(() => {
    const query = registrationSearch.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesRegistration =
        !query || vehicle.registrationNumber.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || vehicle.status === statusFilter;

      const matchesType =
        typeFilter === "All" || vehicle.typeLabel === typeFilter;

      return matchesRegistration && matchesStatus && matchesType;
    });
  }, [vehicles, registrationSearch, statusFilter, typeFilter]);

  if (errorMessage && vehicles.length === 0 && !isLoading) {
    return (
      <ErrorState
        title="Unable to load vehicles"
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  return (
    <Flex direction="column" gap="5">
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap="3"
        align={{ base: "stretch", lg: "center" }}
        justify="space-between"
      >
        <HStack gap="3" flex="1" flexWrap="wrap">
          <NativeSelect.Root size="sm" width={{ base: "full", sm: "150px" }}>
            <NativeSelect.Field
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by vehicle type"
              bg="gray.800"
              borderColor="gray.700"
              color="gray.100"
            >
              {VEHICLE_TYPE_FILTERS.map((type) => (
                <option key={type} value={type}>
                  Type: {type}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator color="gray.400" />
          </NativeSelect.Root>

          <NativeSelect.Root size="sm" width={{ base: "full", sm: "150px" }}>
            <NativeSelect.Field
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              bg="gray.800"
              borderColor="gray.700"
              color="gray.100"
            >
              <option value="ALL">Status: All</option>
              {VEHICLE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  Status: {status.replace(/_/g, " ")}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator color="gray.400" />
          </NativeSelect.Root>

          <Input
            placeholder="Search reg. no..."
            value={registrationSearch}
            onChange={(event) => setRegistrationSearch(event.target.value)}
            size="sm"
            maxW={{ base: "full", md: "220px" }}
            bg="gray.800"
            borderColor="gray.700"
            color="gray.100"
            _placeholder={{ color: "gray.500" }}
          />
        </HStack>

        <Button
          size="sm"
          colorPalette="blue"
          flexShrink={0}
          alignSelf={{ base: "stretch", lg: "auto" }}
          disabled={!canMutate}
          onClick={onAddVehicle}
        >
          <LuPlus />
          Add Vehicle
        </Button>
      </Flex>

      {!canMutate && (
        <Text fontSize="xs" color="gray.500">
          Adding vehicles requires Fleet Manager role.
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
            <LoadingState message="Loading vehicles..." />
          ) : filteredVehicles.length === 0 ? (
            <EmptyState
              title="No vehicles found"
              description={
                canMutate
                  ? "Try adjusting your filters or add a new vehicle to the registry."
                  : "Try adjusting your filters."
              }
              actionLabel={canMutate ? "Add Vehicle" : undefined}
              onAction={canMutate ? onAddVehicle : undefined}
            />
          ) : (
            <Table.ScrollArea bg="gray.900">
              <Table.Root size="sm" variant="line" bg="gray.900" color="gray.100">
                <Table.Header>
                  <Table.Row bg="gray.900" borderColor="gray.700">
                    <Table.ColumnHeader
                      bg="gray.900"
                      color="gray.300"
                      fontSize="xs"
                      fontWeight="semibold"
                      letterSpacing="wider"
                    >
                      REG. NO. (UNIQUE)
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      bg="gray.900"
                      color="gray.300"
                      fontSize="xs"
                      fontWeight="semibold"
                      letterSpacing="wider"
                      display={{ base: "none", sm: "table-cell" }}
                    >
                      NAME/MODEL
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      bg="gray.900"
                      color="gray.300"
                      fontSize="xs"
                      fontWeight="semibold"
                      letterSpacing="wider"
                      display={{ base: "none", md: "table-cell" }}
                    >
                      TYPE
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      bg="gray.900"
                      color="gray.300"
                      fontSize="xs"
                      fontWeight="semibold"
                      letterSpacing="wider"
                      display={{ base: "none", md: "table-cell" }}
                    >
                      CAPACITY
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      bg="gray.900"
                      color="gray.300"
                      fontSize="xs"
                      fontWeight="semibold"
                      letterSpacing="wider"
                      display={{ base: "none", lg: "table-cell" }}
                    >
                      ODOMETER
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      bg="gray.900"
                      color="gray.300"
                      fontSize="xs"
                      fontWeight="semibold"
                      letterSpacing="wider"
                      display={{ base: "none", lg: "table-cell" }}
                    >
                      ACQ. COST
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      bg="gray.900"
                      color="gray.300"
                      fontSize="xs"
                      fontWeight="semibold"
                      letterSpacing="wider"
                    >
                      STATUS
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredVehicles.map((vehicle) => (
                    <Table.Row
                      key={vehicle.id}
                      bg="gray.900"
                      borderColor="gray.800"
                    >
                      <Table.Cell bg="gray.900">
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="white"
                          fontFamily="mono"
                        >
                          {vehicle.registrationNumber}
                        </Text>
                      </Table.Cell>
                      <Table.Cell
                        bg="gray.900"
                        display={{ base: "none", sm: "table-cell" }}
                      >
                        <Text fontSize="sm" color="gray.100">
                          {vehicle.name}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          {vehicle.model}
                        </Text>
                      </Table.Cell>
                      <Table.Cell
                        bg="gray.900"
                        display={{ base: "none", md: "table-cell" }}
                      >
                        <Text fontSize="sm" color="gray.200">
                          {vehicle.typeLabel}
                        </Text>
                      </Table.Cell>
                      <Table.Cell
                        bg="gray.900"
                        display={{ base: "none", md: "table-cell" }}
                      >
                        <Text fontSize="sm" color="gray.200">
                          {vehicle.capacityLabel}
                        </Text>
                      </Table.Cell>
                      <Table.Cell
                        bg="gray.900"
                        display={{ base: "none", lg: "table-cell" }}
                      >
                        <Text fontSize="sm" color="gray.200">
                          {formatOdometer(vehicle.odometerKm)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell
                        bg="gray.900"
                        display={{ base: "none", lg: "table-cell" }}
                      >
                        <Text fontSize="sm" color="gray.200">
                          ₹{formatIndianCurrency(vehicle.acquisitionCost)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell bg="gray.900">
                        <StatusBadge status={vehicle.status} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          )}
        </Card.Body>
      </Card.Root>

      <Text fontSize="xs" color="gray.500">
        Registration numbers must be unique. Retired and In Shop vehicles are
        excluded from Trip Dispatcher.
      </Text>
    </Flex>
  );
}
