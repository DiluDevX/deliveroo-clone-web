import { zodResolver } from "@hookform/resolvers/zod";
import {
  CancelOutlined,
  DeleteOutline,
  GroupOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../features/menu/components/Button";
import PopUpDialog from "../../features/menu/components/PopUpDialog";
import {
  cancelRestaurantInvitation,
  createRestaurantInvitation,
  getRestaurantTeam,
  removeRestaurantMember,
  updateRestaurantMemberRole,
} from "../../services/restaurant-team.service";
import { useAppSelector } from "../../store/hooks/cartHooks";
import { Colors } from "../../theme";
import {
  CreateRestaurantInvitationInput,
  CreateRestaurantInvitationSchema,
  RestaurantTeam,
  RestaurantTeamInvitation,
  RestaurantTeamMember,
} from "../../types/dto/restaurant-team.dto";
import type { RestaurantUserRole } from "../../types/user.types";
import { getApiErrorMessage } from "../../utils/api-error";
import {
  showErrorSnackbar,
  showSuccessSnackbar,
} from "../../utils/notifications";

const roleLabels: Record<RestaurantUserRole, string> = {
  super_admin: "Owner",
  admin: "Admin",
  finance: "Finance",
  employee: "Employee",
};

const roleDescriptions: Record<RestaurantUserRole, string> = {
  super_admin: "Full restaurant access and ownership controls",
  admin: "Operations, menu, settings and employee management",
  finance: "Dashboard and analytics access",
  employee: "Dashboard and order operations",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const RestaurantTeamPage = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [team, setTeam] = useState<RestaurantTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    member: RestaurantTeamMember;
    role: RestaurantUserRole;
  } | null>(null);
  const [memberPendingRemoval, setMemberPendingRemoval] =
    useState<RestaurantTeamMember | null>(null);
  const [invitationPendingCancellation, setInvitationPendingCancellation] =
    useState<RestaurantTeamInvitation | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const inviteForm = useForm<CreateRestaurantInvitationInput>({
    resolver: zodResolver(CreateRestaurantInvitationSchema),
    defaultValues: { email: "", role: "employee" },
  });

  useEffect(() => {
    let isActive = true;

    const loadTeam = async () => {
      setIsLoading(true);
      try {
        const loadedTeam = await getRestaurantTeam();
        if (isActive) setTeam(loadedTeam);
      } catch (error) {
        if (isActive) {
          showErrorSnackbar(
            getApiErrorMessage(error, "Failed to load restaurant team"),
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadTeam();
    return () => {
      isActive = false;
    };
  }, []);

  const grantableRoles = useMemo(
    () =>
      (team?.grantableRoles ?? []).filter(
        (role): role is CreateRestaurantInvitationInput["role"] =>
          role !== "super_admin",
      ),
    [team?.grantableRoles],
  );

  const openInvitationDialog = () => {
    inviteForm.reset({
      email: "",
      role: grantableRoles[0] ?? "employee",
    });
    setIsInviteOpen(true);
  };

  const submitInvitation = inviteForm.handleSubmit(async (values) => {
    setActiveActionId("invite");
    try {
      const invitation = await createRestaurantInvitation(values);
      setTeam((current) =>
        current
          ? { ...current, invitations: [invitation, ...current.invitations] }
          : current,
      );
      setIsInviteOpen(false);
      showSuccessSnackbar("Restaurant invitation sent");
    } catch (error) {
      showErrorSnackbar(
        getApiErrorMessage(error, "Failed to send restaurant invitation"),
      );
    } finally {
      setActiveActionId(null);
    }
  });

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    setActiveActionId(pendingRoleChange.member.id);
    try {
      const updatedMember = await updateRestaurantMemberRole(
        pendingRoleChange.member.id,
        pendingRoleChange.role,
      );
      setTeam((current) =>
        current
          ? {
              ...current,
              members: current.members.map((member) =>
                member.id === updatedMember.id ? updatedMember : member,
              ),
            }
          : current,
      );
      setPendingRoleChange(null);
      showSuccessSnackbar("Team member role updated");
    } catch (error) {
      showErrorSnackbar(
        getApiErrorMessage(error, "Failed to update team member role"),
      );
    } finally {
      setActiveActionId(null);
    }
  };

  const confirmMemberRemoval = async () => {
    if (!memberPendingRemoval) return;

    setActiveActionId(memberPendingRemoval.id);
    try {
      await removeRestaurantMember(memberPendingRemoval.id);
      setTeam((current) =>
        current
          ? {
              ...current,
              members: current.members.filter(
                (member) => member.id !== memberPendingRemoval.id,
              ),
            }
          : current,
      );
      setMemberPendingRemoval(null);
      showSuccessSnackbar("Team member removed");
    } catch (error) {
      showErrorSnackbar(
        getApiErrorMessage(error, "Failed to remove team member"),
      );
    } finally {
      setActiveActionId(null);
    }
  };

  const confirmInvitationCancellation = async () => {
    if (!invitationPendingCancellation) return;

    setActiveActionId(invitationPendingCancellation.id);
    try {
      await cancelRestaurantInvitation(invitationPendingCancellation.id);
      setTeam((current) =>
        current
          ? {
              ...current,
              invitations: current.invitations.filter(
                (invitation) =>
                  invitation.id !== invitationPendingCancellation.id,
              ),
            }
          : current,
      );
      setInvitationPendingCancellation(null);
      showSuccessSnackbar("Invitation cancelled");
    } catch (error) {
      showErrorSnackbar(
        getApiErrorMessage(error, "Failed to cancel invitation"),
      );
    } finally {
      setActiveActionId(null);
    }
  };

  const canChangeRole = (member: RestaurantTeamMember) =>
    currentUser?.restaurantRole === "super_admin" &&
    member.role !== "super_admin" &&
    member.userId !== currentUser.id;

  const canRemoveMember = (member: RestaurantTeamMember) => {
    if (member.userId === currentUser?.id || member.role === "super_admin") {
      return false;
    }

    return (
      currentUser?.restaurantRole === "super_admin" ||
      (currentUser?.restaurantRole === "admin" && member.role === "employee")
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: 480, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!team) {
    return (
      <Card sx={{ p: 4, border: `1px solid ${Colors.border.default}` }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Team unavailable
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          The restaurant team could not be loaded. Try again when the auth
          service is available.
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            Team
          </Typography>
          <Typography sx={{ color: Colors.text.lighter }}>
            Control staff access without sharing restaurant credentials.
          </Typography>
        </Box>
        <Button
          variant="filled"
          PrefixComponent={
            <PersonAddOutlined
              sx={{ color: Colors.text.inverse, mr: 1, fontSize: "1.4rem" }}
            />
          }
          onClick={openInvitationDialog}
          disabled={grantableRoles.length === 0}
          sx={{ fontWeight: 800, px: 2.5 }}
        >
          Invite team member
        </Button>
      </Box>

      <Card
        sx={{
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Active members ({team.members.length})
          </Typography>
        </Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 620 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: Colors.background.default }}>
                <TableCell sx={{ fontWeight: 800 }}>Member</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Joined</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {team.members.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800 }}>
                      {member.firstName} {member.lastName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: Colors.text.lighter }}
                    >
                      {member.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {canChangeRole(member) ? (
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                          value={member.role}
                          disabled={activeActionId === member.id}
                          onChange={(event) =>
                            setPendingRoleChange({
                              member,
                              role: event.target.value as RestaurantUserRole,
                            })
                          }
                        >
                          {team.grantableRoles
                            .filter((role) => role !== "super_admin")
                            .map((role) => (
                              <MenuItem key={role} value={role}>
                                {roleLabels[role]}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip
                        label={roleLabels[member.role]}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: Colors.text.lighter,
                        mt: 0.5,
                      }}
                    >
                      {roleDescriptions[member.role]}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(member.createdAt)}</TableCell>
                  <TableCell align="right">
                    {canRemoveMember(member) && (
                      <Tooltip title="Remove team member">
                        <IconButton
                          aria-label={`Remove ${member.firstName} ${member.lastName}`}
                          disabled={activeActionId === member.id}
                          onClick={() => setMemberPendingRemoval(member)}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card
        sx={{
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Pending invitations ({team.invitations.length})
          </Typography>
        </Box>
        {team.invitations.length === 0 ? (
          <Box
            sx={{
              px: 3,
              pb: 3,
              display: "flex",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <GroupOutlined sx={{ color: Colors.text.lighter }} />
            <Typography sx={{ color: Colors.text.lighter }}>
              No invitations are waiting for a response.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 560 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: Colors.background.default }}>
                  <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Expires</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {team.invitations.map((invitation) => (
                  <TableRow key={invitation.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {invitation.email}
                    </TableCell>
                    <TableCell>{roleLabels[invitation.role]}</TableCell>
                    <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Cancel invitation">
                        <IconButton
                          aria-label={`Cancel invitation for ${invitation.email}`}
                          disabled={activeActionId === invitation.id}
                          onClick={() =>
                            setInvitationPendingCancellation(invitation)
                          }
                        >
                          <CancelOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <PopUpDialog
        open={isInviteOpen}
        title="Invite a team member"
        description="They will receive a secure link and choose their own password."
        confirmLabel="Send invitation"
        loadingLabel="Sending"
        loading={activeActionId === "invite"}
        disableClose={activeActionId === "invite"}
        onClose={() => setIsInviteOpen(false)}
        onConfirm={() => void submitInvitation()}
        maxWidth="520px"
      >
        <Box sx={{ pt: 2, display: "grid", gap: 2 }}>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            autoComplete="email"
            {...inviteForm.register("email")}
            error={Boolean(inviteForm.formState.errors.email)}
            helperText={inviteForm.formState.errors.email?.message}
          />
          <FormControl
            fullWidth
            error={Boolean(inviteForm.formState.errors.role)}
          >
            <InputLabel id="restaurant-role-label">Restaurant role</InputLabel>
            <Select
              labelId="restaurant-role-label"
              label="Restaurant role"
              value={inviteForm.watch("role")}
              onChange={(event) =>
                inviteForm.setValue(
                  "role",
                  event.target.value as CreateRestaurantInvitationInput["role"],
                  { shouldValidate: true },
                )
              }
            >
              {grantableRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {roleLabels[role]}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: Colors.text.lighter }}
                    >
                      {roleDescriptions[role]}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </PopUpDialog>

      <PopUpDialog
        open={Boolean(pendingRoleChange)}
        title="Change team member role?"
        description={
          pendingRoleChange
            ? `${pendingRoleChange.member.firstName} will receive ${roleDescriptions[pendingRoleChange.role].toLowerCase()}.`
            : undefined
        }
        confirmLabel="Change role"
        loading={activeActionId === pendingRoleChange?.member.id}
        disableClose={Boolean(activeActionId)}
        onClose={() => setPendingRoleChange(null)}
        onConfirm={() => void confirmRoleChange()}
      />

      <PopUpDialog
        open={Boolean(memberPendingRemoval)}
        title="Remove team member?"
        description={
          memberPendingRemoval
            ? `${memberPendingRemoval.firstName} will immediately lose restaurant dashboard access.`
            : undefined
        }
        confirmLabel="Remove member"
        loadingLabel="Removing"
        danger
        loading={activeActionId === memberPendingRemoval?.id}
        disableClose={Boolean(activeActionId)}
        onClose={() => setMemberPendingRemoval(null)}
        onConfirm={() => void confirmMemberRemoval()}
      />

      <PopUpDialog
        open={Boolean(invitationPendingCancellation)}
        title="Cancel invitation?"
        description="The invitation link will stop working immediately."
        confirmLabel="Cancel invitation"
        loadingLabel="Cancelling"
        danger
        loading={activeActionId === invitationPendingCancellation?.id}
        disableClose={Boolean(activeActionId)}
        onClose={() => setInvitationPendingCancellation(null)}
        onConfirm={() => void confirmInvitationCancellation()}
      />
    </Box>
  );
};

export default RestaurantTeamPage;
