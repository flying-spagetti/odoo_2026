"use client";

import { Box, Flex, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { useState } from "react";
import { LuMenu, LuSearch } from "react-icons/lu";
import { UserProfile } from "@/components/shared/UserProfile";
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
        bg="gray.950"
        borderBottomWidth="1px"
        borderColor="gray.800"
        h="16"
        px={{ base: "4", md: "6" }}
      >
        <Flex align="center" justify="space-between" h="full" gap="4">
          <Flex align="center" gap="3" flex="1" minW="0">
            <IconButton
              aria-label="Open navigation menu"
              display={{ base: "inline-flex", md: "none" }}
              variant="ghost"
              size="sm"
              color="gray.300"
              onClick={() => setMobileNavOpen(true)}
            >
              <LuMenu />
            </IconButton>

            <InputGroup
              maxW={{ base: "full", md: "sm" }}
              flex="1"
              startElement={<LuSearch color="var(--chakra-colors-gray-500)" />}
            >
              <Input
                placeholder="Search..."
                size="sm"
                bg="gray.900"
                borderColor="gray.700"
                color="gray.100"
                borderRadius="md"
                _placeholder={{ color: "gray.500" }}
                _focusVisible={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
                aria-label="Search"
              />
            </InputGroup>
          </Flex>

          <UserProfile />
        </Flex>
      </Box>

      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
    </>
  );
}
