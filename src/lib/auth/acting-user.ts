import { cache } from "react";
import { headers } from "next/headers";
import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { TripDomainError } from "@/modules/trips/trip.errors";
import { auth } from "./auth";

export type ActingUser = {
  id: string;
  role: Role;
};

const OPERATIONAL_ROLES: Role[] = [
  Role.FLEET_MANAGER,
  Role.DISPATCHER,
  Role.SAFETY_OFFICER,
  Role.FINANCIAL_ANALYST,
];

const TRIP_MUTATION_ROLES: Role[] = [Role.FLEET_MANAGER, Role.DISPATCHER];
const FLEET_MANAGER_ROLE = Role.FLEET_MANAGER;

async function resolveActingUser(): Promise<ActingUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  return user;
}

export const getActingUser = cache(resolveActingUser);

export async function requireAuthenticatedUser(): Promise<ActingUser> {
  const user = await getActingUser();

  if (!user) {
    throw new TripDomainError(
      "UNAUTHORIZED",
      "Authentication is required.",
    );
  }

  return user;
}

export async function requireAuthenticatedOperationalUser(): Promise<ActingUser> {
  const user = await requireAuthenticatedUser();

  if (!OPERATIONAL_ROLES.includes(user.role)) {
    throw new TripDomainError(
      "FORBIDDEN",
      "You do not have access to trip operations.",
    );
  }

  return user;
}

export async function requireTripMutationRole(): Promise<ActingUser> {
  const user = await requireAuthenticatedUser();

  if (!TRIP_MUTATION_ROLES.includes(user.role)) {
    throw new TripDomainError(
      "FORBIDDEN",
      "You do not have permission to modify trips.",
    );
  }

  return user;
}

export async function requireFleetManagerRole(): Promise<ActingUser> {
  const user = await requireAuthenticatedUser();

  if (user.role !== FLEET_MANAGER_ROLE) {
    throw new TripDomainError(
      "FORBIDDEN",
      "You do not have permission to perform this action.",
    );
  }

  return user;
}
