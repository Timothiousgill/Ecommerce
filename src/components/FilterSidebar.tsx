import React, { useState, useEffect } from 'react';
import { useDebounce } from "../components/hooks/useDebounce";

import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    Button,
    Badge,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Search, Filter } from 'lucide-react';

export interface FilterState {
    searchQuery: string;
    categories: string[];
    priceRange: [number, number];
    rating: number;
    sortBy: string;
}

interface FilterSidebarProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    categories: string[];
    priceRange: [number, number];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters,
    onFiltersChange,
    categories,
    priceRange,
}) => {
    const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const debouncedSearchQuery = useDebounce(localSearchQuery, 500);
    const isMobile = useBreakpointValue({ base: true, lg: false });

    // ✅ Fix: include filters + onFiltersChange in deps
    useEffect(() => {
        if (debouncedSearchQuery !== filters.searchQuery) {
            onFiltersChange({
                ...filters,
                searchQuery: debouncedSearchQuery,
            });
        }
    }, [debouncedSearchQuery, filters, onFiltersChange]);

    const handleCategoryChange = (category: string, checked: boolean) => {
        const newCategories = checked
            ? [...filters.categories, category]
            : filters.categories.filter(c => c !== category);

        onFiltersChange({
            ...filters,
            categories: newCategories,
        });
    };

    const handlePriceRangeChange = (value: number) => {
        onFiltersChange({
            ...filters,
            priceRange: [filters.priceRange[0], value],
        });
    };

    const handleRatingChange = (rating: number) => {
        onFiltersChange({
            ...filters,
            rating: filters.rating === rating ? 0 : rating,
        });
    };

    const handleSortChange = (sortBy: string) => {
        onFiltersChange({
            ...filters,
            sortBy,
        });
    };

    const clearFilters = () => {
        setLocalSearchQuery('');
        onFiltersChange({
            searchQuery: '',
            categories: [],
            priceRange: priceRange,
            rating: 0,
            sortBy: 'default',
        });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.searchQuery) count++;
        if (filters.categories.length > 0) count++;
        if (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1]) count++;
        if (filters.rating > 0) count++;
        if (filters.sortBy !== 'default') count++;
        return count;
    };

    const FilterContent = () => (
        <VStack align="stretch" gap={6} w="full">
            {/* Search Input */}
            <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
                    Search Products
                </Text>
                <Box position="relative">
                    <Input
                        placeholder="Search by product name..."
                        color={"gray.500"}
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        pr={10}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                        }}
                    />
                    <Box
                        position="absolute"
                        right={3}
                        top="50%"
                        transform="translateY(-50%)"
                        color="gray.400"
                    >
                        <Search size={18} />
                    </Box>
                </Box>
            </Box>

            {/* Sort By */}
            <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
                    Sort By
                </Text>
                <Box
                    as="div"
                    w="full"
                    p={2}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                >
                    <select
                        style={{
                            width: "100%",
                            padding: "8px",
                            border: "none",
                            outline: "none",
                            color: "#6B7280", 
                            background: "white",
                        }}
                        value={filters.sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="default">Default</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="rating-high-low">Rating: High to Low</option>
                        <option value="name-a-z">Name: A to Z</option>
                    </select>
                </Box>
            </Box>

            {/* Categories */}
            <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
                    Categories
                </Text>
                <VStack align="stretch" gap={2}>
                    {categories.map((category) => (
                        <Box
                            key={category}
                            as="label"
                            display="flex"
                            alignItems="center"
                            color={"gray.500"}
                            gap={2}
                            cursor="pointer"
                            p={2}
                            borderRadius="md"
                            _hover={{ bg: "gray.50" }}
                        >
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(category)}
                                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                                style={{ accentColor: "#3182ce", cursor: "pointer" }}
                            />
                            <Text fontSize="sm" textTransform="capitalize">
                                {category.replace(/'/g, '')}
                            </Text>
                        </Box>
                    ))}
                </VStack>
            </Box>

            {/* Price Range */}
            <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
                    Max Price: ${filters.priceRange[1].toFixed(0)}
                </Text>
                <VStack align="stretch" gap={3}>
                    <HStack justify="space-between">
                        <Text fontSize="xs" color="gray.500">
                            ${priceRange[0].toFixed(0)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            ${priceRange[1].toFixed(0)}
                        </Text>
                    </HStack>
                    <Box px={2}>
                        <input
                            type="range"
                            min={priceRange[0]}
                            max={priceRange[1]}
                            step={5}
                            value={filters.priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(Number(e.target.value))}
                            style={{
                                width: '100%',
                                height: '8px',
                                borderRadius: '5px',
                                background: '#e2e8f0',
                                outline: 'none',
                                opacity: '0.7',
                                transition: 'opacity 0.2s',
                                accentColor: '#3182ce'
                            }}
                        />
                    </Box>
                </VStack>
            </Box>

            {/* Rating Filter */}
            <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
                    Minimum Rating
                </Text>
                <VStack align="stretch" gap={2}>
                    {[4, 3, 2, 1].map((rating) => (
                        <Box
                            key={rating}
                            as="button"
                            p={2}
                            borderRadius="md"
                            bg={filters.rating === rating ? "blue.50" : "transparent"}
                            border="1px solid"
                            borderColor={filters.rating === rating ? "blue.200" : "gray.200"}
                            onClick={() => handleRatingChange(rating)}
                            _hover={{ bg: "gray.50" }}
                            transition="all 0.2s"
                            textAlign="left"
                        >
                            <HStack>
                                <Text fontSize="sm" color="yellow.400">
                                    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                    & above
                                </Text>
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            </Box>

            {/* Clear Filters */}
            <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={clearFilters}
                disabled={getActiveFiltersCount() === 0}
                color="black"
                _hover={{
                    color: "white",
                    bg: "red.500",
                    borderColor: "red.500",
                }}
            >
                Clear All Filters
            </Button>
        </VStack>
    );

    if (isMobile) {
        return (
            <>
                {/* Mobile Filter Button */}
                <Button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    variant="outline"
                    size="sm"
                    position="relative"
                >
                    <Filter size={16} />
                    <Text ml={2}>Filters</Text>
                    {getActiveFiltersCount() > 0 && (
                        <Badge
                            position="absolute"
                            top="-8px"
                            right="-8px"
                            colorScheme="red"
                            borderRadius="full"
                            fontSize="xs"
                            px={1.5}
                        >
                            {getActiveFiltersCount()}
                        </Badge>
                    )}
                </Button>

                {/* Mobile Filters Panel */}
                {showMobileFilters && (
                    <Box
                        position="fixed"
                        top="0"
                        left="0"
                        w="100vw"
                        h="100vh"
                        bg="blackAlpha.500"
                        zIndex={1000}
                        onClick={() => setShowMobileFilters(false)}
                    >
                        <Box
                            w="320px"
                            h="full"
                            bg="white"
                            p={6}
                            overflowY="auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <HStack justify="space-between" mb={6}>
                                <Text fontSize="lg" fontWeight="bold">Filters</Text>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowMobileFilters(false)}
                                >
                                    ✕
                                </Button>
                            </HStack>
                            <FilterContent />
                        </Box>
                    </Box>
                )}
            </>
        );
    }

    // Desktop Sidebar
    return (
        <Box
            w="280px"
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.200"
            position="sticky"
            top="100px"
            maxH="calc(100vh - 120px)"
            overflowY="auto"
        >
            <HStack justify="space-between" mb={6}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    Filters
                </Text>
                {getActiveFiltersCount() > 0 && (
                    <Badge colorScheme="blue" borderRadius="full">
                        {getActiveFiltersCount()} active
                    </Badge>
                )}
            </HStack>
            <FilterContent />
        </Box>
    );
};

export default FilterSidebar;
