import { Box, Flex, Heading, List, Text, VStack } from "@chakra-ui/react";
import { LuLayoutGrid } from "react-icons/lu";
import { Icon } from "@chakra-ui/react";
import { ROLE_OPTIONS } from "@/lib/auth/role-config";

export function LoginBrandingPanel() {
  return (
    <Flex
      direction="column"
      justify="space-between"
      bg="gray.100"
      color="gray.800"
      px={{ base: "6", md: "10", lg: "12" }}
      py={{ base: "8", md: "10" }}
      minH={{ base: "auto", md: "100vh" }}
      flex="1"
    >
      <VStack align="stretch" gap="8">
        <Flex align="center" gap="3">
          <Flex
            align="center"
            justify="center"
            boxSize="10"
            bg="orange.500"
            borderRadius="md"
            color="white"
            flexShrink={0}
          >
            <Icon as={LuLayoutGrid} boxSize="5" />
          </Flex>
          <Box>
            <Heading size="lg" letterSpacing="tight">
              TransitOps
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Smart Transport Operations Platform
            </Text>
          </Box>
        </Flex>

        <Box>
          <Text fontWeight="semibold" mb="3">
            One login, four roles:
          </Text>
          <List.Root gap="2" variant="plain">
            {ROLE_OPTIONS.map((role) => (
              <List.Item key={role.value} display="flex" alignItems="center" gap="2">
                <Box boxSize="2" borderRadius="full" bg="orange.500" flexShrink={0} />
                <Text fontSize="sm">{role.label}</Text>
              </List.Item>
            ))}
          </List.Root>
        </Box>
      </VStack>

      <Text fontSize="xs" color="gray.500" mt="8">
        TRANSITOPS © 2026 · RBAC ENABLED
      </Text>
    </Flex>
  );
}
