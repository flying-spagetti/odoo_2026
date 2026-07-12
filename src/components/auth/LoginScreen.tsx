"use client";

import { Box, Flex } from "@chakra-ui/react";
import { LoginBrandingPanel } from "./LoginBrandingPanel";
import { LoginForm } from "./LoginForm";

export function LoginScreen() {
  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      minH="100dvh"
      w="full"
      bg="gray.50"
      overflow={{ base: "visible", lg: "hidden" }}
    >
      <Box
        display={{ base: "block", lg: "flex" }}
        position={{ base: "relative", lg: "sticky" }}
        top="0"
        flex={{ lg: "0 0 42%" }}
        minW={{ lg: "420px" }}
        maxW={{ lg: "680px" }}
        minH={{ base: "auto", lg: "100dvh" }}
      >
        <LoginBrandingPanel />
      </Box>

      <Flex
        flex="1"
        minW="0"
        minH={{ base: "auto", lg: "100dvh" }}
        align="stretch"
        position="relative"
      >
        <LoginForm />
      </Flex>
    </Flex>
  );
}