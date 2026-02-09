import { useEffect, useState, useMemo } from "react";
import { Box, Card, Typography, Chip, TextField } from "@mui/material";
import { SearchOutlined, Visibility, Block } from "@mui/icons-material";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";
import Table from "../../features/menu/components/Table";
import { IUser } from "../../types/user.types";
import { getAllUsers } from "../../services/user.service";
import { toast } from "sonner";

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "white",
    transition: "all 0.3s ease",
    "&:hover fieldset": {
      borderColor: Colors.background.brand,
    },
    "&.Mui-focused fieldset": {
      borderColor: Colors.background.brand,
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: Colors.background.brand,
      fontWeight: "500",
    },
  },
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch users",
        );
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.phone && u.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.orderCount &&
          u.orderCount.toString().includes(searchTerm.toLowerCase())),
    );
  }, [users, searchTerm]);

  const columns = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Name",
        cell: (info) => (
          <Box>
            <Typography sx={{ fontWeight: "600" }}>
              {info.row.original.firstName} {info.row.original.lastName}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <Typography sx={{ fontSize: "0.9rem", color: Colors.text.default }}>
            {info.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: (info) => (
          <Typography sx={{ fontSize: "0.9rem", color: Colors.text.default }}>
            {info.getValue<string>() || "-"}
          </Typography>
        ),
      },
      {
        accessorKey: "orderCount",
        header: "Orders",
        cell: (info) => (
          <Typography sx={{ fontWeight: "500", color: Colors.text.default }}>
            {info.getValue<number>() ?? "-"}
          </Typography>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: () => (
          <Chip
            label="Active"
            color="success"
            size="small"
            sx={{
              maxWidth: "80px",
              fontSize: "0.75rem",
            }}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: (info) => (
          <Typography sx={{ fontSize: "0.9rem", color: Colors.text.default }}>
            {new Date(info.getValue<string>()).toISOString().split("T")[0]}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              borderOff={true}
              sx={{
                color: Colors.background.brand,
                fontSize: "0.85rem",
              }}
            >
              <Visibility sx={{ fontSize: "1rem", mr: 0.5 }} />
              View
            </Button>
            <Button
              borderOff={true}
              sx={{ color: Colors.text.error, fontSize: "0.85rem" }}
            >
              <Block sx={{ fontSize: "1rem", mr: 0.5 }} />
              Block
            </Button>
          </Box>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "700",
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            color: Colors.text.default,
          }}
        >
          Users
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: Colors.text.placeholder,
            fontSize: "0.95rem",
          }}
        >
          Manage customer accounts and activity
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          bgcolor: "white",
          border: `1px solid ${Colors.border.default}`,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchOutlined
                sx={{
                  mr: 1.5,
                  color: Colors.text.placeholder,
                  fontSize: "1.2rem",
                }}
              />
            ),
          }}
          size="small"
          sx={textFieldStyles}
        />
      </Card>

      {/* Users Table */}
      <Card
        sx={{
          bgcolor: "white",
          border: `1px solid ${Colors.border.default}`,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <Table
          filteredData={filteredUsers}
          columns={columns}
          pagination={pagination}
          setPagination={setPagination}
          enableSorting={true}
        />

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderTop: `1px solid ${Colors.border.default}`,
            bgcolor: Colors.background.light,
          }}
        >
          <Typography
            sx={{ fontSize: "0.9rem", color: Colors.text.placeholder }}
          >
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              filteredUsers.length,
            )}{" "}
            of {filteredUsers.length} users
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              sx={{
                px: 2,
                py: 0.8,
                borderRadius: "6px",
                fontWeight: "500",
                color: Colors.text.inverse,
                bgcolor: Colors.background.brand,
              }}
            >
              Previous
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              sx={{
                px: 2,
                py: 0.8,
                borderRadius: "6px",
                fontWeight: "500",
                color: Colors.text.inverse,
                bgcolor: Colors.background.brand,
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default AdminUsersPage;
