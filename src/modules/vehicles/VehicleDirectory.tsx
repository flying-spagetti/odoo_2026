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
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_VEHICLES } from "@/lib/mock-data/vehicles";
import { formatIndianCurrency, formatOdometer } from "@/lib/utils/format";
import { VEHICLE_STATUSES } from "@/types/status";
import type { Vehicle } from "@/types/vehicle";
import { VEHICLE_REGISTRY_TYPE_FILTERS } from "@/types/vehicle";

interface VehicleDirectoryProps {
  vehicles?: Vehicle[];
  isLoading?: boolean;
}

export function VehicleDirectory({
  vehicles = MOCK_VEHICLES,
  isLoading = false,
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
              {VEHICLE_REGISTRY_TYPE_FILTERS.map((type) => (
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
          colorPalette="orange"
          flexShrink={0}
          alignSelf={{ base: "stretch", lg: "auto" }}
        >
          <LuPlus />
          Add Vehicle
        </Button>
      </Flex>

      <Card.Root
        variant="outline"
        bg="gray.900"
        borderColor="gray.700"
        overflow="hidden"
      >
        <Card.Body p="0">
          {isLoading ? (
            <LoadingState message="Loading vehicles..." />
          ) : filteredVehicles.length === 0 ? (
            <EmptyState
              title="No vehicles found"
              description="Try adjusting your filters or add a new vehicle to the registry."
            />
          ) : (
            <Table.ScrollArea>
              <Table.Root size="sm" variant="line">
                <Table.Header>
                  <Table.Row borderColor="gray.700">
                    <Table.ColumnHeader color="gray.400" fontSize="xs" letterSpacing="wider">
                      REG. NO. (UNIQUE)
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      color="gray.400"
                      fontSize="xs"
                      letterSpacing="wider"
                      display={{ base: "none", sm: "table-cell" }}
                    >
                      NAME/MODEL
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      color="gray.400"
                      fontSize="xs"
                      letterSpacing="wider"
                      display={{ base: "none", md: "table-cell" }}
                    >
                      TYPE
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      color="gray.400"
                      fontSize="xs"
                      letterSpacing="wider"
                      display={{ base: "none", md: "table-cell" }}
                    >
                      CAPACITY
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      color="gray.400"
                      fontSize="xs"
                      letterSpacing="wider"
                      display={{ base: "none", lg: "table-cell" }}
                    >
                      ODOMETER
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      color="gray.400"
                      fontSize="xs"
                      letterSpacing="wider"
                      display={{ base: "none", lg: "table-cell" }}
                    >
                      ACQ. COST
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.400" fontSize="xs" letterSpacing="wider">
                      STATUS
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredVehicles.map((vehicle) => (
                    <Table.Row key={vehicle.id} borderColor="gray.800">
                      <Table.Cell>
                        <Text fontSize="sm" fontWeight="medium" color="gray.100" fontFamily="mono">
                          {vehicle.registrationNumber}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", sm: "table-cell" }}>
                        <Text fontSize="sm" color="gray.200">
                          {vehicle.name}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", md: "table-cell" }}>
                        <Text fontSize="sm" color="gray.300">
                          {vehicle.typeLabel}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", md: "table-cell" }}>
                        <Text fontSize="sm" color="gray.300">
                          {vehicle.capacityLabel}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", lg: "table-cell" }}>
                        <Text fontSize="sm" color="gray.300">
                          {formatOdometer(vehicle.odometerKm)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", lg: "table-cell" }}>
                        <Text fontSize="sm" color="gray.300">
                          {formatIndianCurrency(vehicle.acquisitionCost)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
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

      <Text fontSize="sm" color="orange.400">
        Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden
        from Trip Dispatcher
      </Text>
    </Flex>
  );
}
