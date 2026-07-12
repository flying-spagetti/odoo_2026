"use client";

import { Card, Icon, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface PlaceholderPageProps {
  icon: IconType;
  title: string;
  description: string;
}

export function PlaceholderPage({
  icon,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <Card.Root variant="outline">
      <Card.Body
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        py="16"
        gap="4"
      >
        <Icon as={icon} boxSize="12" color="fg.subtle" aria-hidden />
        <Card.Title fontSize="lg">{title}</Card.Title>
        <Text fontSize="sm" color="fg.muted" maxW="md">
          {description}
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
