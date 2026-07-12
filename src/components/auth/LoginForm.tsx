"use client";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Field,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { authClient } from "@/lib/auth/auth-client";
import { getAuthenticatedRedirectPath } from "@/lib/auth/get-post-login-path.action";
import {
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
} from "@/lib/auth/post-login-redirect";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { LuCircleX, LuEye, LuEyeOff } from "react-icons/lu";

const REMEMBER_EMAIL_KEY = "transitops.rememberedEmail";

const INVALID_CREDENTIALS_MESSAGE =
  "Invalid email or password. Please try again.";

function getDefaultEmail(): string {
  return "";
}

function readRememberedEmail(): string {
  return localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "";
}

function useRememberedEmail(): string {
  return useSyncExternalStore(
    () => () => undefined,
    readRememberedEmail,
    getDefaultEmail,
  );
}

export function LoginForm() {
  const router = useRouter();
  const rememberedEmail = useRememberedEmail();
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(INVALID_CREDENTIALS_MESSAGE);
        return;
      }

      await authClient.getSession();

      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      router.refresh();

      let redirectPath: string | null = null;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        redirectPath = await getAuthenticatedRedirectPath();
        if (redirectPath) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      window.location.assign(redirectPath ?? "/dashboard");
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
      bg="white"
      px={{ base: "6", md: "10", lg: "14" }}
      py={{ base: "10", md: "12" }}
      minH={{ base: "auto", md: "100vh" }}
      flex="1"
    >
      <Box maxW="md" w="full" mx="auto">
        <VStack align="stretch" gap="6">
          <Box>
            <Heading size="lg" mb="1" color="gray.900">
              Sign in
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Use your TransitOps credentials to continue
            </Text>
          </Box>

          <form onSubmit={handleSubmit} noValidate>
            <VStack align="stretch" gap="4">
              <Field.Root required>
                <Field.Label htmlFor="login-email">Email</Field.Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  placeholder="name@transitops.demo"
                  autoComplete="email"
                  bg="white"
                  borderColor="gray.300"
                  _focusVisible={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label htmlFor="login-password">Password</Field.Label>
                <HStack gap="0" w="full">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError(null);
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    bg="white"
                    borderColor="gray.300"
                    borderRightRadius={0}
                    flex="1"
                    _focusVisible={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                    }}
                  />
                  <IconButton
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    variant="outline"
                    borderColor="gray.300"
                    borderLeftWidth={0}
                    borderLeftRadius={0}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <LuEyeOff /> : <LuEye />}
                  </IconButton>
                </HStack>
              </Field.Root>

              <Checkbox.Root
                checked={rememberMe}
                onCheckedChange={(details) =>
                  setRememberMe(details.checked === true)
                }
                colorPalette="blue"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label fontSize="sm" color="gray.700">
                  Remember email on this device
                </Checkbox.Label>
              </Checkbox.Root>

              {error && (
                <Alert.Root
                  status="error"
                  variant="surface"
                  bg="red.50"
                  borderColor="red.200"
                >
                  <Alert.Indicator>
                    <LuCircleX />
                  </Alert.Indicator>
                  <Alert.Content>
                    <Alert.Description fontSize="sm">{error}</Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}

              <Button
                type="submit"
                size="lg"
                colorPalette="blue"
                loading={isSubmitting}
                w="full"
              >
                Sign in
              </Button>
            </VStack>
          </form>

          <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            bg="gray.50"
            px="4"
            py="3"
          >
            <Text fontSize="sm" fontWeight="medium" color="gray.800" mb="2">
              Demo accounts
            </Text>
            <Text fontSize="xs" color="gray.600" mb="3">
              Password: {DEMO_PASSWORD}
            </Text>
            <VStack align="stretch" gap="2">
              {DEMO_ACCOUNTS.map((account) => (
                <HStack key={account.email} justify="space-between" gap="3">
                  <Box minW="0">
                    <Text fontSize="sm" color="gray.800">
                      {account.label}
                    </Text>
                    <Text fontSize="xs" color="gray.600" truncate>
                      {account.email}
                    </Text>
                  </Box>
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    flexShrink={0}
                    onClick={() => {
                      setEmail(account.email);
                      setError(null);
                    }}
                  >
                    Use account
                  </Button>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}
