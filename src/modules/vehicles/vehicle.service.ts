import { VehicleStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { rupeesToPaise } from "@/lib/utils/format";
import { VehicleDomainError } from "./vehicle.errors";
import { toVehicleListItem } from "./vehicle.mapper";
import type { CreateVehicleInput, VehicleListItem } from "./vehicle.types";

export async function listVehicles(): Promise<VehicleListItem[]> {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [{ registrationNumber: "asc" }],
  });

  return vehicles.map(toVehicleListItem);
}

export async function createVehicle(
  input: CreateVehicleInput,
): Promise<VehicleListItem> {
  const registrationNumber = input.registrationNumber.trim().toUpperCase();

  const existing = await prisma.vehicle.findUnique({
    where: { registrationNumber },
    select: { id: true },
  });

  if (existing) {
    throw new VehicleDomainError(
      "DUPLICATE_REGISTRATION",
      `Registration number ${registrationNumber} is already registered.`,
    );
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      registrationNumber,
      name: input.name.trim(),
      model: input.model.trim(),
      type: input.type,
      maxLoadKg: input.maxLoadKg,
      odometerKm: input.odometerKm,
      acquisitionCostPaise: rupeesToPaise(input.acquisitionCostRupees),
      status: VehicleStatus.AVAILABLE,
      region: input.region?.trim() || null,
    },
  });

  return toVehicleListItem(vehicle);
}
