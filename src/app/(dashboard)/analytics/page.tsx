import { Box } from "@chakra-ui/react";
import { AnalyticsContent } from "@/modules/analytics/AnalyticsContent";

export default function AnalyticsPage() {
  return (
    <Box px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
      <AnalyticsContent />
    </Box>
  );
}
