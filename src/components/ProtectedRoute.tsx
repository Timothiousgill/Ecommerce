import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import { LogIn, ArrowLeft } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackMessage = "Please log in to access this page" 
}) => {
  const { state } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Show loading spinner while checking authentication
  if (state.isLoading) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="4xl">
          <VStack justify="center" align="center" py={20}>
            <Spinner size="xl" color="blue.500" />
            <Text color="gray.600" mt={4}>Loading...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Show login prompt if not authenticated
  if (!state.isAuthenticated) {
    return (
      <>
        <Box minH="100vh" bg="gray.50" py={8}>
          <Container maxW="4xl">
            <VStack textAlign="center" py={20}>
              <Box
                bg="white"
                p={8}
                borderRadius="2xl"
                shadow="lg"
                maxW="md"
              >
                <Box
                  mx="auto"
                  mb={6}
                  p={4}
                  bg="blue.100"
                  borderRadius="full"
                  w="fit-content"
                >
                  <LogIn size={48} color="#3B82F6" />
                </Box>

                <Text fontSize="xl" fontWeight="semibold" mb={4} color="gray.700">
                  Authentication Required
                </Text>

                <Text color="gray.500" mb={6}>
                  {fallbackMessage}
                </Text>

                <VStack gap={3}>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    borderRadius="xl"
                    onClick={() => setAuthModalOpen(true)}
                    w="full"
                  >
                    <HStack gap={2}>
                      <LogIn size={16} />
                      <Text>Sign In</Text>
                    </HStack>
                  </Button>

                  <RouterLink to="/">
                    <Button
                      variant="outline"
                      size="lg"
                      borderRadius="xl"
                      w="full"
                    >
                      <HStack gap={2}>
                        <ArrowLeft size={16} />
                        <Text>Go Home</Text>
                      </HStack>
                    </Button>
                  </RouterLink>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  
  return <>{children}</>;
};