"use client";

import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Separator,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { LuPlus } from "react-icons/lu";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  MOCK_EXPENSE_SUMMARY,
  MOCK_FUEL_LOGS,
  MOCK_TRIP_EXPENSES,
} from "@/lib/mock-data/expenses";
import { formatIndianCurrency } from "@/lib/utils/format";
import type { ExpenseSummary, FuelLog, TripExpense } from "@/types/expense";

interface ExpensesContentProps {
  fuelLogs?: FuelLog[];
  tripExpenses?: TripExpense[];
  summary?: ExpenseSummary;
  isLoading?: boolean;
}

const sectionTitleStyles = {
  fontSize: "xs",
  fontWeight: "semibold",
  letterSpacing: "wider",
  color: "gray.400",
};

const headerCellStyles = {
  color: "gray.400",
  fontSize: "xs",
  letterSpacing: "wider",
};

export function ExpensesContent({
  fuelLogs = MOCK_FUEL_LOGS,
  tripExpenses = MOCK_TRIP_EXPENSES,
  summary = MOCK_EXPENSE_SUMMARY,
  isLoading = false,
}: ExpensesContentProps) {
  if (isLoading) {
    return <LoadingState message="Loading fuel and expense records..." />;
  }

  return (
    <VStack align="stretch" gap="6">
      <Card.Root variant="outline" bg="gray.900" borderColor="gray.700" overflow="hidden">
        <Card.Body gap="4" p="0">
          <Flex
            align={{ base: "stretch", sm: "center" }}
            justify="space-between"
            gap="3"
            px="5"
            pt="5"
            direction={{ base: "column", sm: "row" }}
          >
            <Text {...sectionTitleStyles}>FUEL LOGS</Text>
            <HStack gap="2" flexWrap="wrap">
              <Button size="sm" colorPalette="orange">
                <LuPlus />
                Log Fuel
              </Button>
              <Button size="sm" colorPalette="orange" variant="outline">
                <LuPlus />
                Add Expense
              </Button>
            </HStack>
          </Flex>

          {fuelLogs.length === 0 ? (
            <EmptyState
              title="No fuel logs"
              description="Log fuel purchases to track fleet fuel expenditure."
            />
          ) : (
            <Table.ScrollArea>
              <Table.Root size="sm" variant="line">
                <Table.Header>
                  <Table.Row borderColor="gray.700">
                    <Table.ColumnHeader {...headerCellStyles}>VEHICLE</Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>DATE</Table.ColumnHeader>
                    <Table.ColumnHeader
                      {...headerCellStyles}
                      display={{ base: "none", sm: "table-cell" }}
                    >
                      LITERS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>FUEL COST</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {fuelLogs.map((log) => (
                    <Table.Row key={log.id} borderColor="gray.800">
                      <Table.Cell>
                        <Text fontSize="sm" fontWeight="medium" color="gray.100">
                          {log.vehicleName}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.300">
                          {format(parseISO(log.date), "dd MMM yyyy")}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", sm: "table-cell" }}>
                        <Text fontSize="sm" color="gray.300">
                          {log.litres} L
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.300">
                          {formatIndianCurrency(log.fuelCost)}
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

      <Card.Root variant="outline" bg="gray.900" borderColor="gray.700" overflow="hidden">
        <Card.Body gap="4" p="0">
          <Box px="5" pt="5">
            <Text {...sectionTitleStyles}>OTHER EXPENSES (TOLL / MISC)</Text>
          </Box>

          {tripExpenses.length === 0 ? (
            <EmptyState
              title="No trip expenses"
              description="Trip tolls, misc costs, and linked maintenance will appear here."
            />
          ) : (
            <Table.ScrollArea>
              <Table.Root size="sm" variant="line">
                <Table.Header>
                  <Table.Row borderColor="gray.700">
                    <Table.ColumnHeader {...headerCellStyles}>TRIP</Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>VEHICLE</Table.ColumnHeader>
                    <Table.ColumnHeader
                      {...headerCellStyles}
                      display={{ base: "none", md: "table-cell" }}
                    >
                      TOLL
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      {...headerCellStyles}
                      display={{ base: "none", md: "table-cell" }}
                    >
                      OTHER
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      {...headerCellStyles}
                      display={{ base: "none", lg: "table-cell" }}
                    >
                      MAINT. (LINKED)
                    </Table.ColumnHeader>
                    <Table.ColumnHeader {...headerCellStyles}>STATUS</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {tripExpenses.map((expense) => (
                    <Table.Row key={expense.id} borderColor="gray.800">
                      <Table.Cell>
                        <Text fontSize="sm" fontWeight="medium" color="gray.100" fontFamily="mono">
                          {expense.tripCode}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.300">
                          {expense.vehicleName}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", md: "table-cell" }}>
                        <Text fontSize="sm" color="gray.300">
                          {formatIndianCurrency(expense.toll)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", md: "table-cell" }}>
                        <Text fontSize="sm" color="gray.300">
                          {formatIndianCurrency(expense.other)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell display={{ base: "none", lg: "table-cell" }}>
                        <Text fontSize="sm" color="gray.300">
                          {formatIndianCurrency(expense.maintenanceLinked)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge status={expense.status} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          )}
        </Card.Body>
      </Card.Root>

      <Separator borderColor="gray.700" />

      <Flex
        align={{ base: "flex-start", sm: "center" }}
        justify="space-between"
        gap="4"
        direction={{ base: "column", sm: "row" }}
      >
        <Text fontSize="sm" color="gray.300">
          TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINT
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color="orange.400" lineHeight="1">
          {formatIndianCurrency(summary.totalOperationalCost)}
        </Text>
      </Flex>
    </VStack>
  );
}
