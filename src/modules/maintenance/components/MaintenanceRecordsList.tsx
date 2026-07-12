"use client";

import {
  Box,
  Button,
  Card,
  Flex,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPaiseAsRupees } from "@/lib/utils/format";
import type { MaintenanceListItem } from "../maintenance.types";
import type { MaintenanceConfirmAction } from "./MaintenanceConfirmDialog";

const headerCellStyles = {
  color: "gray.400",
  fontSize: "xs",
  letterSpacing: "wider",
};

function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  try {
    return format(parseISO(value), "dd MMM yyyy");
  } catch {
    return "—";
  }
}

interface MaintenanceRecordsListProps {
  records: MaintenanceListItem[];
  isLoading: boolean;
  canMutate: boolean;
  isMutating: boolean;
  pendingRecordId: string | null;
  onLifecycleAction: (
    record: MaintenanceListItem,
    action: MaintenanceConfirmAction,
  ) => void;
}

function RecordActions({
  record,
  canMutate,
  isMutating,
  pendingRecordId,
  onLifecycleAction,
}: {
  record: MaintenanceListItem;
  canMutate: boolean;
  isMutating: boolean;
  pendingRecordId: string | null;
  onLifecycleAction: (
    record: MaintenanceListItem,
    action: MaintenanceConfirmAction,
  ) => void;
}) {
  if (!canMutate) {
    return (
      <Text fontSize="xs" color="gray.500">
        View only
      </Text>
    );
  }

  if (record.status === "OPEN") {
    return (
      <Button
        size="xs"
        colorPalette="orange"
        loading={pendingRecordId === record.id && isMutating}
        disabled={isMutating}
        onClick={() => onLifecycleAction(record, "start")}
      >
        Start Maintenance
      </Button>
    );
  }

  if (record.status === "IN_PROGRESS") {
    return (
      <Button
        size="xs"
        colorPalette="green"
        loading={pendingRecordId === record.id && isMutating}
        disabled={isMutating}
        onClick={() => onLifecycleAction(record, "close")}
      >
        Close Maintenance
      </Button>
    );
  }

  return (
    <Text fontSize="xs" color="gray.500">
      Read-only
    </Text>
  );
}

function MobileRecordCard({
  record,
  canMutate,
  isMutating,
  pendingRecordId,
  onLifecycleAction,
}: {
  record: MaintenanceListItem;
  canMutate: boolean;
  isMutating: boolean;
  pendingRecordId: string | null;
  onLifecycleAction: (
    record: MaintenanceListItem,
    action: MaintenanceConfirmAction,
  ) => void;
}) {
  return (
    <Card.Root variant="outline" bg="gray.900" borderColor="gray.700">
      <Card.Body gap="3" py="4" px="4">
        <Flex justify="space-between" align="start" gap="3">
          <Box minW="0">
            <Text fontSize="sm" fontWeight="semibold" color="gray.100">
              {record.vehicle.registrationNumber}
            </Text>
            <Text fontSize="xs" color="gray.500" truncate>
              {record.vehicle.name}
            </Text>
          </Box>
          <StatusBadge status={record.status} />
        </Flex>

        <Text fontSize="sm" color="gray.200">
          {record.title}
        </Text>

        <Flex gap="2" wrap="wrap">
          <StatusBadge status={record.priority} />
          <StatusBadge status={record.vehicle.status} />
        </Flex>

        {record.vehicle.status === "IN_SHOP" && (
          <Text fontSize="xs" color="orange.400">
            Unavailable for dispatch
          </Text>
        )}

        <Flex justify="space-between" gap="3" fontSize="xs" color="gray.500">
          <Text>Est. {formatPaiseAsRupees(record.estimatedCostPaise)}</Text>
          <Text>Act. {formatPaiseAsRupees(record.actualCostPaise)}</Text>
        </Flex>

        <Flex justify="space-between" gap="3" fontSize="xs" color="gray.500">
          <Text>Created {formatDateTime(record.createdAt)}</Text>
          <Text>Started {formatDateTime(record.startedAt)}</Text>
        </Flex>

        <Text fontSize="xs" color="gray.500">
          Completed {formatDateTime(record.completedAt)}
        </Text>

        <RecordActions
          record={record}
          canMutate={canMutate}
          isMutating={isMutating}
          pendingRecordId={pendingRecordId}
          onLifecycleAction={onLifecycleAction}
        />
      </Card.Body>
    </Card.Root>
  );
}

export function MaintenanceRecordsList({
  records,
  isLoading,
  canMutate,
  isMutating,
  pendingRecordId,
  onLifecycleAction,
}: MaintenanceRecordsListProps) {
  return (
    <Card.Root
      variant="outline"
      bg="gray.900"
      borderColor="gray.700"
      overflow="hidden"
    >
      <Card.Body gap="4" p="0">
        <Box px="5" pt="5" pb="0">
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            color="gray.400"
          >
            MAINTENANCE RECORDS
          </Text>
        </Box>

        {isLoading ? (
          <LoadingState message="Loading maintenance records..." />
        ) : records.length === 0 ? (
          <EmptyState
            title="No maintenance records"
            description="Create a maintenance record to place an eligible vehicle In Shop."
          />
        ) : (
          <>
            <VStack
              align="stretch"
              gap="3"
              px="4"
              pb="4"
              display={{ base: "flex", lg: "none" }}
            >
              {records.map((record) => (
                <MobileRecordCard
                  key={record.id}
                  record={record}
                  canMutate={canMutate}
                  isMutating={isMutating}
                  pendingRecordId={pendingRecordId}
                  onLifecycleAction={onLifecycleAction}
                />
              ))}
            </VStack>

            <Table.ScrollArea display={{ base: "none", lg: "block" }}>
              <Table.Root size="sm" variant="line">
                <Table.Header>
                  <Table.Row borderColor="gray.700">
                    <Table.ColumnHeader {...headerCellStyles}>
                      VEHICLE
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      TITLE
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      PRIORITY
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      STATUS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      EST. COST
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      ACTUAL
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      CREATED
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      STARTED
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      COMPLETED
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>
                      ACTIONS
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {records.map((record) => (
                    <Table.Row key={record.id} borderColor="gray.800">
                      <Table.Cell>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.100"
                        >
                          {record.vehicle.registrationNumber}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {record.vehicle.name}
                        </Text>
                        <Flex mt="1" gap="2" align="center" wrap="wrap">
                          <StatusBadge status={record.vehicle.status} />
                          {record.vehicle.status === "IN_SHOP" && (
                            <Text fontSize="xs" color="orange.400">
                              Unavailable for dispatch
                            </Text>
                          )}
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.300">
                          {record.title}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge status={record.priority} />
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge status={record.status} />
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.300">
                          {formatPaiseAsRupees(record.estimatedCostPaise)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.300">
                          {formatPaiseAsRupees(record.actualCostPaise)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.400">
                          {formatDateTime(record.createdAt)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.400">
                          {formatDateTime(record.startedAt)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.400">
                          {formatDateTime(record.completedAt)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <RecordActions
                          record={record}
                          canMutate={canMutate}
                          isMutating={isMutating}
                          pendingRecordId={pendingRecordId}
                          onLifecycleAction={onLifecycleAction}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </>
        )}
      </Card.Body>
    </Card.Root>
  );
}
