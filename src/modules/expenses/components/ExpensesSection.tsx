"use client";

import { Box, Card, Table, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPaiseAsRupees } from "@/lib/utils/format";
import type { ExpenseListItem } from "../expense.types";

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

interface ExpensesSectionProps {
  expenses: ExpenseListItem[];
  isLoading: boolean;
}

export function ExpensesSection({
  expenses,
  isLoading,
}: ExpensesSectionProps) {
  return (
    <Card.Root
      variant="outline"
      bg="gray.900"
      borderColor="gray.700"
      overflow="hidden"
      borderRadius="lg"
    >
      <Card.Body gap="4" p="0">
        <Box px="5" pt="5">
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            color="gray.400"
          >
            OTHER EXPENSES
          </Text>
        </Box>

        {isLoading ? (
          <LoadingState message="Loading expenses..." />
        ) : expenses.length === 0 ? (
          <EmptyState
            title="No expenses"
            description="Add tolls, parking, repairs, and other operating costs."
          />
        ) : (
          <Table.ScrollArea bg="gray.900">
            <Table.Root size="sm" variant="line" bg="gray.900" color="gray.100">
              <Table.Header>
                <Table.Row bg="gray.900" borderColor="gray.700">
                  <Table.ColumnHeader {...headerCellStyles}>
                    TYPE
                  </Table.ColumnHeader>
                  <Table.ColumnHeader {...headerCellStyles}>
                    VEHICLE
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    {...headerCellStyles}
                    display={{ base: "none", md: "table-cell" }}
                  >
                    TRIP
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    {...headerCellStyles}
                    display={{ base: "none", sm: "table-cell" }}
                  >
                    DESCRIPTION
                  </Table.ColumnHeader>
                  <Table.ColumnHeader {...headerCellStyles}>
                    DATE
                  </Table.ColumnHeader>
                  <Table.ColumnHeader {...headerCellStyles}>
                    AMOUNT
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {expenses.map((expense) => (
                  <Table.Row key={expense.id} bg="gray.900" borderColor="gray.800">
                    <Table.Cell bg="gray.900">
                      <StatusBadge status={expense.type} />
                    </Table.Cell>
                    <Table.Cell bg="gray.900">
                      <Text fontSize="sm" fontWeight="semibold" color="white">
                        {expense.vehicle.registrationNumber}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {expense.vehicle.name}
                      </Text>
                    </Table.Cell>
                    <Table.Cell bg="gray.900" display={{ base: "none", md: "table-cell" }}>
                      <Text fontSize="sm" color="gray.200" fontFamily="mono">
                        {expense.trip?.tripCode ?? "—"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell bg="gray.900" display={{ base: "none", sm: "table-cell" }}>
                      <Text fontSize="sm" color="gray.200" lineClamp={2}>
                        {expense.description}
                      </Text>
                    </Table.Cell>
                    <Table.Cell bg="gray.900">
                      <Text fontSize="sm" color="gray.200">
                        {formatDate(expense.incurredAt)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell bg="gray.900">
                      <Text fontSize="sm" color="gray.200">
                        {formatPaiseAsRupees(expense.amountPaise)}
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
