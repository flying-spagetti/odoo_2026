import { Box } from "@chakra-ui/react";
import { MaintenanceContent } from "@/modules/maintenance/MaintenanceContent";

export default function MaintenancePage() {
  return (
    <Box px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
      <MaintenanceContent />
    </Box>
  );
}
