import { EnvironmentEnum } from "../utils/constants";

interface Environment {
  port: number;
  env: EnvironmentEnum;
  bffAPIKey: string;
  bffAPIUrl: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

const parsePositiveInt = (raw: string, name: string): number => {
  const value = Number(raw);
  if (Number.isNaN(value) || value <= 0) {
    throw new Error(
      `Invalid ${name} value: ${value}. Must be a positive integer.`,
    );
  }
  return value;
};

export const environment: Environment = {
  port: parsePositiveInt(optionalEnv("PORT", "3000"), "PORT"),
  env: optionalEnv("NODE_ENV", "development") as EnvironmentEnum,
  bffAPIKey: requireEnv("BFF_API_KEY"),
  bffAPIUrl: requireEnv("BFF_API_URL"),
};
