import { Avatar, Badge, Flex, Text } from "@chakra-ui/react";
import { MOCK_CURRENT_USER } from "@/lib/mock-data/session";

export function UserProfile() {
  return (
    <Flex align="center" gap="3">
      <Text fontSize="sm" color="gray.200" display={{ base: "none", sm: "block" }}>
        {MOCK_CURRENT_USER.name}
      </Text>
      <Badge
        variant="outline"
        colorPalette="blue"
        size="sm"
        display={{ base: "none", md: "inline-flex" }}
      >
        {MOCK_CURRENT_USER.roleLabel}
      </Badge>
      <Avatar.Root size="sm" colorPalette="blue">
        <Avatar.Fallback>{MOCK_CURRENT_USER.initials}</Avatar.Fallback>
      </Avatar.Root>
    </Flex>
  );
}
