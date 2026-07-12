"use client";

import {
  Avatar,
  Badge,
  Button,
  Flex,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { authClient } from "@/lib/auth/auth-client";

const ROLE_LABELS: Record<string, string> = {
  FLEET_MANAGER: "Fleet Manager",
  DISPATCHER: "Dispatcher",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function UserProfile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await authClient.signOut();
      router.refresh();
      window.location.assign("/login");
    } catch {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <Flex align="center" gap="3">
        <Skeleton h="4" w="20" display={{ base: "none", sm: "block" }} />
        <Skeleton h="5" w="16" display={{ base: "none", md: "block" }} />
        <Skeleton boxSize="8" borderRadius="full" />
        <Skeleton h="8" w="16" />
      </Flex>
    );
  }

  const name = session?.user?.name?.trim() || "Signed in";
  const roleValue =
    typeof session?.user === "object" &&
    session.user !== null &&
    "role" in session.user &&
    typeof (session.user as { role?: unknown }).role === "string"
      ? (session.user as { role: string }).role
      : null;
  const roleLabel = roleValue
    ? (ROLE_LABELS[roleValue] ?? roleValue.replace(/_/g, " "))
    : null;

  return (
    <Flex align="center" gap="3">
      <Text fontSize="sm" color="gray.200" display={{ base: "none", sm: "block" }}>
        {name}
      </Text>
      {roleLabel && (
        <Badge
          variant="outline"
          colorPalette="blue"
          size="sm"
          display={{ base: "none", md: "inline-flex" }}
        >
          {roleLabel}
        </Badge>
      )}
      <Avatar.Root size="sm" colorPalette="blue">
        <Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
      </Avatar.Root>
      <Button
        size="sm"
        variant="outline"
        colorPalette="gray"
        loading={isSigningOut}
        onClick={() => {
          void handleSignOut();
        }}
        aria-label="Log out"
      >
        <LuLogOut />
        <Text as="span" display={{ base: "none", sm: "inline" }}>
          Log out
        </Text>
      </Button>
    </Flex>
  );
}
