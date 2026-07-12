import { Box } from "@chakra-ui/react";
import { SettingsContent } from "@/modules/settings/SettingsContent";

export default function SettingsPage() {
  return (
    <Box px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
      <SettingsContent />
    </Box>
  );
}
