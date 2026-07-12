"use client";

import {
  Card,
  FormatNumber,
  Grid,
  Table,
  Text,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { KpiCard } from "@/components/shared/KpiCard";
import {
  MOCK_EXPENSE_SUMMARY,
  MOCK_FUEL_LOGS,
  MOCK_OPERATIONAL_EXPENSES,
} from "@/lib/mock-data/expenses";

export function ExpensesContent() {
  const summary = MOCK_EXPENSE_SUMMARY;

  return (
    <Grid gap="6">
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap="4"
      >
        <KpiCard
          label="Total Fuel Cost"
          value={summary.totalFuelCost}
          suffix="INR"
          description="Cumulative fuel expenditure"
        />
        <KpiCard
          label="Total Maintenance Cost"
          value={summary.totalMaintenanceCost}
          suffix="INR"
          description="Repairs and servicing"
        />
        <KpiCard
          label="Total Operational Cost"
          value={summary.totalOperationalCost}
          suffix="INR"
          description="All operational expenses"
        />
      </Grid>

      <Card.Root variant="outline">
        <Card.Header>
          <Card.Title fontSize="md">Fuel Logs</Card.Title>
          <Card.Description>
            Recent fuel purchases across the fleet
          </Card.Description>
        </Card.Header>
        <Card.Body pt="0">
          <Table.ScrollArea>
            <Table.Root size="sm" variant="line">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Vehicle</Table.ColumnHeader>
                  <Table.ColumnHeader display={{ base: "none", sm: "table-cell" }}>
                    Litres
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>Cost (INR)</Table.ColumnHeader>
                  <Table.ColumnHeader display={{ base: "none", md: "table-cell" }}>
                    Odometer
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {MOCK_FUEL_LOGS.map((log) => (
                  <Table.Row key={log.id}>
                    <Table.Cell>
                      <Text fontSize="sm">
                        {format(parseISO(log.date), "dd MMM yyyy")}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" fontWeight="medium">
                        {log.vehicleRegistration}
                      </Text>
                    </Table.Cell>
                    <Table.Cell display={{ base: "none", sm: "table-cell" }}>
                      <Text fontSize="sm">
                        <FormatNumber value={log.litres} />
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm">
                        <FormatNumber value={log.cost} />
                      </Text>
                    </Table.Cell>
                    <Table.Cell display={{ base: "none", md: "table-cell" }}>
                      <Text fontSize="sm">
                        <FormatNumber value={log.odometerKm} /> km
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Card.Body>
      </Card.Root>

      <Card.Root variant="outline">
        <Card.Header>
          <Card.Title fontSize="md">Other Operational Expenses</Card.Title>
          <Card.Description>
            Maintenance, tolls, permits, and other costs
          </Card.Description>
        </Card.Header>
        <Card.Body pt="0">
          <Table.ScrollArea>
            <Table.Root size="sm" variant="line">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader display={{ base: "none", sm: "table-cell" }}>
                    Category
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>Description</Table.ColumnHeader>
                  <Table.ColumnHeader>Amount (INR)</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {MOCK_OPERATIONAL_EXPENSES.map((expense) => (
                  <Table.Row key={expense.id}>
                    <Table.Cell>
                      <Text fontSize="sm">
                        {format(parseISO(expense.date), "dd MMM yyyy")}
                      </Text>
                    </Table.Cell>
                    <Table.Cell display={{ base: "none", sm: "table-cell" }}>
                      <Text fontSize="sm">{expense.category}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm">{expense.description}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm">
                        <FormatNumber value={expense.amount} />
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Card.Body>
      </Card.Root>
    </Grid>
  );
}
