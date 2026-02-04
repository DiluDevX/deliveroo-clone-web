import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";
import { IUser } from "../../types/user.types";
import { getAllUsers } from "../../services/user.service";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      const data = await getAllUsers();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone === null
      ? "-"
      : u.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.orderCount === null
        ? "-"
        : u.orderCount.toString().includes(searchTerm.toLowerCase()) ||
          "active".includes(searchTerm.toLowerCase()) ||
          new Date(u.createdAt)
            .toLocaleDateString()
            .includes(searchTerm.toLowerCase()),
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Users
        </Typography>
        <Typography variant="body2" sx={{ color: Colors.text.default }}>
          Manage customer accounts and activity
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchOutlined sx={{ mr: 1, color: Colors.text.placeholder }} />
            ),
          }}
          size="small"
        />
      </Card>

      {/* Users Table */}
      <Card
        sx={{
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.05)" }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(0, 10).map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.phone === null ? "-" : user.phone}
                  </TableCell>
                  <TableCell>
                    {user.orderCount === null ? "-" : user.orderCount}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      sx={{
                        maxWidth: "60px",
                        minWidth: "60px",
                        fontSize: "0.6rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      pl: 0,
                      py: 1,
                      pr: 1,
                    }}
                  >
                    <Button
                      borderOff={true}
                      sx={{
                        color: Colors.background.brand,
                        fontSize: "0.9rem",
                      }}
                    >
                      view
                    </Button>
                    <Button
                      borderOff={true}
                      sx={{ color: Colors.text.error, fontSize: "0.9rem" }}
                    >
                      suspend
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default AdminUsersPage;
