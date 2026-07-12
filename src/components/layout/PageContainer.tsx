import { Container, type ContainerProps } from "@chakra-ui/react";

interface PageContainerProps extends ContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children, ...props }: PageContainerProps) {
  return (
    <Container
      maxW="container.xl"
      py={{ base: "5", md: "8" }}
      px={{ base: "4", md: "6" }}
      {...props}
    >
      {children}
    </Container>
  );
}
