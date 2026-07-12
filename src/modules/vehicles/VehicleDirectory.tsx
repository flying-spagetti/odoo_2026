"use client";

import {
  Button,
  Flex,
  FormatNumber,
  HStack,
  IconButton,
  Input,
  InputGroup,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuEllipsis, LuPlus, LuSearch } from "react-icons/lu";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_VEHICLES } from "@/lib/mock-data/vehicles";
import { VEHICLE_STATUSES } from "@/types/status";
import type { Vehicle, VehicleType } from "@/types/vehicle";
import { VEHICLE_TYPE_LABELS } from "@/types/vehicle";

interface VehicleDirectoryProps {
  vehicles?: Vehicle[];
  isLoading?: boolean;
}

const VEHICLE_TYPES = Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[];

export function VehicleDirectory({
  vehicles = MOCK_VEHICLES,
  isLoading = false,
}: VehicleDirectoryProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !query ||
        vehicle.registrationNumber.toLowerCase().includes(query) ||
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || vehicle.status === statusFilter;

      const matchesType = typeFilter === "ALL" || vehicle.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [vehicles, search, statusFilter, typeFilter]);

  const columns: DataTableColumn<Vehicle>[] = [
    {
      key: "registration",
      header: "Registration Number",
      render: (vehicle) => (
        <Text fontWeight="medium" fontSize="sm">
          {vehicle.registrationNumber}
        </Text>
      ),
    },
    {
      key: "vehicle",
      header: "Vehicle",
      render: (vehicle) => (
        <Text fontSize="sm">
          {vehicle.make} {vehicle.model}
        </Text>
      ),
    },
    {
      key: "type",
      header: "Type",
      hideBelow: "sm",
      render: (vehicle) => (
        <Text fontSize="sm">{VEHICLE_TYPE_LABELS[vehicle.type]}</Text>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      hideBelow: "md",
      render: (vehicle) => (
        <Text fontSize="sm">
          <FormatNumber value={vehicle.capacityKg} /> kg
        </Text>
      ),
    },
    {
      key: "odometer",
      header: "Odometer",
      hideBelow: "md",
      render: (vehicle) => (
        <Text fontSize="sm">
          <FormatNumber value={vehicle.odometerKm} /> km
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (vehicle) => <StatusBadge status={vehicle.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <IconButton
          aria-label="Vehicle actions"
          variant="ghost"
          size="xs"
        >
          <LuEllipsis />
        </IconButton>
      ),
    },
  ];

  return (
    <Flex direction="column" gap="4">
      <Flex
        direction={{ base: "column", md: "row" }}
        gap="3"
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
      >
        <HStack gap="3" flex="1" flexWrap="wrap">
          <InputGroup
            maxW={{ base: "full", md: "xs" }}
            startElement={<LuSearch />}
          >
            <Input
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="sm"
            />
          </InputGroup>
          <NativeSelect.Root size="sm" width={{ base: "full", sm: "160px" }}>
            <NativeSelect.Field
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="ALL">All statuses</option>
              {VEHICLE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <NativeSelect.Root size="sm" width={{ base: "full", sm: "160px" }}>
            <NativeSelect.Field
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by vehicle type"
            >
              <option value="ALL">All types</option>
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {VEHICLE_TYPE_LABELS[type]}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>
        <Button size="sm" colorPalette="blue" flexShrink={0}>
          <LuPlus />
          Register Vehicle
        </Button>
      </Flex>

      <DataTable
        columns={columns}
        data={filteredVehicles}
        isLoading={isLoading}
        loadingMessage="Loading vehicles..."
        emptyTitle="No vehicles found"
        emptyDescription="Try adjusting your search or filters, or register a new vehicle."
        getRowKey={(vehicle) => vehicle.id}
      />
    </Flex>
  );
}
