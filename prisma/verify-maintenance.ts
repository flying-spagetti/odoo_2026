import "dotenv/config";

import {
  DriverStatus,
  MaintenanceStatus,
  TripStatus,
  VehicleStatus,
  VehicleType,
} from "../src/generated/prisma/client";
import { prisma } from "../src/lib/db";
import { MaintenanceDomainError } from "../src/modules/maintenance/maintenance.errors";
import {
  closeMaintenance,
  createMaintenanceRecord,
  startMaintenance,
} from "../src/modules/maintenance/maintenance.service";
import { getDispatchReadiness } from "../src/modules/trips/trip.service";

const TEMP_VEHICLE_ID = "verify-maint-vehicle";
const TEMP_DRIVER_ID = "verify-maint-driver";
const TEMP_TRIP_ID = "verify-maint-trip";
const TEMP_REGISTRATION = "VERIFY-MAINT-0001";
const TEMP_LICENSE = "VERIFY-MAINT-LIC-0001";

function assertCondition(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertMaintenanceError(
  error: unknown,
  code: MaintenanceDomainError["code"],
): asserts error is MaintenanceDomainError {
  if (!(error instanceof MaintenanceDomainError) || error.code !== code) {
    throw new Error(
      `Expected MaintenanceDomainError with code ${code}, received ${String(error)}`,
    );
  }
}

async function cleanupTemporaryData() {
  await prisma.trip.deleteMany({ where: { id: TEMP_TRIP_ID } });
  await prisma.maintenanceRecord.deleteMany({
    where: { vehicleId: TEMP_VEHICLE_ID },
  });
  await prisma.vehicle.deleteMany({ where: { id: TEMP_VEHICLE_ID } });
  await prisma.driver.deleteMany({ where: { id: TEMP_DRIVER_ID } });
}

async function main() {
  console.log("1. Preparing isolated temporary vehicle, driver, and draft trip...");
  await cleanupTemporaryData();

  await prisma.vehicle.create({
    data: {
      id: TEMP_VEHICLE_ID,
      registrationNumber: TEMP_REGISTRATION,
      name: "Verify Maint Van",
      model: "Test Van",
      type: VehicleType.VAN,
      maxLoadKg: 500,
      odometerKm: 12000,
      acquisitionCostPaise: 10000000,
      status: VehicleStatus.AVAILABLE,
      region: "Verify",
    },
  });

  await prisma.driver.create({
    data: {
      id: TEMP_DRIVER_ID,
      name: "Verify Maint Driver",
      licenseNumber: TEMP_LICENSE,
      licenseCategory: "LMV",
      licenseExpiryDate: new Date("2028-12-31"),
      contactNumber: "+91 90000 00001",
      safetyScore: 90,
      status: DriverStatus.AVAILABLE,
    },
  });

  await prisma.trip.create({
    data: {
      id: TEMP_TRIP_ID,
      source: "Verify Depot",
      destination: "Verify Hub",
      cargoWeightKg: 200,
      plannedDistanceKm: 25,
      status: TripStatus.DRAFT,
      vehicleId: TEMP_VEHICLE_ID,
      driverId: TEMP_DRIVER_ID,
    },
  });

  console.log("2. Opening maintenance on temporary vehicle...");
  const opened = await createMaintenanceRecord({
    vehicleId: TEMP_VEHICLE_ID,
    title: "Verify brake inspection",
    description: "Temporary maintenance workflow verification.",
    priority: "HIGH",
    estimatedCostPaise: 150000,
  });

  assertCondition(opened.status === MaintenanceStatus.OPEN, "Maintenance should be OPEN.");
  assertCondition(
    opened.vehicle.status === VehicleStatus.IN_SHOP,
    "Vehicle should be IN_SHOP after opening maintenance.",
  );

  const vehicleAfterOpen = await prisma.vehicle.findUnique({
    where: { id: TEMP_VEHICLE_ID },
    select: { status: true },
  });
  assertCondition(
    vehicleAfterOpen?.status === VehicleStatus.IN_SHOP,
    "Vehicle row should be IN_SHOP in database.",
  );

  console.log("3. Asserting trip readiness fails vehicle availability...");
  const readinessAfterOpen = await getDispatchReadiness(TEMP_TRIP_ID);
  const vehicleCheckAfterOpen = readinessAfterOpen.checks.find(
    (check) => check.code === "VEHICLE_AVAILABLE",
  );
  assertCondition(
    vehicleCheckAfterOpen?.passed === false,
    "VEHICLE_AVAILABLE should fail while vehicle is IN_SHOP.",
  );

  console.log("4. Starting maintenance...");
  const started = await startMaintenance(opened.id);
  assertCondition(
    started.status === MaintenanceStatus.IN_PROGRESS,
    "Maintenance should be IN_PROGRESS after start.",
  );
  assertCondition(Boolean(started.startedAt), "startedAt should be set.");

  console.log("5. Closing maintenance...");
  const closed = await closeMaintenance(opened.id, { actualCostPaise: 175000 });
  assertCondition(closed.status === MaintenanceStatus.CLOSED, "Maintenance should be CLOSED.");
  assertCondition(Boolean(closed.completedAt), "completedAt should be set.");
  assertCondition(
    closed.actualCostPaise === 175000,
    "actualCostPaise should be persisted.",
  );

  const vehicleAfterClose = await prisma.vehicle.findUnique({
    where: { id: TEMP_VEHICLE_ID },
    select: { status: true },
  });
  assertCondition(
    vehicleAfterClose?.status === VehicleStatus.AVAILABLE,
    "Vehicle should return to AVAILABLE after closing maintenance.",
  );

  console.log("6. Asserting trip readiness passes vehicle availability again...");
  const readinessAfterClose = await getDispatchReadiness(TEMP_TRIP_ID);
  const vehicleCheckAfterClose = readinessAfterClose.checks.find(
    (check) => check.code === "VEHICLE_AVAILABLE",
  );
  assertCondition(
    vehicleCheckAfterClose?.passed === true,
    "VEHICLE_AVAILABLE should pass after vehicle returns to AVAILABLE.",
  );

  console.log("7. Blocking a second active maintenance record...");
  const reopened = await createMaintenanceRecord({
    vehicleId: TEMP_VEHICLE_ID,
    title: "Verify second maintenance",
    description: "Should block while another record is active.",
    priority: "MEDIUM",
  });
  await startMaintenance(reopened.id);

  try {
    await createMaintenanceRecord({
      vehicleId: TEMP_VEHICLE_ID,
      title: "Duplicate active maintenance",
      description: "This must be rejected.",
      priority: "LOW",
    });
    throw new Error("Expected ACTIVE_MAINTENANCE_EXISTS when creating duplicate active maintenance.");
  } catch (error) {
    assertMaintenanceError(error, "ACTIVE_MAINTENANCE_EXISTS");
  }

  await closeMaintenance(reopened.id);

  console.log("8. Blocking maintenance on an ON_TRIP vehicle...");
  await prisma.vehicle.update({
    where: { id: TEMP_VEHICLE_ID },
    data: { status: VehicleStatus.ON_TRIP },
  });

  try {
    await createMaintenanceRecord({
      vehicleId: TEMP_VEHICLE_ID,
      title: "On-trip maintenance attempt",
      description: "This must be rejected.",
      priority: "LOW",
    });
    throw new Error("Expected VEHICLE_ON_TRIP when vehicle is ON_TRIP.");
  } catch (error) {
    assertMaintenanceError(error, "VEHICLE_ON_TRIP");
  }

  console.log("All maintenance backend checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await cleanupTemporaryData();
    await prisma.$disconnect();
  });
