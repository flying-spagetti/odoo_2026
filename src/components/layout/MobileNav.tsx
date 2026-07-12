"use client";

import {
  Box,
  Drawer,
  Flex,
  Heading,
  Icon,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./navigation";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      placement="start"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg="gray.950" color="gray.100">
            <Drawer.Header borderBottomWidth="1px" borderColor="gray.800">
              <Drawer.Title>
                <Heading size="md" color="gray.100">
                  TransitOps
                </Heading>
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body p="3">
              <VStack align="stretch" gap="1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onOpenChange(false)}
                    >
                      <Flex
                        align="center"
                        gap="3"
                        px="3"
                        py="2.5"
                        borderRadius="md"
                        fontSize="sm"
                        fontWeight={isActive ? "semibold" : "medium"}
                        color={isActive ? "orange.300" : "gray.400"}
                        bg={isActive ? "gray.900" : "transparent"}
                        borderWidth={isActive ? "1px" : "0"}
                        borderColor={isActive ? "orange.500" : "transparent"}
                      >
                        <Icon as={item.icon} boxSize="4" />
                        <Text>{item.label}</Text>
                      </Flex>
                    </Link>
                  );
                })}
              </VStack>
            </Drawer.Body>
            <Box px="5" py="4" borderTopWidth="1px" borderColor="gray.800">
              <Text fontSize="xs" color="gray.500">
                Transport Operations
              </Text>
            </Box>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
