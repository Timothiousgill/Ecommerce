import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Grid,
  Text,
  Skeleton,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import type { Product } from ".././api/productApi";
import { fetchProducts } from "../api/productApi";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts(); // ✅ using API function
        setProducts(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching products");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  // Loading
  if (loading) {
    return (
      <Container maxW="container.xl" py={6}>
        <VStack gap={6} align="stretch">
          <Heading as="h2" size="lg" color="gray.800">
            Loading Products...
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {Array.from({ length: 8 }, (_, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
                shadow="md"
                bg="white"
                p={4}
              >
                <VStack gap={3} align="stretch">
                  <Skeleton height="200px" borderRadius="lg" />
                  <Skeleton height="16px" />
                  <Skeleton height="16px" width="75%" />
                  <Skeleton height="24px" width="60px" />
                  <Skeleton height="16px" width="80px" />
                  <Skeleton height="40px" borderRadius="md" />
                </VStack>
              </Box>
            ))}
          </Grid>
        </VStack>
      </Container>
    );
  }

  // Error
  if (error) {
    return (
      <Container maxW="container.xl" py={6}>
        <VStack gap={6}>
          <Box
            p={4}
            borderWidth="1px"
            borderRadius="md"
            borderColor="red.300"
            bg="red.50"
            w="full"
          >
            <Text fontWeight="bold" color="red.500" mb={2}>
              Error Loading Products!
            </Text>
            <Text color="gray.600">
              {error}. Please check your internet connection and try again.
            </Text>
          </Box>

          <Button colorScheme="blue" size="lg" onClick={handleRetry}>
            Try Again
          </Button>
        </VStack>
      </Container>
    );
  }

  // Products Grid
  return (
    <Container maxW="container.xl" py={6}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading as="h2" size="lg" color="gray.800">
            All Products ({products.length})
          </Heading>
        </HStack>

        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          gap={6}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      </VStack>
    </Container>
  );
};

export default Products;
