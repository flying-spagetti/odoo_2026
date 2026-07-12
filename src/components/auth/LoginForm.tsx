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
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuArrowRight,
  LuCircleX,
  LuEye,
  LuEyeOff,
  LuLockKeyhole,
  LuShieldCheck,
} from "react-icons/lu";

import { authClient } from "@/lib/auth/auth-client";
import { getAuthenticatedRedirectPath } from "@/lib/auth/get-post-login-path.action";
import {
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
} from "@/lib/auth/post-login-redirect";

const REMEMBER_EMAIL_KEY = "transitops.rememberedEmail";

const INVALID_CREDENTIALS_MESSAGE =
  "Invalid email or password. Please try again.";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email: normalizedEmail,
        password,
      });

      if (result.error) {
        setError(INVALID_CREDENTIALS_MESSAGE);
        return;
      }

      if (rememberMe) {
        localStorage.setItem(
          REMEMBER_EMAIL_KEY,
          normalizedEmail,
        );
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      await authClient.getSession();
      router.refresh();

      let redirectPath: string | null = null;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        redirectPath = await getAuthenticatedRedirectPath();

        if (redirectPath) {
          break;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 100),
        );
      }

      window.location.assign(redirectPath ?? "/dashboard");
    } catch {
      setError(INVALID_CREDENTIALS_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  const useDemoAccount = (accountEmail: string) => {
    setEmail(accountEmail);
    setPassword(DEMO_PASSWORD);
    setError(null);
  };

  return (
    <Flex
      position="relative"
      direction="column"
      justify="center"
      flex="1"
      minH={{ base: "auto", lg: "100dvh" }}
      overflow="hidden"
      bg="gray.50"
      px={{ base: "5", sm: "8", lg: "12", xl: "16" }}
      py={{ base: "9", lg: "12" }}
    >
      {/* Restrained visual depth matching the branding panel */}
      <Box
        position="absolute"
        top="-180px"
        right="-170px"
        boxSize="360px"
        borderRadius="full"
        bg="blue.100"
        opacity="0.55"
        filter="blur(90px)"
        pointerEvents="none"
      />

      <Box
        position="absolute"
        bottom="-220px"
        left="-180px"
        boxSize="380px"
        borderRadius="full"
        bg="gray.200"
        opacity="0.65"
        filter="blur(100px)"
        pointerEvents="none"
      />

      <Box
        position="relative"
        zIndex="1"
        w="full"
        maxW="xl"
        mx="auto"
      >
        <VStack align="stretch" gap="6">
          {/* Mobile brand indicator */}
          <HStack
            display={{ base: "flex", lg: "none" }}
            gap="3"
            mb="1"
          >
            <Flex
              align="center"
              justify="center"
              boxSize="10"
              borderRadius="xl"
              bg="gray.950"
              color="white"
            >
              <LuShieldCheck size={18} />
            </Flex>

            <Box>
              <Text
                fontSize="sm"
                fontWeight="700"
                color="gray.900"
              >
                TransitOps
              </Text>
              <Text fontSize="xs" color="gray.500">
                Smart transport operations
              </Text>
            </Box>
          </HStack>

          <Box>
            <HStack
              w="fit-content"
              gap="2"
              mb="5"
              px="3"
              py="1.5"
              bg="blue.50"
              borderWidth="1px"
              borderColor="blue.100"
              borderRadius="full"
            >
              <LuLockKeyhole
                size={14}
                color="var(--chakra-colors-blue-600)"
              />
              <Text
                fontSize="xs"
                fontWeight="700"
                color="blue.700"
                textTransform="uppercase"
                letterSpacing="0.08em"
              >
                Secure workspace
              </Text>
            </HStack>

            <Heading
              fontSize={{ base: "3xl", sm: "4xl" }}
              lineHeight="1.08"
              letterSpacing="-0.04em"
              color="gray.950"
            >
              Welcome back
            </Heading>

            <Text
              mt="3"
              maxW="md"
              fontSize="sm"
              lineHeight="1.7"
              color="gray.600"
            >
              Sign in to manage fleet availability, dispatches,
              maintenance, and operational costs.
            </Text>
          </Box>

          <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="2xl"
            px={{ base: "5", sm: "7" }}
            py={{ base: "6", sm: "7" }}
            boxShadow="0 24px 65px rgba(15, 23, 42, 0.09)"
          >
            <form onSubmit={handleSubmit} noValidate>
              <VStack align="stretch" gap="5">
                <Field.Root required>
                  <Field.Label
                    htmlFor="login-email"
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                  >
                    Email address
                  </Field.Label>

                  <Input
                    id="login-email"
                    type="email"
                    size="lg"
                    h="12"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError(null);
                    }}
                    placeholder="name@transitops.demo"
                    autoComplete="email"
                    bg="gray.50"
                    color="gray.950"
                    borderColor="gray.300"
                    borderRadius="xl"
                    transition="all 0.18s ease"
                    _placeholder={{ color: "gray.400" }}
                    _hover={{
                      bg: "white",
                      borderColor: "gray.400",
                    }}
                    _focusVisible={{
                      bg: "white",
                      borderColor: "blue.500",
                      boxShadow:
                        "0 0 0 3px rgba(59, 130, 246, 0.14)",
                    }}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label
                    htmlFor="login-password"
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                  >
                    Password
                  </Field.Label>

                  <HStack gap="0" w="full">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      size="lg"
                      h="12"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError(null);
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      bg="gray.50"
                      color="gray.950"
                      borderColor="gray.300"
                      borderLeftRadius="xl"
                      borderRightRadius="0"
                      flex="1"
                      transition="all 0.18s ease"
                      _placeholder={{ color: "gray.400" }}
                      _hover={{
                        bg: "white",
                        borderColor: "gray.400",
                      }}
                      _focusVisible={{
                        zIndex: "1",
                        bg: "white",
                        borderColor: "blue.500",
                        boxShadow:
                          "0 0 0 3px rgba(59, 130, 246, 0.14)",
                      }}
                    />

                    <IconButton
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      h="12"
                      w="12"
                      flexShrink={0}
                      variant="outline"
                      bg="gray.50"
                      color="gray.600"
                      borderColor="gray.300"
                      borderLeftWidth="0"
                      borderLeftRadius="0"
                      borderRightRadius="xl"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      _hover={{
                        bg: "gray.100",
                        color: "gray.950",
                      }}
                      _focusVisible={{
                        zIndex: "1",
                        borderColor: "blue.500",
                        boxShadow:
                          "0 0 0 3px rgba(59, 130, 246, 0.14)",
                      }}
                    >
                      {showPassword ? (
                        <LuEyeOff size={18} />
                      ) : (
                        <LuEye size={18} />
                      )}
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
                  <Checkbox.Label
                    fontSize="sm"
                    color="gray.700"
                  >
                    Remember my email on this device
                  </Checkbox.Label>
                </Checkbox.Root>

                {error && (
                  <Alert.Root
                    status="error"
                    variant="surface"
                    bg="red.50"
                    borderWidth="1px"
                    borderColor="red.200"
                    borderRadius="xl"
                    alignItems="flex-start"
                  >
                    <Alert.Indicator mt="0.5">
                      <LuCircleX />
                    </Alert.Indicator>

                    <Alert.Content>
                      <Alert.Title
                        fontSize="sm"
                        fontWeight="700"
                        color="red.900"
                      >
                        Unable to sign in
                      </Alert.Title>

                      <Alert.Description
                        fontSize="sm"
                        color="red.700"
                      >
                        {error}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>
                )}

                <Button
                  type="submit"
                  size="lg"
                  h="12"
                  w="full"
                  colorPalette="blue"
                  borderRadius="xl"
                  fontWeight="700"
                  loading={isSubmitting}
                  loadingText="Signing in"
                  boxShadow="0 10px 24px rgba(37, 99, 235, 0.2)"
                  transition="all 0.18s ease"
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow:
                      "0 14px 30px rgba(37, 99, 235, 0.27)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                >
                  <HStack gap="2">
                    <Text>Continue to workspace</Text>
                    <LuArrowRight size={17} />
                  </HStack>
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Demo accounts */}
          <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="2xl"
            p={{ base: "5", sm: "6" }}
            boxShadow="0 12px 35px rgba(15, 23, 42, 0.05)"
          >
            <Flex
              align={{ base: "flex-start", sm: "center" }}
              justify="space-between"
              direction={{ base: "column", sm: "row" }}
              gap="3"
              mb="4"
            >
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="700"
                  color="gray.950"
                >
                  Explore the product
                </Text>

                <Text mt="0.5" fontSize="xs" color="gray.500">
                  Choose a demo account to preview its role.
                </Text>
              </Box>

              <HStack
                gap="2"
                px="3"
                py="1.5"
                bg="gray.100"
                borderRadius="lg"
              >
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.500"
                >
                  Password
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  fontFamily="mono"
                  color="gray.800"
                >
                  {DEMO_PASSWORD}
                </Text>
              </HStack>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap="3">
              {DEMO_ACCOUNTS.map((account) => {
                const initials = account.label
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2);

                return (
                  <Button
                    key={account.email}
                    type="button"
                    variant="outline"
                    h="auto"
                    minH="72px"
                    p="3.5"
                    bg="white"
                    borderColor="gray.200"
                    borderRadius="xl"
                    justifyContent="flex-start"
                    textAlign="left"
                    onClick={() =>
                      useDemoAccount(account.email)
                    }
                    transition="all 0.18s ease"
                    _hover={{
                      bg: "blue.50",
                      borderColor: "blue.300",
                      transform: "translateY(-1px)",
                      boxShadow:
                        "0 9px 22px rgba(37, 99, 235, 0.09)",
                    }}
                  >
                    <HStack
                      w="full"
                      gap="3"
                      justify="space-between"
                    >
                      <HStack minW="0" gap="3">
                        <Flex
                          align="center"
                          justify="center"
                          boxSize="9"
                          flexShrink={0}
                          bg="gray.950"
                          color="white"
                          borderRadius="lg"
                          fontSize="xs"
                          fontWeight="800"
                        >
                          {initials}
                        </Flex>

                        <Box minW="0">
                          <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="gray.900"
                          >
                            {account.label}
                          </Text>

                          <Text
                            fontSize="xs"
                            fontWeight="400"
                            color="gray.500"
                            truncate
                          >
                            {account.email}
                          </Text>
                        </Box>
                      </HStack>

                      <LuArrowRight
                        size={15}
                        color="var(--chakra-colors-gray-400)"
                      />
                    </HStack>
                  </Button>
                );
              })}
            </SimpleGrid>
          </Box>

          <Text
            textAlign="center"
            fontSize="xs"
            color="gray.500"
          >
            Secure access · Role-based operations · TransitOps 2026
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}