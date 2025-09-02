import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Grid,
    Badge,
    Separator,
} from '@chakra-ui/react';
import { Package, ArrowLeft, Eye, Download } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../components/hooks/useAuth';

interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
    items: Array<{
        id: string;
        title: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    shippingAddress: string;
    trackingNumber?: string;
}

const OrderHistory: React.FC = () => {
    const { state: authState } = useAuth();

    // Redirect if not authenticated
    if (!authState.isAuthenticated || !authState.user) {
        return (
            <Box minH="100vh" bg="gray.50" py={8}>
                <Container maxW="4xl">
                    <VStack textAlign="center" py={20}>
                        <Text fontSize="xl" color="gray.600" mb={4}>
                            Please log in to view your order history
                        </Text>
                        <RouterLink to="/">
                            <Button colorScheme="blue">
                                Go Home
                            </Button>
                        </RouterLink>
                    </VStack>
                </Container>
            </Box>
        );
    }

    // Mock order data with more details
    const mockOrders: Order[] = [
        {
            id: 'ORD001',
            date: '2024-12-15',
            total: 125.99,
            status: 'Delivered',
            trackingNumber: 'TRK123456789',
            shippingAddress: `${authState.user.address.street}, ${authState.user.address.city}`,
            items: [
                {
                    id: '1',
                    title: 'Fjallraven - Foldsack No. 1 Backpack',
                    price: 109.95,
                    quantity: 1,
                    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
                },
                {
                    id: '2',
                    title: 'Mens Casual Premium Slim Fit T-Shirts',
                    price: 22.30,
                    quantity: 1,
                    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
                }
            ]
        },
        {
            id: 'ORD002',
            date: '2024-12-10',
            total: 89.50,
            status: 'Shipped',
            trackingNumber: 'TRK987654321',
            shippingAddress: `${authState.user.address.street}, ${authState.user.address.city}`,
            items: [
                {
                    id: '3',
                    title: 'Mens Cotton Jacket',
                    price: 55.99,
                    quantity: 1,
                    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'
                }
            ]
        },
        {
            id: 'ORD003',
            date: '2024-12-05',
            total: 234.75,
            status: 'Processing',
            shippingAddress: `${authState.user.address.street}, ${authState.user.address.city}`,
            items: [
                {
                    id: '4',
                    title: 'White Gold Plated Princess',
                    price: 9.99,
                    quantity: 2,
                    image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg'
                },
                {
                    id: '5',
                    title: 'SanDisk SSD PLUS 1TB',
                    price: 109.00,
                    quantity: 2,
                    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg'
                }
            ]
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered':
                return 'green';
            case 'Shipped':
                return 'blue';
            case 'Processing':
                return 'yellow';
            case 'Cancelled':
                return 'red';
            default:
                return 'gray';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="6xl">
                <VStack gap={8} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="center">
                        <VStack align="flex-start" gap={1}>
                            <Heading size="xl" color="gray.800">
                                Order History
                            </Heading>
                            <Text color="gray.600">
                                Track and manage your previous orders
                            </Text>
                        </VStack>

                        <RouterLink to="/profile">
                            <Button variant="outline" size="sm">
                                <HStack gap={2}>
                                    <ArrowLeft size={16} />
                                    <Text>Back to Profile</Text>
                                </HStack>
                            </Button>
                        </RouterLink>
                    </HStack>

                    {/* Orders List */}
                    <VStack gap={6} align="stretch">
                        {mockOrders.map((order) => (
                            <Box key={order.id} bg="white" p={6} borderRadius="xl" shadow="sm">
                                {/* Order Header */}
                                <HStack justify="space-between" mb={4}>
                                    <VStack align="flex-start" gap={1}>
                                        <HStack gap={3}>
                                            <Text fontSize="lg" fontWeight="bold" color="gray.700">
                                                Order #{order.id}
                                            </Text>
                                            <Badge colorScheme={getStatusColor(order.status)} variant="subtle">
                                                {order.status}
                                            </Badge>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.500">
                                            Placed on {formatDate(order.date)}
                                        </Text>
                                    </VStack>
                                    <VStack align="flex-end" gap={1}>
                                        <Text fontSize="lg" fontWeight="bold" color="gray.700">
                                            ${order.total.toFixed(2)}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                        </Text>
                                    </VStack>
                                </HStack>

                                <Separator mb={4} />

                                {/* Order Items */}
                                <VStack gap={3} align="stretch" mb={4}>
                                    {order.items.map((item) => (
                                        <HStack key={item.id} gap={4}>
                                            <Box
                                                w={16}
                                                h={16}
                                                bg="gray.100"
                                                borderRadius="md"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                overflow="hidden"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </Box>
                                            <VStack align="flex-start" gap={1} flex={1}>
                                                <Text fontSize="sm" fontWeight="medium" color="gray.700" lineClamp={2}>
                                                    {item.title}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    Quantity: {item.quantity}
                                                </Text>
                                            </VStack>
                                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Text>
                                        </HStack>
                                    ))}
                                </VStack>

                                {/* Order Details */}
                                <Box p={4} bg="gray.50" borderRadius="lg" mb={4}>
                                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                                        <VStack align="flex-start" gap={2}>
                                            <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                                Shipping Address
                                            </Text>
                                            <Text fontSize="sm" color="gray.700">
                                                {order.shippingAddress}
                                            </Text>
                                        </VStack>
                                        {order.trackingNumber && (
                                            <VStack align="flex-start" gap={2}>
                                                <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                                    Tracking Number
                                                </Text>
                                                <Text fontSize="sm" color="blue.600" fontFamily="mono">
                                                    {order.trackingNumber}
                                                </Text>
                                            </VStack>
                                        )}
                                    </Grid>
                                </Box>

                                {/* Order Actions */}
                                <HStack gap={3}>
                                    <Button size="sm" variant="outline" colorScheme="blue">
                                        <HStack gap={2}>
                                            <Eye size={16} />
                                            <Text>View Details</Text>
                                        </HStack>
                                    </Button>
                                    <Button size="sm" variant="outline" colorScheme="gray">
                                        <HStack gap={2}>
                                            <Download size={16} />
                                            <Text>Download Invoice</Text>
                                        </HStack>
                                    </Button>
                                    {order.status === 'Delivered' && (
                                        <Button size="sm" variant="outline" colorScheme="green">
                                            <HStack gap={2}>
                                                <Package size={16} />
                                                <Text>Reorder</Text>
                                            </HStack>
                                        </Button>
                                    )}
                                </HStack>
                            </Box>
                        ))}

                        {/* Empty State */}
                        {mockOrders.length === 0 && (
                            <Box bg="white" p={12} borderRadius="xl" shadow="sm" textAlign="center">
                                <Box
                                    mx="auto"
                                    mb={6}
                                    p={4}
                                    bg="gray.100"
                                    borderRadius="full"
                                    w="fit-content"
                                >
                                    <Package size={48} color="#9CA3AF" />
                                </Box>
                                <Heading size="lg" mb={4} color="gray.700">
                                    No orders yet
                                </Heading>
                                <Text color="gray.500" mb={6}>
                                    When you place your first order, it will appear here.
                                </Text>
                                <RouterLink to="/shop">
                                    <Button colorScheme="blue" size="lg">
                                        Start Shopping
                                    </Button>
                                </RouterLink>
                            </Box>
                        )}
                    </VStack>
                </VStack>
            </Container>
        </Box>
    );
};

export default OrderHistory;