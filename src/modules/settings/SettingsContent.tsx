"use client";

import {
  Box,
  Button,
  Card,
  Field,
  Grid,
  Input,
  NativeSelect,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { LoadingState } from "@/components/shared/LoadingState";
import { MOCK_SETTINGS } from "@/lib/mock-data/settings";
import type {
  GeneralSettings,
  PermissionLevel,
  RbacModule,
  SettingsData,
} from "@/types/settings";
import {
  CURRENCY_OPTIONS,
  DISTANCE_UNIT_OPTIONS,
  RBAC_MODULES,
  RBAC_MODULE_LABELS,
} from "@/types/settings";

interface SettingsContentProps {
  settings?: SettingsData;
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

export function SettingsContent({
  settings = MOCK_SETTINGS,
  isLoading = false,
}: SettingsContentProps) {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(
    settings.general,
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleGeneralChange = <K extends keyof GeneralSettings>(
    field: K,
    value: GeneralSettings[K],
  ) => {
    setGeneralSettings((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setIsSaving(false);
  };

  if (isLoading) {
    return <LoadingState message="Loading settings..." />;
  }

  return (
    <Grid
      templateColumns={{ base: "1fr", xl: "minmax(320px, 400px) 1fr" }}
      gap={{ base: "6", xl: "8" }}
      alignItems="start"
    >
      <Card.Root variant="outline" bg="gray.900" borderColor="gray.700" borderRadius="lg">
        <Card.Body gap="5">
          <Text {...sectionTitleStyles}>General</Text>

          <form onSubmit={handleSave}>
            <VStack align="stretch" gap="4">
              <Field.Root required>
                <Field.Label {...labelStyles}>DEPOT NAME</Field.Label>
                <Input
                  value={generalSettings.depotName}
                  onChange={(event) =>
                    handleGeneralChange("depotName", event.target.value)
                  }
                  {...inputStyles}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label {...labelStyles}>CURRENCY</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={generalSettings.currency}
                    onChange={(event) =>
                      handleGeneralChange("currency", event.target.value)
                    }
                    aria-label="Select currency"
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

              <Field.Root required>
                <Field.Label {...labelStyles}>DISTANCE UNIT</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={generalSettings.distanceUnit}
                    onChange={(event) =>
                      handleGeneralChange("distanceUnit", event.target.value)
                    }
                    aria-label="Select distance unit"
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

              <Button
                type="submit"
                colorPalette="blue"
                loading={isSaving}
                alignSelf="flex-start"
                mt="2"
              >
                Save changes
              </Button>
            </VStack>
          </form>
        </Card.Body>
      </Card.Root>

      <Card.Root variant="outline" bg="gray.900" borderColor="gray.700" overflow="hidden" borderRadius="lg">
        <Card.Body gap="4" p="0">
          <Box px="5" pt="5">
            <Text {...sectionTitleStyles}>Role-Based Access (RBAC)</Text>
          </Box>

          <Table.ScrollArea bg="gray.900">
            <Table.Root size="sm" variant="line" bg="gray.900" color="gray.100">
              <Table.Header>
                <Table.Row bg="gray.900" borderColor="gray.700">
                  <Table.ColumnHeader {...headerCellStyles}>ROLE</Table.ColumnHeader>
                  {RBAC_MODULES.map((module) => (
                    <Table.ColumnHeader
                      key={module}
                      {...headerCellStyles}
                      display={{
                        base: module === "fleet" || module === "trips" ? "table-cell" : "none",
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
                {settings.rolePermissions.map((row) => (
                  <Table.Row key={row.roleLabel} bg="gray.900" borderColor="gray.800">
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
                          base: module === "fleet" || module === "trips" ? "table-cell" : "none",
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
