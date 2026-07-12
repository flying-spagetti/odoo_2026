"use client";

import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { LuTruck } from "react-icons/lu";

export function LoginBrandingPanel() {
  return (
    <Flex
      direction="column"
      justify="space-between"
      bg="gray.50"
      borderRightWidth={{ md: "1px" }}
      borderColor="gray.200"
      px={{ base: "6", md: "10", lg: "12" }}
      py={{ base: "8", md: "10" }}
      minH={{ base: "auto", md: "100vh" }}
      flex="1"
    >
      <VStack align="stretch" gap="6">
        <Flex align="center" gap="3">
          <Flex
            align="center"
            justify="center"
            boxSize="10"
            bg="blue.600"
            borderRadius="md"
            color="white"
            flexShrink={0}
          >
            <Icon as={LuTruck} boxSize="5" aria-hidden />
          </Flex>
          <Box>
            <Heading size="lg" letterSpacing="tight" color="gray.900">
              TransitOps
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Transport operations platform
            </Text>
          </Box>
        </Flex>

        <Box maxW="sm">
          <Text fontSize="sm" color="gray.700" lineHeight="1.6">
            Sign in to manage fleet resources, dispatch trips, and monitor
            operational activity across your transport network.
          </Text>
        </Box>
      </VStack>

      <Text fontSize="xs" color="gray.500" mt="8">
        TransitOps © 2026
      </Text>
    </Flex>
  );
}
