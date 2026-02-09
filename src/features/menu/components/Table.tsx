import { Box, Typography } from "@mui/material";
import { Colors } from "../../../theme";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
  Updater,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowDownward, ArrowUpward, Sort } from "@mui/icons-material";

interface TableProps<T> {
  filteredData: T[];
  columns: ColumnDef<T>[];
  pagination: PaginationState;
  setPagination: (updater: Updater<PaginationState>) => void;
  enableSorting?: boolean;
  enableColumnFiltering?: boolean;
}

const Table = <T,>({
  filteredData,
  columns,
  pagination,
  setPagination,
  enableSorting = true,
  enableColumnFiltering = false,
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableSorting,
    enableColumnFilters: enableColumnFiltering,
  });

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        bgcolor: "white",
        borderRadius: "12px",
        fontFamily: "IBM Plex Sans, serif",
        border: `1px solid ${Colors.border.default}`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.95rem",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              style={{
                backgroundColor: Colors.background.light,
                borderBottom: `2px solid ${Colors.border.default}`,
              }}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    fontWeight: "700",
                    color: Colors.text.default,
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    padding: "16px",
                    textAlign: "left",
                    borderBottom: `2px solid ${Colors.border.default}`,
                    cursor: enableSorting
                      ? header.column.getCanSort()
                        ? "pointer"
                        : "default"
                      : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {enableSorting && header.column.getCanSort() && (
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          ml: 1,
                        }}
                      >
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUpward sx={{ fontSize: "1rem" }} />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDownward sx={{ fontSize: "1rem" }} />
                        ) : (
                          <Sort sx={{ fontSize: "1rem", opacity: 0.4 }} />
                        )}
                      </Box>
                    )}
                  </Box>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: `1px solid ${Colors.border.default}`,
                  transition: "all 0.2s ease",
                  backgroundColor: "white",
                }}
                onMouseEnter={(e) => {
                  (
                    e.currentTarget as HTMLTableRowElement
                  ).style.backgroundColor = `${Colors.background.brand}08`;
                }}
                onMouseLeave={(e) => {
                  (
                    e.currentTarget as HTMLTableRowElement
                  ).style.backgroundColor = "white";
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: "16px",
                      borderBottom: `1px solid ${Colors.border.default}`,
                      color: Colors.text.default,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                style={{
                  textAlign: "center",
                  padding: "40px 16px",
                  color: Colors.text.placeholder,
                }}
              >
                <Typography>No data found</Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Box>
  );
};

export default Table;
