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
      <Card.Root variant="outline">
        <Card.Body p="0">
          <LoadingState message={loadingMessage} />
        </Card.Body>
      </Card.Root>
    );
  }

  if (data.length === 0) {
    return (
      <Card.Root variant="outline">
        <Card.Body p="0">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="outline" overflow="hidden">
      <Card.Body p="0">
        <Table.ScrollArea>
          <Table.Root size="sm" variant="line" striped>
            <Table.Header>
              <Table.Row>
                {columns.map((column) => (
                  <Table.ColumnHeader
                    key={column.key}
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
                <Table.Row key={getRowKey(row)}>
                  {columns.map((column) => (
                    <Table.Cell
                      key={column.key}
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
