import { Card, Table } from "@chakra-ui/react";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  hideBelow?: "sm" | "md" | "lg";
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  getRowKey: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  loadingMessage,
  emptyTitle = "No records found",
  emptyDescription,
  getRowKey,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <Card.Root variant="outline" bg="gray.900" borderColor="gray.700" borderRadius="lg">
        <Card.Body p="0">
          <LoadingState message={loadingMessage} />
        </Card.Body>
      </Card.Root>
    );
  }

  if (data.length === 0) {
    return (
      <Card.Root variant="outline" bg="gray.900" borderColor="gray.700" borderRadius="lg">
        <Card.Body p="0">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="outline" overflow="hidden" bg="gray.900" borderColor="gray.700" borderRadius="lg">
      <Card.Body p="0">
        <Table.ScrollArea bg="gray.900">
          <Table.Root size="sm" variant="line" bg="gray.900" color="gray.100">
            <Table.Header>
              <Table.Row bg="gray.900" borderColor="gray.700">
                {columns.map((column) => (
                  <Table.ColumnHeader
                    key={column.key}
                    bg="gray.900"
                    color="gray.300"
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="wider"
                    display={
                      column.hideBelow
                        ? { base: "none", [column.hideBelow]: "table-cell" }
                        : undefined
                    }
                  >
                    {column.header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map((row) => (
                <Table.Row key={getRowKey(row)} bg="gray.900" borderColor="gray.800">
                  {columns.map((column) => (
                    <Table.Cell
                      key={column.key}
                      bg="gray.900"
                      color="gray.100"
                      display={
                        column.hideBelow
                          ? { base: "none", [column.hideBelow]: "table-cell" }
                          : undefined
                      }
                    >
                      {column.render(row)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Card.Body>
    </Card.Root>
  );
}
