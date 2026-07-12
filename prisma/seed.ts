import "dotenv/config";

import {
  DriverStatus,
  ExpenseType,
  MaintenanceStatus,
  PrismaClient,
  TripStatus,
  VehicleStatus,
  VehicleType,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const SEED_TRIP_ID = "seed-trip-draft";
const SEED_TRIP_BLOCKED_ID = "seed-trip-blocked";
const SEED_TRIP_DISPATCHED_ID = "seed-trip-dispatched";
const SEED_TRIP_CANCELLED_ID = "seed-trip-cancelled";
const SEED_MAINTENANCE_ID = "seed-maint-truck09";
const SEED_FUEL_LOG_ID = "seed-fuel-van05";
const SEED_EXPENSE_ID = "seed-expense-toll";

function createSeedClient(): PrismaClient {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

async function main() {
  const prisma = createSeedClient();

  try {
    const van05 = await prisma.vehicle.upsert({
      where: { registrationNumber: "AP31TV5005" },
      update: {
        name: "Van-05",
        model: "Transit Custom",
        type: VehicleType.VAN,
        maxLoadKg: 500,
        odometerKm: 48210,
        acquisitionCostPaise: 185000000,
        status: VehicleStatus.AVAILABLE,
        region: "Andhra Pradesh",
      },
      create: {
        registrationNumber: "AP31TV5005",
        name: "Van-05",
        model: "Transit Custom",
        type: VehicleType.VAN,
        maxLoadKg: 500,
        odometerKm: 48210,
        acquisitionCostPaise: 185000000,
        status: VehicleStatus.AVAILABLE,
        region: "Andhra Pradesh",
      },
    });

    const truck09 = await prisma.vehicle.upsert({
      where: { registrationNumber: "AP31TR9009" },
      update: {
        name: "Truck-09",
        model: "Ashok Leyland 1616",
        type: VehicleType.TRUCK,
        maxLoadKg: 1200,
        odometerKm: 126540,
        acquisitionCostPaise: 420000000,
        status: VehicleStatus.IN_SHOP,
        region: "Andhra Pradesh",
      },
      create: {
        registrationNumber: "AP31TR9009",
        name: "Truck-09",
        model: "Ashok Leyland 1616",
        type: VehicleType.TRUCK,
        maxLoadKg: 1200,
        odometerKm: 126540,
        acquisitionCostPaise: 420000000,
        status: VehicleStatus.IN_SHOP,
        region: "Andhra Pradesh",
      },
    });

    const mini21 = await prisma.vehicle.upsert({
      where: { registrationNumber: "AP39MN2121" },
      update: {
        name: "Mini-21",
        model: "Tata Ace Gold",
        type: VehicleType.VAN,
        maxLoadKg: 350,
        odometerKm: 31880,
        acquisitionCostPaise: 95000000,
        status: VehicleStatus.AVAILABLE,
        region: "Andhra Pradesh",
      },
      create: {
        registrationNumber: "AP39MN2121",
        name: "Mini-21",
        model: "Tata Ace Gold",
        type: VehicleType.VAN,
        maxLoadKg: 350,
        odometerKm: 31880,
        acquisitionCostPaise: 95000000,
        status: VehicleStatus.AVAILABLE,
        region: "Andhra Pradesh",
      },
    });

    await prisma.vehicle.upsert({
      where: { registrationNumber: "TS09CG1212" },
      update: {
        name: "Cargo-12",
        model: "Eicher Pro 6035",
        type: VehicleType.TRUCK,
        maxLoadKg: 2000,
        odometerKm: 214300,
        acquisitionCostPaise: 680000000,
        status: VehicleStatus.RETIRED,
        region: "Telangana",
      },
      create: {
        registrationNumber: "TS09CG1212",
        name: "Cargo-12",
        model: "Eicher Pro 6035",
        type: VehicleType.TRUCK,
        maxLoadKg: 2000,
        odometerKm: 214300,
        acquisitionCostPaise: 680000000,
        status: VehicleStatus.RETIRED,
        region: "Telangana",
      },
    });

    const alexKumar = await prisma.driver.upsert({
      where: { licenseNumber: "AP-DL-2021-004512" },
      update: {
        name: "Alex Kumar",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2027-12-31"),
        contactNumber: "+91 98765 43210",
        safetyScore: 92,
        status: DriverStatus.AVAILABLE,
      },
      create: {
        name: "Alex Kumar",
        licenseNumber: "AP-DL-2021-004512",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2027-12-31"),
        contactNumber: "+91 98765 43210",
        safetyScore: 92,
        status: DriverStatus.AVAILABLE,
      },
    });

    const raviSharma = await prisma.driver.upsert({
      where: { licenseNumber: "AP-DL-2018-009871" },
      update: {
        name: "Ravi Sharma",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2024-06-30"),
        contactNumber: "+91 98480 11223",
        safetyScore: 78,
        status: DriverStatus.AVAILABLE,
      },
      create: {
        name: "Ravi Sharma",
        licenseNumber: "AP-DL-2018-009871",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2024-06-30"),
        contactNumber: "+91 98480 11223",
        safetyScore: 78,
        status: DriverStatus.AVAILABLE,
      },
    });

    await prisma.driver.upsert({
      where: { licenseNumber: "TS-DL-2020-003344" },
      update: {
        name: "Priya Reddy",
        licenseCategory: "LMV",
        licenseExpiryDate: new Date("2028-03-15"),
        contactNumber: "+91 90123 44556",
        safetyScore: 88,
        status: DriverStatus.SUSPENDED,
      },
      create: {
        name: "Priya Reddy",
        licenseNumber: "TS-DL-2020-003344",
        licenseCategory: "LMV",
        licenseExpiryDate: new Date("2028-03-15"),
        contactNumber: "+91 90123 44556",
        safetyScore: 88,
        status: DriverStatus.SUSPENDED,
      },
    });

    const arjunNaidu = await prisma.driver.upsert({
      where: { licenseNumber: "AP-DL-2019-007890" },
      update: {
        name: "Arjun Naidu",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2027-08-20"),
        contactNumber: "+91 99887 66554",
        safetyScore: 85,
        status: DriverStatus.OFF_DUTY,
      },
      create: {
        name: "Arjun Naidu",
        licenseNumber: "AP-DL-2019-007890",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2027-08-20"),
        contactNumber: "+91 99887 66554",
        safetyScore: 85,
        status: DriverStatus.OFF_DUTY,
      },
    });

    await prisma.trip.upsert({
      where: { id: SEED_TRIP_ID },
      update: {
        source: "Gandhinagar Depot",
        destination: "Ahmedabad Hub",
        cargoWeightKg: 420,
        plannedDistanceKm: 38,
        status: TripStatus.DRAFT,
        vehicleId: van05.id,
        driverId: alexKumar.id,
        dispatchedAt: null,
        completedAt: null,
        cancelledAt: null,
      },
      create: {
        id: SEED_TRIP_ID,
        source: "Gandhinagar Depot",
        destination: "Ahmedabad Hub",
        cargoWeightKg: 420,
        plannedDistanceKm: 38,
        status: TripStatus.DRAFT,
        vehicleId: van05.id,
        driverId: alexKumar.id,
      },
    });

    await prisma.trip.upsert({
      where: { id: SEED_TRIP_BLOCKED_ID },
      update: {
        source: "Gandhinagar Depot",
        destination: "Ahmedabad Hub",
        cargoWeightKg: 700,
        plannedDistanceKm: 38,
        status: TripStatus.DRAFT,
        vehicleId: van05.id,
        driverId: alexKumar.id,
        dispatchedAt: null,
        completedAt: null,
        cancelledAt: null,
      },
      create: {
        id: SEED_TRIP_BLOCKED_ID,
        source: "Gandhinagar Depot",
        destination: "Ahmedabad Hub",
        cargoWeightKg: 700,
        plannedDistanceKm: 38,
        status: TripStatus.DRAFT,
        vehicleId: van05.id,
        driverId: alexKumar.id,
      },
    });

    await prisma.vehicle.update({
      where: { id: mini21.id },
      data: { status: VehicleStatus.ON_TRIP },
    });

    await prisma.driver.update({
      where: { id: raviSharma.id },
      data: { status: DriverStatus.ON_TRIP },
    });

    await prisma.trip.upsert({
      where: { id: SEED_TRIP_DISPATCHED_ID },
      update: {
        source: "Vatva Industrial Estate",
        destination: "Surat Logistics Park",
        cargoWeightKg: 280,
        plannedDistanceKm: 265,
        status: TripStatus.DISPATCHED,
        vehicleId: mini21.id,
        driverId: raviSharma.id,
        dispatchedAt: new Date("2026-07-12T06:30:00.000Z"),
        completedAt: null,
        cancelledAt: null,
      },
      create: {
        id: SEED_TRIP_DISPATCHED_ID,
        source: "Vatva Industrial Estate",
        destination: "Surat Logistics Park",
        cargoWeightKg: 280,
        plannedDistanceKm: 265,
        status: TripStatus.DISPATCHED,
        vehicleId: mini21.id,
        driverId: raviSharma.id,
        dispatchedAt: new Date("2026-07-12T06:30:00.000Z"),
      },
    });

    await prisma.trip.upsert({
      where: { id: SEED_TRIP_CANCELLED_ID },
      update: {
        source: "Mansa",
        destination: "Kalol Depot",
        cargoWeightKg: 600,
        plannedDistanceKm: 52,
        status: TripStatus.CANCELLED,
        vehicleId: truck09.id,
        driverId: arjunNaidu.id,
        dispatchedAt: null,
        completedAt: null,
        cancelledAt: new Date("2026-07-11T14:20:00.000Z"),
      },
      create: {
        id: SEED_TRIP_CANCELLED_ID,
        source: "Mansa",
        destination: "Kalol Depot",
        cargoWeightKg: 600,
        plannedDistanceKm: 52,
        status: TripStatus.CANCELLED,
        vehicleId: truck09.id,
        driverId: arjunNaidu.id,
        cancelledAt: new Date("2026-07-11T14:20:00.000Z"),
      },
    });

    await prisma.maintenanceRecord.upsert({
      where: { id: SEED_MAINTENANCE_ID },
      update: {
        vehicleId: truck09.id,
        title: "Brake system overhaul",
        description: "Replace worn brake pads and inspect hydraulic lines.",
        priority: "HIGH",
        status: MaintenanceStatus.OPEN,
        estimatedCostPaise: 2850000,
      },
      create: {
        id: SEED_MAINTENANCE_ID,
        vehicleId: truck09.id,
        title: "Brake system overhaul",
        description: "Replace worn brake pads and inspect hydraulic lines.",
        priority: "HIGH",
        status: MaintenanceStatus.OPEN,
        estimatedCostPaise: 2850000,
      },
    });

    await prisma.fuelLog.upsert({
      where: { id: SEED_FUEL_LOG_ID },
      update: {
        vehicleId: van05.id,
        liters: 42.5,
        costPaise: 456750,
        odometerKm: 48160,
        loggedAt: new Date("2026-07-08T09:30:00.000Z"),
      },
      create: {
        id: SEED_FUEL_LOG_ID,
        vehicleId: van05.id,
        liters: 42.5,
        costPaise: 456750,
        odometerKm: 48160,
        loggedAt: new Date("2026-07-08T09:30:00.000Z"),
      },
    });

    await prisma.expense.upsert({
      where: { id: SEED_EXPENSE_ID },
      update: {
        vehicleId: van05.id,
        tripId: SEED_TRIP_ID,
        type: ExpenseType.TOLL,
        description: "NH-65 toll plaza, Hyderabad outbound",
        amountPaise: 32500,
        incurredAt: new Date("2026-07-07T14:15:00.000Z"),
      },
      create: {
        id: SEED_EXPENSE_ID,
        vehicleId: van05.id,
        tripId: SEED_TRIP_ID,
        type: ExpenseType.TOLL,
        description: "NH-65 toll plaza, Hyderabad outbound",
        amountPaise: 32500,
        incurredAt: new Date("2026-07-07T14:15:00.000Z"),
      },
    });

    console.log("Seeded 4 vehicles, 4 drivers, and 4 trips for the live board.");
    console.log("Run `npm run db:seed-auth` to provision Better Auth demo accounts.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
