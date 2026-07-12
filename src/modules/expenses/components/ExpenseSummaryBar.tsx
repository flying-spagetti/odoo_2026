"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { formatPaiseAsRupees } from "@/lib/utils/format";
import type { OperationalCostSummary } from "../expense.types";

interface ExpenseSummaryBarProps {
  summary: OperationalCostSummary;
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="wider"
        color="gray.500"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Text fontSize="lg" fontWeight="semibold" color="gray.100" mt="1">
        {formatPaiseAsRupees(value)}
      </Text>
    </Box>
  );
}

export function ExpenseSummaryBar({ summary }: ExpenseSummaryBarProps) {
  return (
    <Flex
      align={{ base: "stretch", md: "flex-end" }}
      justify="space-between"
      gap="5"
      direction={{ base: "column", md: "row" }}
      wrap="wrap"
    >
      <Flex gap={{ base: "5", sm: "8" }} wrap="wrap">
        <SummaryItem label="Fuel cost" value={summary.totalFuelCostPaise} />
        <SummaryItem
          label="Maintenance cost"
          value={summary.totalMaintenanceCostPaise}
        />
        <SummaryItem
          label="Other expenses"
          value={summary.totalOtherExpenseCostPaise}
        />
      </Flex>

      <Box textAlign={{ base: "left", md: "right" }}>
        <Text
          fontSize="xs"
          fontWeight="semibold"
          letterSpacing="wider"
          color="gray.500"
          textTransform="uppercase"
        >
          Total tracked operating spend
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color="blue.300" lineHeight="1.1" mt="1">
          {formatPaiseAsRupees(summary.totalTrackedOperatingSpendPaise)}
        </Text>
      </Box>
    </Flex>
  );
}
