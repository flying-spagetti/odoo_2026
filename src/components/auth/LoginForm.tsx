"use client";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Field,
  Flex,
  Heading,
  Input,
  Link,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Role } from "@/generated/prisma/enums";
import { authClient } from "@/lib/auth/auth-client";
import {
  DEFAULT_ROLE,
  getRoleOption,
  isDemoEmail,
  ROLE_OPTIONS,
} from "@/lib/auth/role-config";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { LuCircleX } from "react-icons/lu";

const REMEMBER_EMAIL_KEY = "transitops.rememberedEmail";
const REMEMBER_ROLE_KEY = "transitops.rememberedRole";

const INVALID_CREDENTIALS_MESSAGE =
  "Invalid credentials. Account locked after 5 failed attempts.";

const ROLE_MISMATCH_MESSAGE =
  "Selected role does not match this account. Choose the correct role or email.";

interface RememberedLoginState {
  email: string;
  role: Role;
  rememberMe: boolean;
}

function getDefaultLoginState(): RememberedLoginState {
  return {
    email: getRoleOption(DEFAULT_ROLE).demoEmail,
    role: DEFAULT_ROLE,
    rememberMe: true,
  };
}

function readRememberedLoginState(): RememberedLoginState {
  const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
  const rememberedRole = localStorage.getItem(REMEMBER_ROLE_KEY) as Role | null;
  const role =
    rememberedRole &&
    ROLE_OPTIONS.some((option) => option.value === rememberedRole)
      ? rememberedRole
      : DEFAULT_ROLE;

  return {
    email: rememberedEmail ?? getRoleOption(role).demoEmail,
    role,
    rememberMe: Boolean(rememberedEmail),
  };
}

function useRememberedLoginState(): RememberedLoginState {
  return useSyncExternalStore(
    () => () => undefined,
    readRememberedLoginState,
    getDefaultLoginState,
  );
}

export function LoginForm() {
  const router = useRouter();
  const rememberedState = useRememberedLoginState();
  const [email, setEmail] = useState(rememberedState.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(rememberedState.role);
  const [rememberMe, setRememberMe] = useState(rememberedState.rememberMe);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    setError(null);

    if (!email || isDemoEmail(email)) {
      setEmail(getRoleOption(nextRole).demoEmail);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(INVALID_CREDENTIALS_MESSAGE);
        return;
      }

      const session = await authClient.getSession();
      const sessionUser = session.data?.user as { role?: Role } | undefined;
      const sessionRole = sessionUser?.role;

      if (sessionRole && sessionRole !== role) {
        await authClient.signOut();
        setError(ROLE_MISMATCH_MESSAGE);
        return;
      }

      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
        localStorage.setItem(REMEMBER_ROLE_KEY, role);
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
        localStorage.removeItem(REMEMBER_ROLE_KEY);
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(INVALID_CREDENTIALS_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex
      direction="column"
      justify="center"
      bg="gray.900"
      color="white"
      px={{ base: "6", md: "10", lg: "14" }}
      py={{ base: "10", md: "12" }}
      minH={{ base: "auto", md: "100vh" }}
      flex="1"
    >
      <Box maxW="md" w="full" mx="auto">
        <VStack align="stretch" gap="6">
          <Box>
            <Heading size="lg" mb="1">
              Sign in to your account
            </Heading>
            <Text fontSize="sm" color="gray.400">
              Enter your credentials to continue
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack align="stretch" gap="4">
              <Field.Root required>
                <Field.Label color="gray.300" fontSize="xs" letterSpacing="wider">
                  EMAIL
                </Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  placeholder="fleet@transitops.demo"
                  bg="gray.800"
                  borderColor="gray.700"
                  color="white"
                  _placeholder={{ color: "gray.500" }}
                  autoComplete="email"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label color="gray.300" fontSize="xs" letterSpacing="wider">
                  PASSWORD
                </Field.Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  placeholder="********"
                  bg="gray.800"
                  borderColor="gray.700"
                  color="white"
                  _placeholder={{ color: "gray.500" }}
                  autoComplete="current-password"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label color="gray.300" fontSize="xs" letterSpacing="wider">
                  ROLE (RBAC)
                </Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={role}
                    onChange={(event) =>
                      handleRoleChange(event.target.value as Role)
                    }
                    bg="gray.800"
                    borderColor="gray.700"
                    color="white"
                    aria-label="Select role"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator color="gray.400" />
                </NativeSelect.Root>
              </Field.Root>

              <Flex
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                gap="3"
                direction={{ base: "column", sm: "row" }}
              >
                <Checkbox.Root
                  checked={rememberMe}
                  onCheckedChange={(details) =>
                    setRememberMe(details.checked === true)
                  }
                  colorPalette="blue"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label color="gray.300" fontSize="sm">
                    Remember me
                  </Checkbox.Label>
                </Checkbox.Root>

                <Link
                  href="#"
                  fontSize="sm"
                  color="blue.300"
                  _hover={{ color: "blue.200" }}
                  onClick={(event) => event.preventDefault()}
                >
                  Forgot password?
                </Link>
              </Flex>

              {error && (
                <Alert.Root status="error" variant="surface" bg="red.950" borderColor="red.700">
                  <Alert.Indicator>
                    <LuCircleX />
                  </Alert.Indicator>
                  <Alert.Content>
                    <Alert.Title fontSize="sm">Error state</Alert.Title>
                    <Alert.Description fontSize="sm">{error}</Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}

              <Button
                type="submit"
                size="lg"
                colorPalette="orange"
                loading={isSubmitting}
                w="full"
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Box pt="2">
            <Text fontSize="sm" color="gray.400" mb="2">
              Access is scoped by role after login:
            </Text>
            <VStack align="stretch" gap="1">
              {ROLE_OPTIONS.map((option) => (
                <Text key={option.value} fontSize="sm" color="gray.300">
                  {option.label} → {option.accessScope}
                </Text>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}
