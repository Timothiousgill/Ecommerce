import React, { useState } from 'react';
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
import { ShoppingCart, Check } from 'lucide-react';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
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

  const handleAddToCart = async () => {
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

  const defaultImage = 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <Box
      borderWidth="1px"
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
    >
      {/* Product Image */}
      <AspectRatio ratio={1} mb={3}>
        <Box>
          {!imageLoaded && !imageError && <Skeleton w="full" h="full" />}
          <Image
            src={imageError ? defaultImage : product.image}
            alt={product.title}
            objectFit="cover"
            w="full"
            h="full"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            display={imageLoaded ? 'block' : 'none'}
          />
        </Box>
      </AspectRatio>

      {/* Card Content */}
      <VStack p={4} align="stretch" gap={3} flex={1}>
        {/* Category */}
        <Badge
          colorScheme="blue"
          variant="subtle"
          alignSelf="flex-start"
          fontSize="xs"
          textTransform="capitalize"
        >
          {product.category}
        </Badge>

        {/* Title */}
        <Text
          fontSize="md"
          fontWeight="semibold"
          lineHeight="short"
          color="gray.800"
          title={product.title}
          minH="40px"
        >
          {truncateTitle(product.title)}
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
          colorScheme="blue"
          size="md"
          mt="auto"
          onClick={handleAddToCart}
          disabled={isAdding}
          _hover={{ transform: 'scale(1.02)' }}
          position="relative"
          overflow="hidden"
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
            size="sm"
            variant="outline"
            colorScheme="blue"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            Add Another
          </Button>
        )}
      </VStack>

      {/* Discount Badge (optional) - uncomment to show */}
      {/* <Badge
        position="absolute"
        top={2}
        right={2}
        colorScheme="red"
        variant="solid"
        fontSize="xs"
      >
        10% OFF
      </Badge> */}
    </Box>
  );
};

export default ProductCard;