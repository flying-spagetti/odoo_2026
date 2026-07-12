import { Role } from "@/generated/prisma/enums";

export const DEMO_PASSWORD = "TransitOps123!";

export const DEMO_ACCOUNTS = [
  { email: "dispatcher@transitops.demo", label: "Dispatcher" },
  { email: "fleet@transitops.demo", label: "Fleet Manager" },
  { email: "safety@transitops.demo", label: "Safety Officer" },
  { email: "finance@transitops.demo", label: "Financial Analyst" },
] as const;

export function getPostLoginPath(role: string | null | undefined): string {
  switch (role) {
    case Role.FLEET_MANAGER:
    case Role.DISPATCHER:
      return "/trips";
    case Role.SAFETY_OFFICER:
      return "/drivers";
    case Role.FINANCIAL_ANALYST:
    default:
      return "/dashboard";
  }
}
