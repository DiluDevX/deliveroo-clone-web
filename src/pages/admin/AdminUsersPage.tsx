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

// Mock data for development
const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 555-0101",
    orderCount: 12,
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "+1 555-0102",
    orderCount: 8,
    createdAt: new Date("2025-01-20"),
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike@example.com",
    phone: "+1 555-0103",
    orderCount: 24,
    createdAt: new Date("2024-12-10"),
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah@example.com",
    phone: "+1 555-0104",
    orderCount: 5,
    createdAt: new Date("2025-01-25"),
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "Brown",
    email: "robert@example.com",
    phone: "+1 555-0105",
    orderCount: 31,
    createdAt: new Date("2024-11-05"),
  },
  {
    id: "6",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily@example.com",
    phone: "+1 555-0106",
    orderCount: 19,
    createdAt: new Date("2025-01-02"),
  },
  {
    id: "7",
    firstName: "David",
    lastName: "Miller",
    email: "david@example.com",
    phone: "+1 555-0107",
    orderCount: 7,
    createdAt: new Date("2025-01-22"),
  },
  {
    id: "8",
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa@example.com",
    phone: "+1 555-0108",
    orderCount: 15,
    createdAt: new Date("2024-12-28"),
  },
  {
    id: "9",
    firstName: "Chris",
    lastName: "Taylor",
    email: "chris@example.com",
    phone: "+1 555-0109",
    orderCount: 22,
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "10",
    firstName: "Amanda",
    lastName: "White",
    email: "amanda@example.com",
    phone: "+1 555-0110",
    orderCount: 9,
    createdAt: new Date("2025-01-18"),
  },
];

const AdminUsersPage = () => {
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      // TODO: Replace with real API call
      // const data = await getAllUsers();
      // setUsers(data || []);
      // For now, using mock data
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.orderCount.toString().includes(searchTerm.toLowerCase()) ||
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
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.orderCount}</TableCell>
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
                    {new Date(user.createdAt).toLocaleDateString()}
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
