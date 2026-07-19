import { z } from "zod";
import {
  AcceptRestaurantInvitationApiResponseSchema,
  AcceptRestaurantInvitationInput,
  AcceptRestaurantInvitationSchema,
  CreateRestaurantInvitationInput,
  CreateRestaurantInvitationSchema,
  RestaurantInvitationPreview,
  RestaurantInvitationPreviewApiResponseSchema,
  RestaurantTeam,
  RestaurantTeamApiResponseSchema,
  RestaurantTeamInvitationApiResponseSchema,
  RestaurantTeamMember,
  RestaurantTeamMemberApiResponseSchema,
  UpdateRestaurantMemberRoleSchema,
} from "../types/dto/restaurant-team.dto";
import type { RestaurantUserRole } from "../types/user.types";
import { apiClient } from "./api.client";

const resourceIdSchema = z.string().uuid();
const invitationTokenSchema = z.string().min(32);

export const getRestaurantTeam = async (): Promise<RestaurantTeam> => {
  const response = await apiClient.get("/users/restaurant-team");
  return RestaurantTeamApiResponseSchema.parse(response.data).data;
};

export const createRestaurantInvitation = async (
  input: CreateRestaurantInvitationInput,
) => {
  const payload = CreateRestaurantInvitationSchema.parse(input);
  const response = await apiClient.post(
    "/users/restaurant-team/invitations",
    payload,
  );
  return RestaurantTeamInvitationApiResponseSchema.parse(response.data).data;
};

export const updateRestaurantMemberRole = async (
  memberId: string,
  role: RestaurantUserRole,
): Promise<RestaurantTeamMember> => {
  const parsedMemberId = resourceIdSchema.parse(memberId);
  const payload = UpdateRestaurantMemberRoleSchema.parse({ role });
  const response = await apiClient.patch(
    `/users/restaurant-team/members/${encodeURIComponent(parsedMemberId)}/role`,
    payload,
  );
  return RestaurantTeamMemberApiResponseSchema.parse(response.data).data;
};

export const removeRestaurantMember = async (
  memberId: string,
): Promise<RestaurantTeamMember> => {
  const parsedMemberId = resourceIdSchema.parse(memberId);
  const response = await apiClient.delete(
    `/users/restaurant-team/members/${encodeURIComponent(parsedMemberId)}`,
  );
  return RestaurantTeamMemberApiResponseSchema.parse(response.data).data;
};

export const cancelRestaurantInvitation = async (
  invitationId: string,
): Promise<void> => {
  const parsedInvitationId = resourceIdSchema.parse(invitationId);
  await apiClient.delete(
    `/users/restaurant-team/invitations/${encodeURIComponent(parsedInvitationId)}`,
  );
};

export const getRestaurantInvitationPreview = async (
  token: string,
): Promise<RestaurantInvitationPreview> => {
  const parsedToken = invitationTokenSchema.parse(token);
  const response = await apiClient.get(
    `/auth/restaurant-invitations/${encodeURIComponent(parsedToken)}`,
  );
  return RestaurantInvitationPreviewApiResponseSchema.parse(response.data).data;
};

export const acceptRestaurantInvitation = async (
  token: string,
  input: AcceptRestaurantInvitationInput,
) => {
  const parsedToken = invitationTokenSchema.parse(token);
  const payload = AcceptRestaurantInvitationSchema.parse(input);
  const response = await apiClient.post(
    `/auth/restaurant-invitations/${encodeURIComponent(parsedToken)}/accept`,
    payload,
  );
  return AcceptRestaurantInvitationApiResponseSchema.parse(response.data).data;
};
