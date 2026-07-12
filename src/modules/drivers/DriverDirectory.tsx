"use client";

import {
  Badge,
  Button,
  Flex,
  FormatNumber,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { format, isPast, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { LuEllipsis, LuPlus, LuSearch, LuTriangleAlert } from "react-icons/lu";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_DRIVERS } from "@/lib/mock-data/drivers";
import { DRIVER_STATUSES } from "@/types/status";
import type { Driver } from "@/types/driver";

interface DriverDirectoryProps {
  drivers?: Driver[];
  isLoading?: boolean;
}

function LicenceExpiryCell({ expiry }: { expiry: string }) {
  const expiryDate = parseISO(expiry);
  const expired = isPast(expiryDate);

  return (
    <HStack gap="2">
      <Text fontSize="sm">{format(expiryDate, "dd MMM yyyy")}</Text>
      {expired && (
        <Badge colorPalette="red" variant="subtle" size="sm">
          <Icon as={LuTriangleAlert} boxSize="3" mr="1" />
          Expired
        </Badge>
      )}
    </HStack>
  );
}

export function DriverDirectory({
  drivers = MOCK_DRIVERS,
  isLoading = false,
}: DriverDirectoryProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return drivers.filter((driver) => {
      const matchesSearch =
        !query ||
        driver.name.toLowerCase().includes(query) ||
        driver.licenceNumber.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || driver.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [drivers, search, statusFilter]);

  const columns: DataTableColumn<Driver>[] = [
    {
      key: "driver",
      header: "Driver",
      render: (driver) => (
        <Text fontWeight="medium" fontSize="sm">
          {driver.name}
        </Text>
      ),
    },
    {
      key: "licenceNumber",
      header: "Licence Number",
      hideBelow: "sm",
      render: (driver) => (
        <Text fontSize="sm" fontFamily="mono">
          {driver.licenceNumber}
        </Text>
      ),
    },
    {
      key: "licenceCategory",
      header: "Licence Category",
      hideBelow: "md",
      render: (driver) => <Text fontSize="sm">{driver.licenceCategory}</Text>,
    },
    {
      key: "licenceExpiry",
      header: "Licence Expiry",
      render: (driver) => <LicenceExpiryCell expiry={driver.licenceExpiry} />,
    },
    {
      key: "safetyScore",
      header: "Safety Score",
      hideBelow: "md",
      render: (driver) => (
        <Text fontSize="sm">
          <FormatNumber value={driver.safetyScore} />
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (driver) => <StatusBadge status={driver.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <IconButton aria-label="Driver actions" variant="ghost" size="xs">
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
              placeholder="Search drivers..."
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
              {DRIVER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>
        <Button size="sm" colorPalette="blue" flexShrink={0}>
          <LuPlus />
          Add Driver
        </Button>
      </Flex>

      <DataTable
        columns={columns}
        data={filteredDrivers}
        isLoading={isLoading}
        loadingMessage="Loading drivers..."
        emptyTitle="No drivers found"
        emptyDescription="Try adjusting your search or filters, or add a new driver."
        getRowKey={(driver) => driver.id}
      />
    </Flex>
  );
}
