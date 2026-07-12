"use client";

import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  LuChartNoAxesCombined,
  LuRoute,
  LuShieldCheck,
  LuTruck,
  LuWrench,
} from "react-icons/lu";

const capabilities = [
  {
    icon: LuRoute,
    title: "Safer dispatch",
    description: "Validate vehicles, drivers, licences, and cargo before release.",
  },
  {
    icon: LuWrench,
    title: "Connected maintenance",
    description: "Keep vehicles under service out of the dispatch pool automatically.",
  },
  {
    icon: LuChartNoAxesCombined,
    title: "Operational visibility",
    description: "Track fleet activity, costs, availability, and trip progress.",
  },
];

export function LoginBrandingPanel() {
  return (
    <Flex
      position="relative"
      direction="column"
      justify="space-between"
      w="full"
      minH={{ base: "auto", lg: "100dvh" }}
      overflow="hidden"
      bg="gray.950"
      color="white"
      borderRightWidth={{ lg: "1px" }}
      borderColor="whiteAlpha.200"
      px={{ base: "6", sm: "8", lg: "12", xl: "14" }}
      py={{ base: "7", lg: "10", xl: "12" }}
    >
      {/* Subtle background depth */}
      <Box
        position="absolute"
        top="-120px"
        right="-130px"
        w="320px"
        h="320px"
        borderRadius="full"
        bg="blue.500"
        opacity="0.12"
        filter="blur(70px)"
        pointerEvents="none"
      />

      <Box
        position="absolute"
        bottom="-160px"
        left="-120px"
        w="340px"
        h="340px"
        borderRadius="full"
        bg="purple.500"
        opacity="0.1"
        filter="blur(85px)"
        pointerEvents="none"
      />

      <VStack
        position="relative"
        zIndex="1"
        align="stretch"
        gap={{ base: "8", lg: "12" }}
      >
        {/* Brand */}
        <HStack gap="3">
          <Flex
            align="center"
            justify="center"
            boxSize="11"
            flexShrink={0}
            borderRadius="xl"
            bg="blue.500"
            boxShadow="0 10px 30px rgba(59, 130, 246, 0.28)"
          >
            <Icon as={LuTruck} boxSize="5" aria-hidden />
          </Flex>

          <Box>
            <Heading
              size="xl"
              color="white"
              letterSpacing="-0.025em"
              lineHeight="1"
            >
              TransitOps
            </Heading>

            <Text mt="1.5" fontSize="sm" color="gray.400">
              Smart transport operations
            </Text>
          </Box>
        </HStack>

        {/* Main message */}
        <Box maxW="lg">
          <HStack
            w="fit-content"
            gap="2"
            mb="5"
            px="3"
            py="1.5"
            bg="whiteAlpha.100"
            borderWidth="1px"
            borderColor="whiteAlpha.200"
            borderRadius="full"
          >
            <Icon as={LuShieldCheck} boxSize="4" color="blue.300" />
            <Text
              fontSize="xs"
              fontWeight="700"
              color="gray.200"
              letterSpacing="0.05em"
              textTransform="uppercase"
            >
              Controlled fleet operations
            </Text>
          </HStack>

          <Heading
            fontSize={{
              base: "3xl",
              sm: "4xl",
              lg: "4xl",
              xl: "5xl",
            }}
            maxW="xl"
            color="white"
            lineHeight="1.08"
            letterSpacing="-0.045em"
          >
            Every vehicle, driver, and trip in one reliable workflow.
          </Heading>

          <Text
            mt="5"
            maxW="lg"
            fontSize={{ base: "sm", lg: "md" }}
            lineHeight="1.8"
            color="gray.400"
          >
            Plan dispatches, prevent unsafe assignments, manage maintenance,
            and keep operational records synchronized without relying on
            scattered spreadsheets.
          </Text>
        </Box>

        {/* Capabilities */}
        <SimpleGrid
          columns={{ base: 1, sm: 3, lg: 1 }}
          gap="3"
          maxW="xl"
        >
          {capabilities.map((capability) => (
            <HStack
              key={capability.title}
              align="flex-start"
              gap="3.5"
              p="4"
              bg="whiteAlpha.50"
              borderWidth="1px"
              borderColor="whiteAlpha.100"
              borderRadius="xl"
            >
              <Flex
                align="center"
                justify="center"
                boxSize="9"
                flexShrink={0}
                borderRadius="lg"
                bg="blue.500/15"
                color="blue.300"
              >
                <Icon as={capability.icon} boxSize="4.5" aria-hidden />
              </Flex>

              <Box>
                <Text fontSize="sm" fontWeight="700" color="white">
                  {capability.title}
                </Text>
                <Text
                  mt="1"
                  fontSize="xs"
                  lineHeight="1.6"
                  color="gray.400"
                >
                  {capability.description}
                </Text>
              </Box>
            </HStack>
          ))}
        </SimpleGrid>
      </VStack>

      {/* Footer */}
      <Flex
        position="relative"
        zIndex="1"
        mt={{ base: "10", lg: "12" }}
        pt="5"
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        gap="2"
        borderTopWidth="1px"
        borderColor="whiteAlpha.200"
      >
        <Text fontSize="xs" color="gray.500">
          TransitOps © 2026
        </Text>

        <Text fontSize="xs" color="gray.500">
          Built for reliable transport operations
        </Text>
      </Flex>
    </Flex>
  );
}