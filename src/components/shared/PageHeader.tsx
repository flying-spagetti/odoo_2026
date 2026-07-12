import { Box, Flex, Heading, Text } from "@chakra-ui/react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Flex
      direction={{ base: "column", sm: "row" }}
      align={{ base: "stretch", sm: "flex-start" }}
      justify="space-between"
      gap="4"
      mb={{ base: "5", md: "6" }}
    >
      <Box minW="0">
        <Heading size="lg" mb={description ? "1" : "0"}>
          {title}
        </Heading>
        {description && (
          <Text color="fg.muted" fontSize="sm">
            {description}
          </Text>
        )}
      </Box>
      {actions && (
        <Flex gap="2" flexShrink={0} wrap="wrap">
          {actions}
        </Flex>
      )}
    </Flex>
  );
}
