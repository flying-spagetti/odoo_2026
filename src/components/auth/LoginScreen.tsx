import { Flex } from "@chakra-ui/react";
import { LoginBrandingPanel } from "./LoginBrandingPanel";
import { LoginForm } from "./LoginForm";

export function LoginScreen() {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      minH="100vh"
      w="full"
    >
      <LoginBrandingPanel />
      <LoginForm />
    </Flex>
  );
}
