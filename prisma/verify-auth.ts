import "dotenv/config";

import { Role } from "../src/generated/prisma/client";
import { auth } from "../src/lib/auth/auth";
import { prisma } from "../src/lib/db";
import { DEMO_PASSWORD } from "./seed-auth";
import { getDispatchReadiness } from "../src/modules/trips/trip.service";

const SEED_TRIP_ID = "seed-trip-draft";

async function signIn(email: string) {
  const response = await auth.api.signInEmail({
    body: {
      email,
      password: DEMO_PASSWORD,
    },
    asResponse: true,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sign-in failed for ${email}: ${response.status} ${body}`);
  }

  return response.headers.getSetCookie?.() ?? [response.headers.get("set-cookie") ?? ""];
}

async function getSessionFromCookies(setCookies: string[]) {
  const cookie = setCookies
    .map((entry) => entry.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");

  const session = await auth.api.getSession({
    headers: new Headers({ cookie }),
  });

  return { cookie, session };
}

async function verifyRoleFromDatabase(email: string, expectedRole: Role) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (!user || user.role !== expectedRole) {
    throw new Error(`Expected ${email} to have role ${expectedRole}.`);
  }
}

async function main() {
  console.log("1. Verifying demo account roles in database...");
  await verifyRoleFromDatabase("fleet@transitops.demo", Role.FLEET_MANAGER);
  await verifyRoleFromDatabase("dispatcher@transitops.demo", Role.DISPATCHER);
  await verifyRoleFromDatabase("safety@transitops.demo", Role.SAFETY_OFFICER);
  await verifyRoleFromDatabase("finance@transitops.demo", Role.FINANCIAL_ANALYST);

  console.log("2. Verifying dispatcher email/password sign-in...");
  const dispatcherCookies = await signIn("dispatcher@transitops.demo");
  const dispatcherSession = await getSessionFromCookies(dispatcherCookies);

  if (!dispatcherSession.session?.user) {
    throw new Error("Dispatcher session was not created.");
  }

  console.log("3. Verifying finance email/password sign-in...");
  const financeCookies = await signIn("finance@transitops.demo");
  const financeSession = await getSessionFromCookies(financeCookies);

  if (!financeSession.session?.user) {
    throw new Error("Finance session was not created.");
  }

  console.log("4. Verifying trip readiness can be read for seeded draft trip...");
  const readiness = await getDispatchReadiness(SEED_TRIP_ID);
  console.log(`   Readiness ready=${readiness.ready}, checks=${readiness.checks.length}`);

  console.log("5. Verifying RBAC role mapping...");
  const dispatcherRole = await prisma.user.findUnique({
    where: { id: dispatcherSession.session.user.id },
    select: { role: true },
  });
  const financeRole = await prisma.user.findUnique({
    where: { id: financeSession.session.user.id },
    select: { role: true },
  });

  const mutationRoles: Role[] = [Role.FLEET_MANAGER, Role.DISPATCHER];
  if (!dispatcherRole || !mutationRoles.includes(dispatcherRole.role)) {
    throw new Error("Dispatcher should be allowed to mutate trips.");
  }

  if (!financeRole || mutationRoles.includes(financeRole.role)) {
    throw new Error("Financial analyst should not be allowed to mutate trips.");
  }

  console.log("All authentication backend checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
