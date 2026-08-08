import { z } from "zod";
import { RestaurantUserRoleSchema } from "./model.schemas";

const RestaurantTeamMemberSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: RestaurantUserRoleSchema,
  createdAt: z.string().datetime(),
});

const RestaurantTeamInvitationSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: RestaurantUserRoleSchema,
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const RestaurantTeamSchema = z.object({
  members: z.array(RestaurantTeamMemberSchema),
  invitations: z.array(RestaurantTeamInvitationSchema),
  grantableRoles: z.array(RestaurantUserRoleSchema),
});

export const CreateRestaurantInvitationSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  role: RestaurantUserRoleSchema.exclude(["super_admin"]),
});

export const UpdateRestaurantMemberRoleSchema = z.object({
  role: RestaurantUserRoleSchema.exclude(["super_admin"]),
});

export const RestaurantInvitationPreviewSchema = z.object({
  email: z.string().email(),
  role: RestaurantUserRoleSchema,
  expiresAt: z.string().datetime(),
  existingUser: z.boolean(),
});

export const AcceptRestaurantInvitationSchema = z.object({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  password: z.string().min(8),
});

export const RestaurantTeamApiResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: RestaurantTeamSchema,
});

export const RestaurantTeamMemberApiResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: RestaurantTeamMemberSchema,
});

export const RestaurantTeamInvitationApiResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: RestaurantTeamInvitationSchema,
});

export const RestaurantInvitationPreviewApiResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: RestaurantInvitationPreviewSchema,
});

export const AcceptRestaurantInvitationApiResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    email: z.string().email(),
    restaurantId: z.string().min(1),
    role: RestaurantUserRoleSchema,
    provisioningId: z.string().uuid().optional(),
  }),
});

export type RestaurantTeam = z.infer<typeof RestaurantTeamSchema>;
export type RestaurantTeamMember = z.infer<typeof RestaurantTeamMemberSchema>;
export type RestaurantTeamInvitation = z.infer<
  typeof RestaurantTeamInvitationSchema
>;
export type CreateRestaurantInvitationInput = z.infer<
  typeof CreateRestaurantInvitationSchema
>;
export type RestaurantInvitationPreview = z.infer<
  typeof RestaurantInvitationPreviewSchema
>;
export type AcceptRestaurantInvitationInput = z.infer<
  typeof AcceptRestaurantInvitationSchema
>;
