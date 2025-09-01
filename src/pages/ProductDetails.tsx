import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    HStack,
    VStack,
    Flex,
    Grid,
    Text,
    Button,
    Image,
    Badge,
    Skeleton,
    AspectRatio,
    createToaster,
} from '@chakra-ui/react';
import {
    ArrowLeft,
    ShoppingCart,
    Check,
} from 'lucide-react';
import { fetchProductById, fetchProductsByCategory, type Product } from '../api/productApi';
import { useCart } from '../components/hooks/useCart';
import ProductCard from '../components/ProductCard';

// Create toaster instance
const toaster = createToaster({
    placement: 'bottom-end',
    pauseOnPageIdle: true,
});

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart, getItemQuantity } = useCart();

    const passedTitle = location.state?.productTitle;

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);

    const cartQuantity = getItemQuantity(product?.id || 0);

    // Simplified image source logic
    const getImageSrc = () => {
        if (imageError) {
            return "https://placehold.co/300x300?text=No+Image";
        }
        return product?.image || "https://placehold.co/300x300?text=Loading";
    };

    // Load product data
    useEffect(() => {
        const loadProduct = async () => {
            if (!id) {
                setError('Product ID not found');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                setImageError(false);

                const productData = await fetchProductById(parseInt(id));
                setProduct(productData);

                const relatedData = await fetchProductsByCategory(productData.category);
                const filteredRelated = relatedData
                    .filter(p => p.id !== productData.id)
                    .slice(0, 4);
                setRelatedProducts(filteredRelated);

            } catch (err) {
                console.error('Error loading product:', err);
                setError(err instanceof Error ? err.message : 'Error fetching product');
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    // Format price with currency
    const formatPrice = (price: number) => `$${price.toFixed(2)}`;

    // Calculate discount price (simulate 10% off)
    const getDiscountPrice = (price: number) => price * 0.9;

    // Generate rating stars
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) stars += '★';
        if (hasHalfStar) stars += '☆';
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) stars += '☆';

        return stars;
    };

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            setIsAdding(true);

            // Add the specified quantity to cart
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }

            toaster.create({
                title: "Added to cart!",
                description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.`,
                type: "success",
                duration: 3000,
            });
        } catch {
            toaster.create({
                title: "Error",
                description: "Failed to add item to cart. Please try again.",
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsAdding(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleImageLoad = () => {
        console.log('Image loaded successfully');
    };

    if (loading) {
        return (
            <Box minH="100vh" bg="gray.50" py={8}>
                <Container maxW="container.xl">
                    <VStack gap={8} align="stretch">
                        {/* Back Button Skeleton */}
                        <Skeleton height="40px" width="100px" />

                        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12}>
                            {/* Image Skeleton */}
                            <AspectRatio ratio={1}>
                                {getImageSrc() && passedTitle ? (
                                    <Box
                                        bg="white"
                                        borderRadius="xl"
                                        shadow="lg"
                                        overflow="hidden"
                                        position="relative"
                                    >
                                        <Image
                                            src={getImageSrc()}
                                            alt={passedTitle}
                                            objectFit="contain"
                                            objectPosition="center"
                                            w="full"
                                            h="full"
                                            p={8}
                                        />
                                    </Box>
                                ) : (
                                    <Skeleton borderRadius="xl" />
                                )}
                            </AspectRatio>

                            {/* Product Info Skeleton */}
                            <VStack align="stretch" gap={6}>
                                {passedTitle ? (
                                    <Text fontSize="3xl" fontWeight="bold" color="gray.800" lineHeight="short">
                                        {passedTitle}
                                    </Text>
                                ) : (
                                    <Skeleton height="32px" />
                                )}
                                <Skeleton height="20px" width="200px" />
                                <Skeleton height="24px" width="100px" />
                                <Skeleton height="60px" />
                                <Skeleton height="48px" />
                                <Skeleton height="120px" />
                            </VStack>
                        </Grid>
                    </VStack>
                </Container>
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Box minH="100vh" bg="gray.50" py={8}>
                <Container maxW="container.xl">
                    <VStack gap={6}>
                        <Button
                            onClick={() => navigate(-1)}
                            variant="ghost"
                            alignSelf="flex-start"
                            color={"gray.700"}
                            _hover={{ color: "white" }}
                        >
                            <ArrowLeft size={20} />
                            Back
                        </Button>

                        <Box p={6} bg="red.50" borderRadius="lg" border="1px solid" borderColor="red.200">
                            <Text color="red.600" fontWeight="semibold" mb={2}>
                                Error Loading Product
                            </Text>
                            <Text color="gray.600">{error || 'Product not found'}</Text>
                        </Box>

                        <Button colorPalette="blue" onClick={() => navigate('/shop')}>
                            Browse All Products
                        </Button>
                    </VStack>
                </Container>
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="container.xl">
                <VStack gap={8} align="stretch">
                    {/* Back Button */}
                    <Button
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        alignSelf="flex-start"
                        size="lg"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </Button>

                    {/* Main Product Section */}
                    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12}>
                        {/* Product Image - No zoom */}
                        <Box
                            position="relative"
                            bg="white"
                            borderRadius="xl"
                            shadow="lg"
                            overflow="hidden"
                        >
                            <AspectRatio ratio={1}>
                                <Image
                                    src={getImageSrc()}
                                    alt={product.title}
                                    fit="contain"
                                    align="center"
                                    w="full"
                                    h="full"
                                    p={8}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            </AspectRatio>
                        </Box>

                        {/* Product Information */}
                        <VStack align="stretch" gap={6}>
                            {/* Category Badge */}
                            <Badge
                                colorPalette="blue"
                                variant="solid"
                                fontSize="sm"
                                textTransform="capitalize"
                                fontWeight="bold"
                                px={4}
                                py={2}
                                borderRadius="full"
                                alignSelf="flex-start"
                            >
                                {product.category}
                            </Badge>

                            {/* Product Title */}
                            <Text fontSize="3xl" fontWeight="bold" color="gray.800" lineHeight="short">
                                {product.title}
                            </Text>

                            {/* Rating */}
                            <HStack gap={4} align="center">
                                <HStack gap={1}>
                                    <Text fontSize="lg" color="yellow.400">
                                        {renderStars(product.rating.rate)}
                                    </Text>
                                    <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                                        {product.rating.rate.toFixed(1)}
                                    </Text>
                                </HStack>
                                <Text fontSize="sm" color="gray.500">
                                    ({product.rating.count} reviews)
                                </Text>
                            </HStack>

                            {/* Price Section */}
                            <VStack align="flex-start" gap={2}>
                                <HStack gap={4} align="baseline">
                                    <Text fontSize="3xl" fontWeight="bold" color="green.600">
                                        {formatPrice(getDiscountPrice(product.price))}
                                    </Text>
                                    <Text
                                        fontSize="xl"
                                        color="gray.400"
                                        textDecoration="line-through"
                                    >
                                        {formatPrice(product.price)}
                                    </Text>
                                    <Badge colorPalette="red" variant="solid" fontSize="sm">
                                        10% OFF
                                    </Badge>
                                </HStack>
                                <Text fontSize="sm" color="green.600" fontWeight="semibold">
                                    You save {formatPrice(product.price - getDiscountPrice(product.price))}!
                                </Text>
                            </VStack>

                            {/* Description */}
                            <Box>
                                <Text fontSize="md" color="gray.600" lineHeight="tall">
                                    {product.description}
                                </Text>
                            </Box>

                            {/* Quantity Selector */}
                            <VStack align="stretch" gap={3}>
                                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                    Quantity:
                                </Text>
                                <HStack>
                                    <Button
                                        size="sm"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    >
                                        -
                                    </Button>

                                    <Box w="80px">
                                        <input
                                            type="number"
                                            value={quantity}
                                            min={1}
                                            max={10}
                                            onChange={(e) => {
                                                const num = parseInt(e.target.value, 10);
                                                setQuantity(Math.max(1, Math.min(10, isNaN(num) ? 1 : num)));
                                            }}
                                            className="chakra-input css-1c6j008"
                                            style={{ textAlign: "center", width: "100%", padding: "6px 8px", borderRadius: "8px", border: "1px solid #E2E8F0" }}
                                        />
                                    </Box>

                                    <Button
                                        size="sm"
                                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                                    >
                                        +
                                    </Button>

                                    <Text fontSize="sm" color="gray.500">
                                        (Max: 10 items)
                                    </Text>
                                </HStack>
                            </VStack>

                            {/* Action Buttons */}
                            <VStack gap={4} align="stretch">
                                <Button
                                    size="xl"
                                    colorPalette="blue"
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                    _hover={{ transform: 'scale(1.02)' }}
                                    borderRadius="lg"
                                    fontWeight="bold"
                                    h="56px"
                                >
                                    <HStack gap={3}>
                                        {cartQuantity > 0 ? (
                                            <>
                                                <Check size={20} />
                                                <Text>
                                                    {isAdding
                                                        ? 'Adding...'
                                                        : `Add ${quantity} More (${cartQuantity} in cart)`
                                                    }
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={20} />
                                                <Text>
                                                    {isAdding ? 'Adding...' : `Add ${quantity} to Cart`}
                                                </Text>
                                            </>
                                        )}
                                    </HStack>
                                </Button>
                            </VStack>

                            {/* Debug Info */}
                            {/* <Box bg="yellow.50" p={4} borderRadius="md" border="1px solid" borderColor="yellow.200">
                                <Text fontSize="xs" fontWeight="bold" color="yellow.800" mb={2}>
                                    Debug Info (remove in production):
                                </Text>
                                <VStack align="stretch" gap={1}>
                                    <Text fontSize="xs" color="gray.600">
                                        Product ID: {product.id}
                                    </Text>
                                    <Text fontSize="xs" color="gray.600" wordBreak="break-all">
                                        Image URL: {product.image}
                                    </Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Image Error: {imageError ? 'Yes' : 'No'}
                                    </Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Passed Image: {getImageSrc() || 'None'}
                                    </Text>
                                </VStack>
                            </Box> */}

                            {/* Product Features */}
                            <Box
                                bg="blue.50"
                                p={6}
                                borderRadius="xl"
                                border="1px solid"
                                borderColor="blue.100"
                            >
                                <VStack align="stretch" gap={3}>
                                    <Text fontSize="sm" fontWeight="bold" color="blue.700">
                                        Product Features:
                                    </Text>
                                    <VStack align="stretch" gap={2}>
                                        <HStack>
                                            <Text fontSize="sm" color="green.600">✓</Text>
                                            <Text fontSize="sm" color="gray.600">Free shipping on orders over $100</Text>
                                        </HStack>
                                        <HStack>
                                            <Text fontSize="sm" color="green.600">✓</Text>
                                            <Text fontSize="sm" color="gray.600">30-day return policy</Text>
                                        </HStack>
                                        <HStack>
                                            <Text fontSize="sm" color="green.600">✓</Text>
                                            <Text fontSize="sm" color="gray.600">Secure payment processing</Text>
                                        </HStack>
                                        <HStack>
                                            <Text fontSize="sm" color="green.600">✓</Text>
                                            <Text fontSize="sm" color="gray.600">Customer support available</Text>
                                        </HStack>
                                    </VStack>
                                </VStack>
                            </Box>
                        </VStack>
                    </Grid>

                    {/* Related Products Section */}
                    {relatedProducts.length > 0 && (
                        <Box mt={16}>
                            <VStack gap={8} align="stretch">
                                <Box>
                                    <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
                                        Related Products
                                    </Text>
                                    <Text color="gray.600">
                                        Other products from {product.category}
                                    </Text>
                                </Box>

                                <Grid
                                    templateColumns={{
                                        base: "1fr",
                                        md: "repeat(2, 1fr)",
                                        lg: "repeat(3, 1fr)",
                                        xl: "repeat(4, 1fr)",
                                    }}
                                    gap={6}
                                >
                                    {relatedProducts.map((relatedProduct) => (
                                        <ProductCard key={relatedProduct.id} product={relatedProduct} />
                                    ))}
                                </Grid>

                                <Flex justify="center">
                                    <Button
                                        onClick={() => navigate('/shop')}
                                        variant="outline"
                                        colorPalette="blue"
                                        size="lg"
                                        borderRadius="lg"
                                        color={"gray.600"}
                                        _hover={{
                                            bg: "black",
                                            color: "white",
                                            borderColor: "gray.700",
                                        }}
                                    >
                                        View All Products
                                    </Button>
                                </Flex>
                            </VStack>
                        </Box>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default ProductDetails;
