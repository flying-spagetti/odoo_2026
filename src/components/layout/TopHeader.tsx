"use client";

import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { ColorModeButton } from "@/components/ui/color-mode";
import { MobileNav } from "./MobileNav";

export function TopHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="docked"
        bg="bg"
        borderBottomWidth="1px"
        borderColor="border.muted"
        h="16"
        px={{ base: "4", md: "6" }}
      >
        <Flex align="center" justify="space-between" h="full" gap="4">
          <Flex align="center" gap="3" minW="0">
            <IconButton
              aria-label="Open navigation menu"
              display={{ base: "inline-flex", md: "none" }}
              variant="ghost"
              size="sm"
              onClick={() => setMobileNavOpen(true)}
            >
              <LuMenu />
            </IconButton>
            <Box display={{ base: "block", md: "none" }} minW="0">
              <Heading size="sm" color="blue.600" truncate>
                TransitOps
              </Heading>
            </Box>
            <Text
              display={{ base: "none", md: "block" }}
              fontSize="sm"
              color="fg.muted"
              truncate
            >
              Fleet operations control
            </Text>
          </Flex>

          <Flex align="center" gap="2">
            <ColorModeButton />
          </Flex>
        </Flex>
      </Box>

      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
    </>
  );
}
