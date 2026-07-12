import "dotenv/config";

import { Role } from "../src/generated/prisma/client";
import { auth } from "../src/lib/auth/auth";
import { prisma } from "../src/lib/db";

export const DEMO_PASSWORD = "TransitOps123!";

const DEMO_ACCOUNTS = [
  {
    email: "fleet@transitops.demo",
    name: "Fleet Manager",
    role: Role.FLEET_MANAGER,
  },
  {
    email: "dispatcher@transitops.demo",
    name: "Dispatcher",
    role: Role.DISPATCHER,
  },
  {
    email: "safety@transitops.demo",
    name: "Safety Officer",
    role: Role.SAFETY_OFFICER,
  },
  {
    email: "finance@transitops.demo",
    name: "Financial Analyst",
    role: Role.FINANCIAL_ANALYST,
  },
] as const;

async function provisionDemoUser(account: (typeof DEMO_ACCOUNTS)[number]) {
  const existing = await prisma.user.findUnique({
    where: { email: account.email },
    select: { id: true },
  });

  if (!existing) {
    const result = await auth.api.signUpEmail({
      body: {
        email: account.email,
        password: DEMO_PASSWORD,
        name: account.name,
      },
    });

    if (!result.user) {
      throw new Error(`Failed to create demo account for ${account.email}.`);
    }
  }

  await prisma.user.update({
    where: { email: account.email },
    data: { role: account.role },
  });
}

async function main() {
  for (const account of DEMO_ACCOUNTS) {
    await provisionDemoUser(account);
  }

  console.log(`Provisioned ${DEMO_ACCOUNTS.length} demo accounts.`);
  console.log(`Demo password for all accounts: ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
