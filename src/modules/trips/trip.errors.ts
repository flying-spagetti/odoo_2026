export type TripErrorCode =
  | "TRIP_NOT_FOUND"
  | "INVALID_TRIP_STATE"
  | "DISPATCH_BLOCKED"
  | "VEHICLE_UNAVAILABLE"
  | "DRIVER_UNAVAILABLE"
  | "INVALID_ODOMETER";

export class TripDomainError extends Error {
  readonly code: TripErrorCode;

  constructor(code: TripErrorCode, message: string) {
    super(message);
    this.name = "TripDomainError";
    this.code = code;
  }
}
