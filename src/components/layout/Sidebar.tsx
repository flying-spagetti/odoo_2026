"use client";

import { Box, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      aria-label="Main navigation"
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      w="64"
      flexShrink={0}
      bg="bg"
      borderRightWidth="1px"
      borderColor="border.muted"
      position="sticky"
      top="0"
      h="100vh"
      overflowY="auto"
    >
      <Flex align="center" h="16" px="5" borderBottomWidth="1px" borderColor="border.muted">
        <Heading size="md" color="blue.600" letterSpacing="tight">
          TransitOps
        </Heading>
      </Flex>

      <VStack align="stretch" gap="1" p="3" flex="1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link key={item.href} href={item.href}>
              <Flex
                align="center"
                gap="3"
                px="3"
                py="2.5"
                borderRadius="md"
                fontSize="sm"
                fontWeight={isActive ? "semibold" : "medium"}
                color={isActive ? "blue.700" : "fg.muted"}
                bg={isActive ? "blue.50" : "transparent"}
                _hover={{
                  bg: isActive ? "blue.50" : "bg.muted",
                  color: isActive ? "blue.700" : "fg",
                }}
                transition="background 0.15s, color 0.15s"
              >
                <Icon as={item.icon} boxSize="4" />
                <Text>{item.label}</Text>
              </Flex>
            </Link>
          );
        })}
      </VStack>

      <Box px="5" py="4" borderTopWidth="1px" borderColor="border.muted">
        <Text fontSize="xs" color="fg.subtle">
          Transport Operations
        </Text>
      </Box>
    </Box>
  );
}
