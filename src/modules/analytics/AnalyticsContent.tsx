"use client";

import {
  Box,
  Card,
  Flex,
  Grid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AccentKpiCard } from "@/components/shared/AccentKpiCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatIndianCurrency } from "@/lib/utils/format";
import type { AnalyticsOverview } from "@/types/analytics";

interface AnalyticsContentProps {
  data: AnalyticsOverview | null;
  errorMessage?: string | null;
}

const sectionTitleStyles = {
  fontSize: "xs",
  fontWeight: "semibold",
  letterSpacing: "wider",
  color: "gray.400",
  textTransform: "uppercase" as const,
};

const vehicleBarColors: Record<string, string> = {
  red: "red.400",
  orange: "orange.400",
  blue: "blue.400",
};

export function AnalyticsContent({
  data,
  errorMessage = null,
}: AnalyticsContentProps) {
  if (errorMessage || !data) {
    return (
      <ErrorState
        title="Unable to load analytics"
        message={errorMessage ?? "Analytics data is unavailable."}
      />
    );
  }

  if (!data.kpis.length) {
    return (
      <EmptyState
        title="No analytics data"
        description="Fleet analytics will appear here once operational data is available."
      />
    );
  }

  const maxVehicleCost = Math.max(
    ...data.costliestVehicles.map((vehicle) => vehicle.cost),
    1,
  );

  return (
    <VStack align="stretch" gap="6">
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap="4"
      >
        {data.kpis.map((kpi) => (
          <AccentKpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            accentColor={kpi.accentColor}
          />
        ))}
      </Grid>

      <Text fontSize="sm" color="gray.500">
        {data.roiFormula}
      </Text>

      <Grid
        templateColumns={{ base: "1fr", lg: "1.4fr 1fr" }}
        gap="4"
        alignItems="stretch"
      >
        <Card.Root
          variant="outline"
          bg="gray.900"
          borderColor="gray.700"
          borderRadius="lg"
        >
          <Card.Body gap="4">
            <Text {...sectionTitleStyles}>Monthly Revenue</Text>
            {data.monthlyRevenue.every((point) => point.revenue === 0) ? (
              <EmptyState
                title="No completed trip revenue yet"
                description="Revenue appears after trips are completed with recorded revenue."
              />
            ) : (
              <Box h="240px" w="full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.monthlyRevenue}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="var(--chakra-colors-gray-800)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fill: "var(--chakra-colors-gray-500)",
                        fontSize: 12,
                      }}
                      axisLine={{ stroke: "var(--chakra-colors-gray-700)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fill: "var(--chakra-colors-gray-500)",
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: number) =>
                        `${Math.round(value / 1000)}k`
                      }
                    />
                    <Tooltip
                      cursor={{ fill: "var(--chakra-colors-gray-800)" }}
                      contentStyle={{
                        backgroundColor: "var(--chakra-colors-gray-900)",
                        border: "1px solid var(--chakra-colors-gray-700)",
                        borderRadius: "8px",
                        color: "var(--chakra-colors-gray-100)",
                      }}
                      formatter={(value) => {
                        const amount =
                          typeof value === "number"
                            ? value
                            : Number(value ?? 0);
                        return [formatIndianCurrency(amount), "Revenue"];
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="var(--chakra-colors-blue-400)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card.Body>
        </Card.Root>

        <Card.Root
          variant="outline"
          bg="gray.900"
          borderColor="gray.700"
          borderRadius="lg"
        >
          <Card.Body gap="4">
            <Text {...sectionTitleStyles}>Top Costliest Vehicles</Text>
            {data.costliestVehicles.length === 0 ? (
              <EmptyState
                title="No vehicle costs yet"
                description="Fuel, maintenance, and expense totals will appear here."
              />
            ) : (
              <VStack align="stretch" gap="4" pt="2">
                {data.costliestVehicles.map((vehicle) => (
                  <Box key={vehicle.vehicleName}>
                    <Flex justify="space-between" mb="2" gap="3">
                      <Text fontSize="sm" fontWeight="medium" color="gray.200">
                        {vehicle.vehicleName}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        {formatIndianCurrency(vehicle.cost)}
                      </Text>
                    </Flex>
                    <Box
                      h="3"
                      bg="gray.800"
                      borderRadius="full"
                      overflow="hidden"
                    >
                      <Box
                        h="full"
                        bg={vehicleBarColors[vehicle.accentColor]}
                        borderRadius="full"
                        width={`${(vehicle.cost / maxVehicleCost) * 100}%`}
                      />
                    </Box>
                  </Box>
                ))}
              </VStack>
            )}
          </Card.Body>
        </Card.Root>
      </Grid>
    </VStack>
  );
}
