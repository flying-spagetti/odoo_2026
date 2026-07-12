"use client";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import {
  canMutateTripsAction,
  cancelTripAction,
  completeTripAction,
  dispatchTripAction,
  getDispatchReadinessAction,
  getTripDetailAction,
  listLiveBoardTripsAction,
} from "./trip.actions";
import { CancelTripDialog } from "./components/CancelTripDialog";
import { LiveTripBoard } from "./components/LiveTripBoard";
import { TripDispatchPanel } from "./components/TripDispatchPanel";
import type {
  DispatchReadiness,
  TripBoardItem,
  TripDetailView,
  TripFailure,
} from "./trip.types";

export function TripDispatcher() {
  const [trips, setTrips] = useState<TripBoardItem[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [tripDetail, setTripDetail] = useState<TripDetailView | null>(null);
  const [readiness, setReadiness] = useState<DispatchReadiness | null>(null);
  const [dispatchFailure, setDispatchFailure] = useState<TripFailure | null>(
    null,
  );
  const [completeFailure, setCompleteFailure] = useState<TripFailure | null>(
    null,
  );
  const [cancelFailure, setCancelFailure] = useState<TripFailure | null>(null);
  const [canMutate, setCanMutate] = useState(false);
  const [isBoardLoading, setIsBoardLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isReadinessLoading, setIsReadinessLoading] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [boardError, setBoardError] = useState<string | null>(null);

  const isMutating = isDispatching || isCompleting || isCancelling;

  useEffect(() => {
    canMutateTripsAction().then(setCanMutate);
  }, []);

  const loadBoard = useCallback(async () => {
    setIsBoardLoading(true);
    setBoardError(null);

    const result = await listLiveBoardTripsAction();

    if (!result.success) {
      setBoardError(result.error.message);
      setTrips([]);
      setIsBoardLoading(false);
      return [];
    }

    setTrips(result.data);
    setIsBoardLoading(false);
    return result.data;
  }, []);

  const loadTripDetail = useCallback(async (tripId: string) => {
    setIsDetailLoading(true);
    setIsReadinessLoading(true);
    setDispatchFailure(null);
    setCompleteFailure(null);
    setCancelFailure(null);

    const [detailResult, readinessResult] = await Promise.all([
      getTripDetailAction(tripId),
      getDispatchReadinessAction(tripId),
    ]);

    if (detailResult.success) {
      setTripDetail(detailResult.data);
    } else {
      setTripDetail(null);
      toaster.error({
        title: "Unable to load trip",
        description: detailResult.error.message,
      });
    }

    if (readinessResult.success) {
      setReadiness(readinessResult.data);
    } else {
      setReadiness(null);
    }

    setIsDetailLoading(false);
    setIsReadinessLoading(false);
  }, []);

  const refreshAll = useCallback(
    async (preferredTripId?: string | null) => {
      const board = await loadBoard();
      const tripId = preferredTripId ?? selectedTripId;

      if (tripId && board.some((trip) => trip.id === tripId)) {
        await loadTripDetail(tripId);
        return;
      }

      const firstDraft = board.find((trip) => trip.status === "DRAFT");
      const nextSelection = firstDraft?.id ?? board[0]?.id ?? null;
      setSelectedTripId(nextSelection);

      if (nextSelection) {
        await loadTripDetail(nextSelection);
      } else {
        setTripDetail(null);
        setReadiness(null);
      }
    },
    [loadBoard, loadTripDetail, selectedTripId],
  );

  useEffect(() => {
    void (async () => {
      const board = await loadBoard();
      const firstDraft = board.find((trip) => trip.status === "DRAFT");
      const initialSelection = firstDraft?.id ?? board[0]?.id ?? null;
      setSelectedTripId(initialSelection);

      if (initialSelection) {
        await loadTripDetail(initialSelection);
      }
    })();
  }, [loadBoard, loadTripDetail]);

  const handleSelectTrip = async (tripId: string) => {
    if (isMutating) {
      return;
    }

    setSelectedTripId(tripId);
    await loadTripDetail(tripId);
  };

  const handleDispatch = async () => {
    if (!selectedTripId || isMutating) {
      return;
    }

    setIsDispatching(true);
    setDispatchFailure(null);

    const result = await dispatchTripAction(selectedTripId);

    if (!result.success) {
      setDispatchFailure(result.error);

      if (result.error.details?.readiness) {
        setReadiness(result.error.details.readiness);
      }

      toaster.error({
        title: "Dispatch blocked",
        description: result.error.message,
      });
      setIsDispatching(false);
      return;
    }

    toaster.success({
      title: "Trip dispatched",
      description: "Vehicle and driver statuses updated to On Trip.",
    });

    await refreshAll(selectedTripId);
    setIsDispatching(false);
  };

  const handleComplete = async (finalOdometerKm: number) => {
    if (!selectedTripId || isMutating) {
      return;
    }

    setIsCompleting(true);
    setCompleteFailure(null);

    const result = await completeTripAction(selectedTripId, { finalOdometerKm });

    if (!result.success) {
      setCompleteFailure(result.error);
      toaster.error({
        title:
          result.error.code === "INVALID_ODOMETER"
            ? "Invalid odometer"
            : "Unable to complete trip",
        description: result.error.message,
      });
      setIsCompleting(false);
      return;
    }

    toaster.success({
      title: "Trip completed",
      description: "Vehicle and driver restored to Available.",
    });

    await refreshAll(selectedTripId);
    setIsCompleting(false);
  };

  const handleCancelConfirm = async () => {
    if (!selectedTripId || isMutating) {
      return;
    }

    setIsCancelling(true);
    setCancelFailure(null);

    const result = await cancelTripAction(selectedTripId);

    if (!result.success) {
      setCancelFailure(result.error);
      toaster.error({
        title: "Cancellation failed",
        description: result.error.message,
      });
      setIsCancelling(false);
      return;
    }

    setCancelDialogOpen(false);
    toaster.success({
      title: "Trip cancelled",
      description:
        tripDetail?.status === "DISPATCHED"
          ? "Vehicle and driver restored to Available."
          : "Trip removed from active dispatch workflow.",
    });

    await refreshAll(selectedTripId);
    setIsCancelling(false);
  };

  return (
    <>
      <Grid
        templateColumns={{ base: "1fr", xl: "minmax(0, 2fr) minmax(0, 3fr)" }}
        gap={{ base: "5", xl: "6" }}
        alignItems="start"
      >
        <Flex direction="column" gap="4" minW="0">
          <TripDispatchPanel
            trip={tripDetail}
            readiness={readiness}
            dispatchFailure={dispatchFailure}
            completeFailure={completeFailure}
            cancelFailure={cancelFailure}
            isLoading={isDetailLoading && !tripDetail}
            isReadinessLoading={isReadinessLoading}
            isMutating={isMutating}
            isDispatching={isDispatching}
            isCompleting={isCompleting}
            canMutate={canMutate}
            onDispatch={handleDispatch}
            onComplete={handleComplete}
            onCancelRequest={() => {
              setCancelFailure(null);
              setCancelDialogOpen(true);
            }}
          />
        </Flex>

        <Flex direction="column" gap="4" minW="0">
          {boardError ? (
            <Box
              borderWidth="1px"
              borderColor="red.700"
              borderRadius="md"
              bg="red.950"
              p="4"
            >
              <Text fontSize="sm" color="red.200">
                {boardError}
              </Text>
            </Box>
          ) : (
            <LiveTripBoard
              trips={trips}
              selectedTripId={selectedTripId}
              isLoading={isBoardLoading}
              onSelectTrip={handleSelectTrip}
            />
          )}
        </Flex>
      </Grid>

      <CancelTripDialog
        trip={tripDetail}
        open={cancelDialogOpen}
        isCancelling={isCancelling}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelConfirm}
      />
    </>
  );
}
