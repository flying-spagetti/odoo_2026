"use client";

import { Box, Flex } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Flex minH="100vh" bg="gray.950">
      <Sidebar />
      <Flex direction="column" flex="1" minW="0">
        <TopHeader />
        <Box as="main" flex="1" overflow="auto" bg="gray.950">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
