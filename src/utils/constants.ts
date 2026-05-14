export const EnvironmentEnum = {
  Development: "development",
  Production: "production",
  Test: "test",
} as const;

export type EnvironmentEnum =
  (typeof EnvironmentEnum)[keyof typeof EnvironmentEnum];
