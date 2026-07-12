"use client";

import {
  Box,
  Card,
  Field,
  Grid,
  Input,
  NativeSelect,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
import type { PermissionLevel, RbacModule } from "@/types/settings";
import {
  CURRENCY_OPTIONS,
  DISTANCE_UNIT_OPTIONS,
  RBAC_MODULES,
  RBAC_MODULE_LABELS,
} from "@/types/settings";
import {
  APP_SETTINGS_DEFAULTS,
  ROLE_PERMISSION_MATRIX,
} from "./settings.data";

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

const sectionTitleStyles = {
  fontSize: "xs",
  fontWeight: "semibold",
  letterSpacing: "wider",
  color: "gray.400",
  textTransform: "uppercase" as const,
};

const headerCellStyles = {
  bg: "gray.900",
  color: "gray.300",
  fontSize: "xs",
  fontWeight: "semibold" as const,
  letterSpacing: "wider",
};

function PermissionCell({ level }: { level: PermissionLevel }) {
  if (level === "full") {
    return (
      <Box color="green.400" display="inline-flex" aria-label="Full access">
        <LuCheck />
      </Box>
    );
  }

  if (level === "view") {
    return (
      <Text fontSize="sm" color="gray.200">
        view
      </Text>
    );
  }

  return (
    <Text fontSize="sm" color="gray.500" aria-label="No access">
      —
    </Text>
  );
}

export function SettingsContent() {
  const general = APP_SETTINGS_DEFAULTS;

  return (
    <Grid
      templateColumns={{ base: "1fr", xl: "minmax(320px, 400px) 1fr" }}
      gap={{ base: "6", xl: "8" }}
      alignItems="start"
    >
      <Card.Root
        variant="outline"
        bg="gray.900"
        borderColor="gray.700"
        borderRadius="lg"
      >
        <Card.Body gap="5">
          <Text {...sectionTitleStyles}>General</Text>
          <Text fontSize="sm" color="gray.500">
            Organization defaults are display-only. Role permissions below
            reflect the live access rules enforced by the server.
          </Text>

          <VStack align="stretch" gap="4">
            <Field.Root>
              <Field.Label {...labelStyles}>DEPOT NAME</Field.Label>
              <Input value={general.depotName} readOnly {...inputStyles} />
            </Field.Root>

            <Field.Root>
              <Field.Label {...labelStyles}>CURRENCY</Field.Label>
              <NativeSelect.Root disabled>
                <NativeSelect.Field
                  value={general.currency}
                  aria-label="Currency"
                  {...inputStyles}
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator color="gray.400" />
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root>
              <Field.Label {...labelStyles}>DISTANCE UNIT</Field.Label>
              <NativeSelect.Root disabled>
                <NativeSelect.Field
                  value={general.distanceUnit}
                  aria-label="Distance unit"
                  {...inputStyles}
                >
                  {DISTANCE_UNIT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator color="gray.400" />
              </NativeSelect.Root>
            </Field.Root>
          </VStack>
        </Card.Body>
      </Card.Root>

      <Card.Root
        variant="outline"
        bg="gray.900"
        borderColor="gray.700"
        overflow="hidden"
        borderRadius="lg"
      >
        <Card.Body gap="4" p="0">
          <Box px="5" pt="5">
            <Text {...sectionTitleStyles}>Role-Based Access (RBAC)</Text>
            <Text fontSize="sm" color="gray.500" mt="2">
              Full = create/update actions · view = read access · — = no module
              access beyond shared navigation
            </Text>
          </Box>

          <Table.ScrollArea bg="gray.900">
            <Table.Root size="sm" variant="line" bg="gray.900" color="gray.100">
              <Table.Header>
                <Table.Row bg="gray.900" borderColor="gray.700">
                  <Table.ColumnHeader {...headerCellStyles}>
                    ROLE
                  </Table.ColumnHeader>
                  {RBAC_MODULES.map((module) => (
                    <Table.ColumnHeader
                      key={module}
                      {...headerCellStyles}
                      display={{
                        base:
                          module === "fleet" || module === "trips"
                            ? "table-cell"
                            : "none",
                        md: module === "analytics" ? "none" : "table-cell",
                        lg: "table-cell",
                      }}
                    >
                      {RBAC_MODULE_LABELS[module].toUpperCase()}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {ROLE_PERMISSION_MATRIX.map((row) => (
                  <Table.Row
                    key={row.roleLabel}
                    bg="gray.900"
                    borderColor="gray.800"
                  >
                    <Table.Cell bg="gray.900">
                      <Text fontSize="sm" fontWeight="semibold" color="white">
                        {row.roleLabel}
                      </Text>
                    </Table.Cell>
                    {RBAC_MODULES.map((module: RbacModule) => (
                      <Table.Cell
                        key={module}
                        bg="gray.900"
                        display={{
                          base:
                            module === "fleet" || module === "trips"
                              ? "table-cell"
                              : "none",
                          md: module === "analytics" ? "none" : "table-cell",
                          lg: "table-cell",
                        }}
                      >
                        <PermissionCell level={row.permissions[module]} />
                      </Table.Cell>
                    ))}
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
