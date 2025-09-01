import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  Skeleton,
  AspectRatio,
  createToaster,
} from '@chakra-ui/react';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { useCart } from '../components/hooks/useCart'; 

// Product interface
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  category: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

// Create toaster instance
const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  console.log(product,"data");
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { addToCart, getItemQuantity } = useCart();

  const cartQuantity = getItemQuantity(product.id);

  // Format price with currency
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  // Truncate title if too long
  const truncateTitle = (title: string, maxLength: number = 50) =>
    title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    
    try {
      setIsAdding(true);
      addToCart(product);
      
      toaster.create({
        title: "Added to cart!",
        description: `${product.title} has been added to your cart.`,
        type: "success",
        duration: 2000,
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

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigate(`/product/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const defaultImage = 'https://placehold.co/300x300?text=No+Image';

  return (
    <Box
      w="full"
      maxW="400px"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      overflow="hidden"
      shadow="md"
      bg="white"
      transition="all 0.3s ease"
      _hover={{ 
        shadow: 'xl', 
        transform: 'translateY(-4px)',
        borderColor: 'blue.200'
      }}
      h="full"
      display="flex"
      flexDirection="column"
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cursor="pointer"
      onClick={handleCardClick}
    >
      {/* Product Image Container */}
      <Box position="relative" overflow="hidden">
        <AspectRatio ratio={4/3} mb={0}>
          <Box position="relative" w="full" h="full">
            {!imageLoaded && !imageError && <Skeleton w="full" h="full" />}
            <Image
              src={imageError ? defaultImage : product.image}
              alt={product.title}
              objectFit="contain"
              objectPosition="center"
              w="full"
              h="full"
              p={2}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              display={imageLoaded ? 'block' : 'none'}
            />

            {/* Hover Overlay with View Product Button */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.400"
              opacity={isHovered ? 1 : 0}
              transition="opacity 0.3s ease"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                size="md"
                variant="solid"
                opacity={isHovered ? 1 : 0}
                transform={isHovered ? "translateY(0)" : "translateY(20px)"}
                transition="all 0.3s ease"
                bg="white"
                color="gray.800"
                _hover={{ bg: "gray.100" }}
                borderRadius="lg"
                fontWeight="bold"
                onClick={handleViewProduct}
              >
                <HStack gap={2}>
                  <Eye size={18} />
                  <Text>View Product</Text>
                </HStack>
              </Button>
            </Box>

            {/* Category Badge */}
            <Badge
              position="absolute"
              top={3}
              left={3}
              colorPalette="blue"
              variant="solid"
              fontSize="xs"
              textTransform="capitalize"
              fontWeight="bold"
              px={3}
              py={1}
              borderRadius="full"
            >
              {product.category}
            </Badge>
          </Box>
        </AspectRatio>
      </Box>

      {/* Card Content */}
      <VStack p={5} align="stretch" gap={3} flex={1}>
        {/* Title */}
        <Text
          fontSize="lg"
          fontWeight="semibold"
          lineHeight="short"
          color="gray.800"
          title={product.title}
          minH="48px"
        >
          {truncateTitle(product.title, 60)}
        </Text>

        {/* Rating */}
        <HStack gap={1} alignItems="center">
          <Text fontSize="sm" color="yellow.400">
            {renderStars(product.rating.rate)}
          </Text>
          <Text fontSize="sm" color="gray.500">
            ({product.rating.count})
          </Text>
        </HStack>

        {/* Price */}
        <Text fontSize="xl" fontWeight="bold" color="green.600">
          {formatPrice(product.price)}
        </Text>

        {/* Add to Cart Button */}
        <Button
          colorPalette="blue"
          size="lg"
          mt="auto"
          onClick={handleAddToCart}
          disabled={isAdding}
          _hover={{ transform: 'scale(1.02)' }}
          borderRadius="lg"
          fontWeight="bold"
          h="48px"
        >
          <HStack gap={2}>
            {cartQuantity > 0 ? (
              <>
                <Check size={18} />
                <Text>In Cart ({cartQuantity})</Text>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <Text>{isAdding ? 'Adding...' : 'Add to Cart'}</Text>
              </>
            )}
          </HStack>
        </Button>

        {/* Quick Add More Button (if already in cart) */}
        {cartQuantity > 0 && (
          <Button
            size="md"
            variant="outline"
            colorPalette="blue"
            onClick={handleAddToCart}
            disabled={isAdding}
            borderRadius="lg"
          >
            Add Another
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default ProductCard;