import { Role } from "@/generated/prisma/enums";

export interface RoleOption {
  value: Role;
  label: string;
  demoEmail: string;
  accessScope: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: Role.FLEET_MANAGER,
    label: "Fleet Manager",
    demoEmail: "fleet@transitops.demo",
    accessScope: "Fleet, Maintenance",
  },
  {
    value: Role.DISPATCHER,
    label: "Dispatcher",
    demoEmail: "dispatcher@transitops.demo",
    accessScope: "Dashboard, Trips",
  },
  {
    value: Role.SAFETY_OFFICER,
    label: "Safety Officer",
    demoEmail: "safety@transitops.demo",
    accessScope: "Drivers, Compliance",
  },
  {
    value: Role.FINANCIAL_ANALYST,
    label: "Financial Analyst",
    demoEmail: "finance@transitops.demo",
    accessScope: "Fuel & Expenses, Analytics",
  },
];

export const DEFAULT_ROLE = Role.DISPATCHER;

export function getRoleOption(role: Role): RoleOption {
  return (
    ROLE_OPTIONS.find((option) => option.value === role) ?? ROLE_OPTIONS[0]
  );
}

export function isDemoEmail(email: string): boolean {
  return ROLE_OPTIONS.some((option) => option.demoEmail === email);
}
