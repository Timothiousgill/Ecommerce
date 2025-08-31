import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Grid,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../components/hooks/useCart';

const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = state.totalPrice;
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const shippingCost = subtotal >= 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shippingCost;

  // Format currency
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  // Handle quantity change
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (state.items.length === 0) return;
    navigate('/checkout');
  };

  // Empty cart state
  if (state.items.length === 0) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="container.xl">
          <VStack gap={8} align="center" py={20}>
            <Box
              p={8}
              bg="white"
              borderRadius="2xl"
              shadow="lg"
              textAlign="center"
              maxW="md"
            >
              <Box
                mx="auto"
                mb={6}
                p={4}
                bg="gray.100"
                borderRadius="full"
                w="fit-content"
              >
                <ShoppingBag size={48} color="#9CA3AF" />
              </Box>

              <Heading size="lg" mb={4} color="gray.700">
                Your cart is empty
              </Heading>

              <Text color="gray.500" mb={6}>
                Looks like you haven't added any items to your cart yet.
                Start shopping to fill it up!
              </Text>

              {/* Fixed: Wrap Button in RouterLink */}
              <RouterLink to="/shop">
                <Button
                  colorScheme="blue"
                  size="lg"
                  borderRadius="xl"
                >
                  <HStack gap={2}>
                    <ArrowLeft size={16} />
                    <Text>Continue Shopping</Text>
                  </HStack>
                </Button>
              </RouterLink>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <VStack align="flex-start" gap={1}>
              <Heading size="xl" color="gray.800">
                Shopping Cart
              </Heading>
              <Text color="gray.600">
                {state.totalItems} {state.totalItems === 1 ? 'item' : 'items'} in your cart
              </Text>
            </VStack>

            {/* Fixed: Wrap Button in RouterLink */}
            <RouterLink to="/shop">
              <Button
                variant="outline"
                size="sm"
                _hover={{}}
              >
                <HStack gap={2}>
                  <ArrowLeft size={16} />
                  <Text color="gray.500" _hover={{ color: "white" }}>
                    Continue Shopping
                  </Text>
                </HStack>
              </Button>

            </RouterLink>
          </HStack>

          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={8}
            alignItems="start"
          >
            {/* Cart Items */}
            <Box
              bg="white"
              borderRadius="xl"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
              overflow="hidden"
            >
              <Box p={6} borderBottom="1px solid" borderBottomColor="gray.200">
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                    Cart Items
                  </Text>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="red.500"
                    _hover={{ bg: "transparent", color: "red.500" }}
                    _active={{ bg: "transparent" }}
                    onClick={clearCart}
                  >
                    Clear All
                  </Button>

                </HStack>
              </Box>

              <VStack gap={0} align="stretch">
                {state.items.map((item, index) => (
                  <Box
                    key={item.id}
                    p={6}
                    borderBottom={
                      index !== state.items.length - 1
                        ? "1px solid"
                        : "none"
                    }
                    borderBottomColor="gray.200"
                  >
                    <Grid
                      templateColumns={{ base: "80px 1fr", md: "100px 1fr auto auto auto" }}
                      gap={4}
                      alignItems="center"
                    >
                      {/* Product Image */}
                      <Box>
                        <Image
                          src={item.image}
                          alt={item.title}
                          w="full"
                          h={{ base: "80px", md: "100px" }}
                          objectFit="cover"
                          borderRadius="lg"
                          bg="gray.100"
                        />
                      </Box>

                      {/* Product Info */}
                      <VStack align="flex-start" gap={2}>
                        <Text
                          fontWeight="semibold"
                          fontSize={{ base: "sm", md: "md" }}
                          lineHeight="short"
                          lineClamp={2}
                        >
                          {item.title}
                        </Text>
                        <Badge
                          colorScheme="blue"
                          variant="subtle"
                          fontSize="xs"
                          textTransform="capitalize"
                        >
                          {item.category}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {formatCurrency(item.price)} each
                        </Text>
                      </VStack>

                      {/* Quantity Controls - Mobile */}
                      <Box display={{ base: "block", md: "none" }}>
                        <VStack align="flex-end" gap={3}>
                          <HStack>
                            <IconButton
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </IconButton>

                            <Text
                              minW="40px"
                              textAlign="center"
                              fontWeight="semibold"
                            >
                              {item.quantity}
                            </Text>

                            <IconButton
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </IconButton>
                          </HStack>

                          <HStack>
                            <Text fontWeight="bold" color="green.600">
                              {formatCurrency(item.price * item.quantity)}
                            </Text>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </HStack>
                        </VStack>
                      </Box>

                      {/* Desktop Layout */}
                      <>
                        {/* Quantity Controls - Desktop */}
                        <Box display={{ base: "none", md: "block" }}>
                          <HStack>
                            <IconButton
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </IconButton>

                            <Text
                              minW="40px"
                              textAlign="center"
                              fontWeight="semibold"
                            >
                              {item.quantity}
                            </Text>

                            <IconButton
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </IconButton>
                          </HStack>
                        </Box>

                        {/* Subtotal - Desktop */}
                        <Box display={{ base: "none", md: "block" }}>
                          <Text fontWeight="bold" color="green.600" minW="80px" textAlign="right">
                            {formatCurrency(item.price * item.quantity)}
                          </Text>
                        </Box>

                        {/* Remove Button - Desktop */}
                        <Box display={{ base: "none", md: "block" }}>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </>
                    </Grid>
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Order Summary */}
            <Box
              bg="white"
              borderRadius="xl"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
              p={6}

              position="sticky"
              top="100px"
            >
              <Text fontSize="lg" fontWeight="semibold" mb={6} color={"gray.500"}>
                Order Summary
              </Text>

              <VStack gap={4} align="stretch">
                {/* Subtotal */}
                <HStack justify="space-between">
                  <Text color="gray.600">
                    Subtotal ({state.totalItems} items)
                  </Text>
                  <Text fontWeight="semibold" color="gray.600">
                    {formatCurrency(subtotal)}
                  </Text>
                </HStack>

                {/* Tax */}
                <HStack justify="space-between">
                  <Text color="gray.600">Tax (8%)</Text>
                  <Text fontWeight="semibold" color="gray.600">
                    {formatCurrency(tax)}
                  </Text>
                </HStack>

                {/* Shipping */}
                <HStack justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <HStack>
                    {shippingCost === 0 && (
                      <Badge colorScheme="green" variant="subtle" fontSize="xs">
                        FREE
                      </Badge>
                    )}
                    <Text fontWeight="semibold">
                      {formatCurrency(shippingCost)}
                    </Text>
                  </HStack>
                </HStack>

                {/* Free shipping notice */}
                {subtotal < 100 && (
                  <Text fontSize="xs" color="blue.600" textAlign="center">
                    Add {formatCurrency(100 - subtotal)} more for free shipping!
                  </Text>
                )}

                <Box borderTop="1px solid" borderTopColor="gray.200" pt={4}>
                  <HStack justify="space-between" mb={6}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.600">
                      Total
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="green.600">
                      {formatCurrency(total)}
                    </Text>
                  </HStack>

                  <VStack gap={4}>
                    <Button
                      w="full"
                      colorScheme="blue"
                      size="lg"
                      borderRadius="xl"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>

                    {/* Fixed: Wrap Button in RouterLink */}
                    <RouterLink to="/shop">
                      <Button
                        w="full"
                        variant="outline"
                        size="md"
                        color="red.500"
                        borderColor="red.500"
                        _hover={{ bg: "transparent", color: "red.600", borderColor: "red.600" }}
                        _active={{ bg: "transparent" }}
                      >
                        Continue Shopping
                      </Button>
                    </RouterLink>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Cart;