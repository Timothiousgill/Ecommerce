import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  HStack,
  VStack,
  Flex,
  Grid,
  Text,
  Button,
  IconButton,
  useBreakpointValue,
  Skeleton,
  Badge,
} from '@chakra-ui/react';
import { Grid as GridIcon, List, ChevronLeft, ChevronRight } from 'lucide-react';
import FilterSidebar, { type FilterState } from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { fetchProducts, type Product } from '../api/productApi';

const PRODUCTS_PER_PAGE = 8; // Adjusted for larger cards

const Shop: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    sortBy: 'default',
  });

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
        
        // Set initial price range based on actual product data
        if (data.length > 0) {
          const prices = data.map(p => p.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setFilters(prev => ({
            ...prev,
            priceRange: [minPrice, maxPrice],
          }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Apply category filter if passed via navigation (from Home page)
  useEffect(() => {
    if (location.state?.category) {
      setFilters(prev => ({
        ...prev,
        categories: [location.state.category],
      }));
      // clear state so it doesn't stick after reload
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.sort();
  }, [products]);

  // Get price range from products
  const priceRange: [number, number] = useMemo(() => {
    if (products.length === 0) return [0, 1000];
    const prices = products.map(p => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
    );

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product =>
        product.rating.rate >= filters.rating
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-high-low':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'name-a-z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => a.id - b.id); // Default order
    }

    return filtered;
  }, [products, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="container.xl">
          <Flex gap={8}>
            {/* Sidebar Skeleton */}
            {!isMobile && (
              <Box w="280px" flexShrink={0}>
                <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                  <VStack align="stretch" gap={4}>
                    <Skeleton height="20px" />
                    <Skeleton height="40px" />
                    <Skeleton height="20px" />
                    <Skeleton height="100px" />
                  </VStack>
                </Box>
              </Box>
            )}
            
            {/* Products Grid Skeleton - Updated for larger cards */}
            <Box flex={1}>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(2, 1fr)",
                  xl: "repeat(3, 1fr)",
                }}
                gap={6}
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <Box key={i} bg="white" p={4} borderRadius="xl" shadow="sm">
                    <VStack gap={3}>
                      <Skeleton height="240px" />
                      <Skeleton height="20px" />
                      <Skeleton height="16px" />
                      <Skeleton height="40px" />
                    </VStack>
                  </Box>
                ))}
              </Grid>
            </Box>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="container.xl">
          <VStack gap={6}>
            <Box p={6} bg="red.50" borderRadius="lg" border="1px solid" borderColor="red.200">
              <Text color="red.600" fontWeight="semibold" mb={2}>
                Error Loading Products
              </Text>
              <Text color="gray.600">{error}</Text>
            </Box>
            <Button colorPalette="blue" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <Flex gap={8} align="flex-start">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
              priceRange={priceRange}
            />
          )}

          {/* Main Content */}
          <Box flex={1}>
            <VStack align="stretch" gap={6}>
              {/* Header */}
              <Flex
                justify="space-between"
                align={{ base: 'stretch', md: 'center' }}
                gap={4}
                direction={{ base: 'column', md: 'row' }}
              >
                <VStack align={{ base: 'center', md: 'flex-start' }} gap={2}>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    Products
                  </Text>
                  <HStack>
                    <Text fontSize="sm" color="gray.600">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} of{' '}
                      {filteredAndSortedProducts.length} products
                    </Text>
                    {filteredAndSortedProducts.length !== products.length && (
                      <Badge colorPalette="blue" variant="subtle">
                        Filtered
                      </Badge>
                    )}
                  </HStack>
                </VStack>

                <HStack>
                  {/* Mobile Filter Button */}
                  {isMobile && (
                    <FilterSidebar
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      categories={categories}
                      priceRange={priceRange}
                    />
                  )}

                  {/* View Toggle */}
                  <HStack bg="white" borderRadius="md" p={1} shadow="sm">
                    <IconButton
                      size="sm"
                      variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                      colorPalette="blue"
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <GridIcon size={16} />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant={viewMode === 'list' ? 'solid' : 'ghost'}
                      colorPalette="blue"
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <List size={16} />
                    </IconButton>
                  </HStack>
                </HStack>
              </Flex>

              {/* Products Grid - Updated for larger cards with view button */}
              {currentProducts.length > 0 ? (
                <Grid
                  templateColumns={
                    viewMode === 'list'
                      ? "1fr"
                      : {
                          base: "1fr",
                          md: "repeat(2, 1fr)",
                          lg: isMobile ? "repeat(2, 1fr)" : "repeat(2, 1fr)",
                          xl: isMobile ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
                        }
                  }
                  gap={6} // Larger gap for bigger cards
                >
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Grid>
              ) : (
                <Box
                  bg="white"
                  p={12}
                  borderRadius="xl"
                  shadow="sm"
                  textAlign="center"
                >
                  <Text fontSize="lg" fontWeight="semibold" color="gray.600" mb={2}>
                    No products found
                  </Text>
                  <Text color="gray.500" mb={4}>
                    Try adjusting your filters to see more results
                  </Text>
                  <Button
                    colorPalette="blue"
                    variant="outline"
                    onClick={() => setFilters({
                      searchQuery: '',
                      categories: [],
                      priceRange: priceRange,
                      rating: 0,
                      sortBy: 'default',
                    })}
                  >
                    Clear Filters
                  </Button>
                </Box>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Flex justify="center" align="center" gap={4} mt={8}>
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  <HStack>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          size="sm"
                          variant={currentPage === pageNum ? 'solid' : 'ghost'}
                          colorPalette="blue"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </HStack>

                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </Flex>
              )}
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Shop;