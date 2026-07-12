import { DriverStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { DriverDomainError } from "./driver.errors";
import { computeSafetyScore, toDriverListItem } from "./driver.mapper";
import type { CreateDriverInput, DriverListItem } from "./driver.types";

export async function listDrivers(): Promise<DriverListItem[]> {
  const drivers = await prisma.driver.findMany({
    include: {
      trips: {
        select: { status: true },
      },
    },
    orderBy: [{ name: "asc" }],
  });

  return drivers.map(toDriverListItem);
}

export async function createDriver(
  input: CreateDriverInput,
): Promise<DriverListItem> {
  const licenseNumber = input.licenseNumber.trim().toUpperCase();

  const existing = await prisma.driver.findUnique({
    where: { licenseNumber },
    select: { id: true },
  });

  if (existing) {
    throw new DriverDomainError(
      "DUPLICATE_LICENSE",
      `Licence number ${licenseNumber} is already registered.`,
    );
  }

  const licenseExpiryDate = new Date(input.licenseExpiryDate);
  const initialSafetyScore = computeSafetyScore({
    status: DriverStatus.AVAILABLE,
    licenseExpiryDate,
    trips: [],
  });

  const driver = await prisma.driver.create({
    data: {
      name: input.name.trim(),
      licenseNumber,
      licenseCategory: input.licenseCategory,
      licenseExpiryDate,
      contactNumber: input.contactNumber.trim(),
      safetyScore: initialSafetyScore,
      status: DriverStatus.AVAILABLE,
    },
    include: {
      trips: {
        select: { status: true },
      },
    },
  });

  return toDriverListItem(driver);
}
