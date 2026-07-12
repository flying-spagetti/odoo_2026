"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Field,
  Grid,
  HStack,
  Input,
  NativeSelect,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  MOCK_MAINTENANCE_VEHICLES,
  MOCK_SERVICE_LOGS,
} from "@/lib/mock-data/maintenance";
import { formatIndianCurrency } from "@/lib/utils/format";
import type {
  ServiceLog,
  ServiceLogFormValues,
  ServiceLogStatus,
} from "@/types/maintenance";
import { SERVICE_FORM_STATUS_OPTIONS } from "@/types/maintenance";

interface MaintenanceContentProps {
  serviceLogs?: ServiceLog[];
  isLoading?: boolean;
}

const inputStyles = {
  bg: "gray.800",
  borderColor: "gray.700",
  color: "gray.100",
  _placeholder: { color: "gray.500" },
};

const labelStyles = {
  color: "gray.400",
  fontSize: "xs",
  letterSpacing: "wider",
};

function getDefaultFormValues(): ServiceLogFormValues {
  return {
    vehicleName: "VAN-05",
    serviceType: "Oil Change",
    cost: "2500",
    date: "2026-07-07",
    status: "ACTIVE",
  };
}

function mapFormStatusToLogStatus(status: ServiceLogFormValues["status"]): ServiceLogStatus {
  return status === "COMPLETE" ? "COMPLETED" : "IN_SHOP";
}

export function MaintenanceContent({
  serviceLogs: initialLogs = MOCK_SERVICE_LOGS,
  isLoading = false,
}: MaintenanceContentProps) {
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>(initialLogs);
  const [formValues, setFormValues] = useState<ServiceLogFormValues>(getDefaultFormValues);
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = <K extends keyof ServiceLogFormValues>(
    field: K,
    value: ServiceLogFormValues[K],
  ) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const cost = Number(formValues.cost);
    if (!formValues.vehicleName || !formValues.serviceType || !formValues.date || Number.isNaN(cost)) {
      setIsSaving(false);
      return;
    }

    const newLog: ServiceLog = {
      id: `local-${Date.now()}`,
      vehicleName: formValues.vehicleName,
      serviceType: formValues.serviceType,
      cost,
      date: formValues.date,
      status: mapFormStatusToLogStatus(formValues.status),
    };

    setServiceLogs((current) => [newLog, ...current]);
    setFormValues(getDefaultFormValues());
    setIsSaving(false);
  };

  return (
    <Grid
      templateColumns={{ base: "1fr", xl: "minmax(320px, 380px) 1fr" }}
      gap={{ base: "6", xl: "8" }}
      alignItems="start"
    >
      <Card.Root variant="outline" bg="gray.900" borderColor="gray.700">
        <Card.Body gap="5">
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            color="gray.400"
          >
            LOG SERVICE RECORD
          </Text>

          <form onSubmit={handleSave}>
            <VStack align="stretch" gap="4">
              <Field.Root required>
                <Field.Label {...labelStyles}>VEHICLE</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={formValues.vehicleName}
                    onChange={(event) =>
                      handleFieldChange("vehicleName", event.target.value)
                    }
                    aria-label="Select vehicle"
                    {...inputStyles}
                  >
                    {MOCK_MAINTENANCE_VEHICLES.map((vehicle) => (
                      <option key={vehicle} value={vehicle}>
                        {vehicle}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator color="gray.400" />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root required>
                <Field.Label {...labelStyles}>SERVICE TYPE</Field.Label>
                <Input
                  value={formValues.serviceType}
                  onChange={(event) =>
                    handleFieldChange("serviceType", event.target.value)
                  }
                  placeholder="Oil Change"
                  {...inputStyles}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label {...labelStyles}>COST</Field.Label>
                <Input
                  type="number"
                  min="0"
                  value={formValues.cost}
                  onChange={(event) => handleFieldChange("cost", event.target.value)}
                  placeholder="2500"
                  {...inputStyles}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label {...labelStyles}>DATE</Field.Label>
                <Input
                  type="date"
                  value={formValues.date}
                  onChange={(event) => handleFieldChange("date", event.target.value)}
                  {...inputStyles}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label {...labelStyles}>STATUS</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={formValues.status}
                    onChange={(event) =>
                      handleFieldChange(
                        "status",
                        event.target.value as ServiceLogFormValues["status"],
                      )
                    }
                    aria-label="Select record status"
                    {...inputStyles}
                  >
                    {SERVICE_FORM_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator color="gray.400" />
                </NativeSelect.Root>
              </Field.Root>

              <Button
                type="submit"
                size="lg"
                colorPalette="orange"
                loading={isSaving}
                w="full"
                mt="2"
              >
                Save
              </Button>
            </VStack>
          </form>

          <VStack align="stretch" gap="3" pt="2">
            <HStack gap="2" fontSize="sm" color="gray.300" flexWrap="wrap">
              <Badge colorPalette="green" variant="subtle">
                Available
              </Badge>
              <LuArrowRight />
              <Badge colorPalette="orange" variant="subtle">
                In Shop
              </Badge>
              <Text fontSize="xs" color="gray.500">
                creating active record
              </Text>
            </HStack>

            <HStack gap="2" fontSize="sm" color="gray.300" flexWrap="wrap">
              <Badge colorPalette="orange" variant="subtle">
                In Shop
              </Badge>
              <LuArrowRight />
              <Badge colorPalette="green" variant="subtle">
                Available
              </Badge>
              <Text fontSize="xs" color="gray.500">
                closing record (set status to complete)
              </Text>
            </HStack>

            <Text fontSize="sm" color="orange.400">
              Note: In Shop vehicles are removed from the dispatch pool.
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>

      <Card.Root variant="outline" bg="gray.900" borderColor="gray.700" overflow="hidden">
        <Card.Body gap="4" p="0">
          <Box px="5" pt="5" pb="0">
            <Text
              fontSize="xs"
              fontWeight="semibold"
              letterSpacing="wider"
              color="gray.400"
            >
              SERVICE LOG
            </Text>
          </Box>

          {isLoading ? (
            <LoadingState message="Loading service records..." />
          ) : serviceLogs.length === 0 ? (
            <EmptyState
              title="No service records"
              description="Log a service record to start tracking maintenance activity."
            />
          ) : (
            <Table.ScrollArea>
              <Table.Root size="sm" variant="line">
                <Table.Header>
                  <Table.Row borderColor="gray.700">
                    <Table.ColumnHeader color="gray.400" fontSize="xs" letterSpacing="wider">
                      VEHICLE
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.400" fontSize="xs" letterSpacing="wider">
                      SERVICE
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      color="gray.400"
                      fontSize="xs"
                      letterSpacing="wider"
                      display={{ base: "none", sm: "table-cell" }}
                    >
                      COST
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.400" fontSize="xs" letterSpacing="wider">
                      STATUS
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {serviceLogs.map((log) => (
                    <Table.Row key={log.id} borderColor="gray.800">
                      <Table.Cell>
                        <Text fontSize="sm" fontWeight="medium" color="gray.100">
                          {log.vehicleName}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.300">
                          {log.serviceType}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", sm: "table-cell" }}>
                        <Text fontSize="sm" color="gray.300">
                          {formatIndianCurrency(log.cost)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge status={log.status} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          )}
        </Card.Body>
      </Card.Root>
    </Grid>
  );
}
