import { Box } from "@chakra-ui/react";
import { VehicleDirectory } from "@/modules/vehicles/VehicleDirectory";

export default function VehiclesPage() {
  return (
    <Box px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
      <VehicleDirectory />
    </Box>
  );
}
