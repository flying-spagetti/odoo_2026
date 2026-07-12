import { Box } from "@chakra-ui/react";
import { ExpensesContent } from "@/modules/expenses/ExpensesContent";

export default function ExpensesPage() {
  return (
    <Box px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
      <ExpensesContent />
    </Box>
  );
}
