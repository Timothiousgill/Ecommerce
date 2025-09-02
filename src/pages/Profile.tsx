import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    Input,
    VStack,
    HStack,
    Grid,
    Avatar,
    Badge,
    Alert,
    Field,
    Separator,
} from '@chakra-ui/react';
import { User, Mail, Phone, MapPin, Package, ArrowLeft, Edit, Save, X } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../components/hooks/useAuth';
import { useCart } from '../components/hooks/useCart';

interface EditableUser {
    email: string;
    username: string;
    name: {
        firstname: string;
        lastname: string;
    };
    address: {
        city: string;
        street: string;
        number: number;
        zipcode: string;
    };
    phone: string;
}

interface FormErrors {
    [key: string]: string;
}

const Profile: React.FC = () => {
    const { state: authState, logout } = useAuth();
    const { state: cartState } = useCart();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState('');
    
    // Editable form state
    const [editForm, setEditForm] = useState<EditableUser>({
        email: authState.user?.email || '',
        username: authState.user?.username || '',
        name: {
            firstname: authState.user?.name.firstname || '',
            lastname: authState.user?.name.lastname || '',
        },
        address: {
            city: authState.user?.address.city || '',
            street: authState.user?.address.street || '',
            number: authState.user?.address.number || 0,
            zipcode: authState.user?.address.zipcode || '',
        },
        phone: authState.user?.phone || '',
    });

    // Redirect if not authenticated
    if (!authState.isAuthenticated || !authState.user) {
        return (
            <Box minH="100vh" bg="gray.50" py={8}>
                <Container maxW="4xl">
                    <VStack textAlign="center" py={20}>
                        <Text fontSize="xl" color="gray.600" mb={4}>
                            Please log in to view your profile
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

    const { user } = authState;
    const fullName = `${user.name.firstname} ${user.name.lastname}`;
    const initials = `${user.name.firstname.charAt(0)}${user.name.lastname.charAt(0)}`.toUpperCase();

    // Mock order history for demo
    const mockOrders = [
        {
            id: 'ORD001',
            date: '2024-12-15',
            total: 125.99,
            status: 'Delivered',
            items: 3,
        },
        {
            id: 'ORD002',
            date: '2024-12-10',
            total: 89.50,
            status: 'Shipped',
            items: 2,
        },
        {
            id: 'ORD003',
            date: '2024-12-05',
            total: 234.75,
            status: 'Processing',
            items: 5,
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
            default:
                return 'gray';
        }
    };

    // Validation
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!editForm.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!editForm.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (editForm.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!editForm.name.firstname.trim()) {
            newErrors.firstname = 'First name is required';
        }

        if (!editForm.name.lastname.trim()) {
            newErrors.lastname = 'Last name is required';
        }

        if (!editForm.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!editForm.address.street.trim()) {
            newErrors.street = 'Street address is required';
        }

        if (!editForm.address.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!editForm.address.zipcode.trim()) {
            newErrors.zipcode = 'ZIP code is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form changes
    const handleFormChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setEditForm(prev => {
            if (field === 'firstname' || field === 'lastname') {
                return {
                    ...prev,
                    name: { ...prev.name, [field]: value },
                };
            } else if (field === 'street' || field === 'city' || field === 'zipcode' || field === 'number') {
                return {
                    ...prev,
                    address: {
                        ...prev.address,
                        [field]: field === 'number' ? parseInt(value) || 0 : value,
                    },
                };
            } else {
                return { ...prev, [field]: value };
            }
        });

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle save
    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSaving(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setErrors({ general: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setEditForm({
            email: user.email,
            username: user.username,
            name: {
                firstname: user.name.firstname,
                lastname: user.name.lastname,
            },
            address: {
                city: user.address.city,
                street: user.address.street,
                number: user.address.number,
                zipcode: user.address.zipcode,
            },
            phone: user.phone,
        });
        setErrors({});
        setIsEditing(false);
    };

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="6xl">
                <VStack gap={8} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="center">
                        <VStack align="flex-start" gap={1}>
                            <Heading size="xl" color="gray.800">
                                My Profile
                            </Heading>
                            <Text color="gray.600">
                                Manage your account information and preferences
                            </Text>
                        </VStack>

                        <RouterLink to="/">
                            <Button variant="outline" size="sm">
                                <HStack gap={2}>
                                    <ArrowLeft size={16} />
                                    <Text>Back to Home</Text>
                                </HStack>
                            </Button>
                        </RouterLink>
                    </HStack>

                    {/* Success Message */}
                    {successMessage && (
                        <Alert.Root status="success" borderRadius="md">
                            <Alert.Indicator />
                            <Alert.Title>Success!</Alert.Title>
                            <Alert.Description>{successMessage}</Alert.Description>
                        </Alert.Root>
                    )}

                    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} alignItems="start">
                        {/* Profile Information */}
                        <Box bg="white" p={8} borderRadius="xl" shadow="sm">
                            <HStack justify="space-between" mb={6}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                                    Profile Information
                                </Text>
                                {!isEditing ? (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <HStack gap={2}>
                                            <Edit size={16} />
                                            <Text>Edit</Text>
                                        </HStack>
                                    </Button>
                                ) : (
                                    <HStack gap={2}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCancel}
                                        >
                                            <HStack gap={2}>
                                                <X size={16} />
                                                <Text>Cancel</Text>
                                            </HStack>
                                        </Button>
                                        <Button
                                            size="sm"
                                            colorScheme="blue"
                                            onClick={handleSave}
                                            loading={isSaving}
                                            loadingText="Saving..."
                                        >
                                            <HStack gap={2}>
                                                <Save size={16} />
                                                <Text>Save</Text>
                                            </HStack>
                                        </Button>
                                    </HStack>
                                )}
                            </HStack>

                            {/* Profile Avatar */}
                            <VStack gap={4} mb={6}>
                                <Avatar.Root size="xl" bg="blue.500" color="white">
                                    <Avatar.Fallback fontSize="2xl" fontWeight="bold">
                                        {initials}
                                    </Avatar.Fallback>
                                </Avatar.Root>
                                <VStack gap={0}>
                                    <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                                        {fullName}
                                    </Text>
                                    <Text color="gray.500">@{user.username}</Text>
                                </VStack>
                            </VStack>

                            {errors.general && (
                                <Alert.Root status="error" borderRadius="md" mb={4}>
                                    <Alert.Indicator />
                                    <Alert.Title>Error</Alert.Title>
                                    <Alert.Description>{errors.general}</Alert.Description>
                                </Alert.Root>
                            )}

                            {isEditing ? (
                                /* Edit Form */
                                <Box as="form" onSubmit={handleSave}>
                                    <VStack gap={4} align="stretch">
                                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                            <Field.Root invalid={!!errors.firstname}>
                                                <Field.Label>First Name</Field.Label>
                                                <Input
                                                    value={editForm.name.firstname}
                                                    onChange={handleFormChange('firstname')}
                                                    color="gray.700"
                                                />
                                                <Field.ErrorText>{errors.firstname}</Field.ErrorText>
                                            </Field.Root>

                                            <Field.Root invalid={!!errors.lastname}>
                                                <Field.Label>Last Name</Field.Label>
                                                <Input
                                                    value={editForm.name.lastname}
                                                    onChange={handleFormChange('lastname')}
                                                    color="gray.700"
                                                />
                                                <Field.ErrorText>{errors.lastname}</Field.ErrorText>
                                            </Field.Root>
                                        </Grid>

                                        <Field.Root invalid={!!errors.email}>
                                            <Field.Label>Email</Field.Label>
                                            <Input
                                                type="email"
                                                value={editForm.email}
                                                onChange={handleFormChange('email')}
                                                color="gray.700"
                                            />
                                            <Field.ErrorText>{errors.email}</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.username}>
                                            <Field.Label>Username</Field.Label>
                                            <Input
                                                value={editForm.username}
                                                onChange={handleFormChange('username')}
                                                color="gray.700"
                                            />
                                            <Field.ErrorText>{errors.username}</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.phone}>
                                            <Field.Label>Phone</Field.Label>
                                            <Input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={handleFormChange('phone')}
                                                color="gray.700"
                                            />
                                            <Field.ErrorText>{errors.phone}</Field.ErrorText>
                                        </Field.Root>

                                        <Separator />

                                        <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                            Address
                                        </Text>

                                        <Field.Root invalid={!!errors.street}>
                                            <Field.Label>Street Address</Field.Label>
                                            <Input
                                                value={editForm.address.street}
                                                onChange={handleFormChange('street')}
                                                color="gray.700"
                                            />
                                            <Field.ErrorText>{errors.street}</Field.ErrorText>
                                        </Field.Root>

                                        <Grid templateColumns="2fr 1fr" gap={4}>
                                            <Field.Root invalid={!!errors.city}>
                                                <Field.Label>City</Field.Label>
                                                <Input
                                                    value={editForm.address.city}
                                                    onChange={handleFormChange('city')}
                                                    color="gray.700"
                                                />
                                                <Field.ErrorText>{errors.city}</Field.ErrorText>
                                            </Field.Root>

                                            <Field.Root invalid={!!errors.zipcode}>
                                                <Field.Label>ZIP Code</Field.Label>
                                                <Input
                                                    value={editForm.address.zipcode}
                                                    onChange={handleFormChange('zipcode')}
                                                    color="gray.700"
                                                />
                                                <Field.ErrorText>{errors.zipcode}</Field.ErrorText>
                                            </Field.Root>
                                        </Grid>
                                    </VStack>
                                </Box>
                            ) : (
                                /* View Mode */
                                <VStack gap={4} align="stretch">
                                    <HStack gap={3}>
                                        <User size={18} color="#6B7280" />
                                        <VStack align="flex-start" gap={0}>
                                            <Text fontSize="sm" color="gray.500">Full Name</Text>
                                            <Text fontWeight="medium" color="gray.700">{fullName}</Text>
                                        </VStack>
                                    </HStack>

                                    <HStack gap={3}>
                                        <Mail size={18} color="#6B7280" />
                                        <VStack align="flex-start" gap={0}>
                                            <Text fontSize="sm" color="gray.500">Email</Text>
                                            <Text fontWeight="medium" color="gray.700">{user.email}</Text>
                                        </VStack>
                                    </HStack>

                                    <HStack gap={3}>
                                        <User size={18} color="#6B7280" />
                                        <VStack align="flex-start" gap={0}>
                                            <Text fontSize="sm" color="gray.500">Username</Text>
                                            <Text fontWeight="medium" color="gray.700">@{user.username}</Text>
                                        </VStack>
                                    </HStack>

                                    <HStack gap={3}>
                                        <Phone size={18} color="#6B7280" />
                                        <VStack align="flex-start" gap={0}>
                                            <Text fontSize="sm" color="gray.500">Phone</Text>
                                            <Text fontWeight="medium" color="gray.700">{user.phone}</Text>
                                        </VStack>
                                    </HStack>

                                    <HStack gap={3} align="flex-start">
                                        <MapPin size={18} color="#6B7280" />
                                        <VStack align="flex-start" gap={0}>
                                            <Text fontSize="sm" color="gray.500">Address</Text>
                                            <Text fontWeight="medium" color="gray.700">
                                                {user.address.street}, {user.address.number}
                                            </Text>
                                            <Text fontWeight="medium" color="gray.700">
                                                {user.address.city}, {user.address.zipcode}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            )}
                        </Box>

                        {/* Account Overview & Quick Actions */}
                        <VStack gap={6} align="stretch">
                            {/* Account Stats */}
                            <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                                <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
                                    Account Overview
                                </Text>
                                <VStack gap={4} align="stretch">
                                    <HStack justify="space-between" p={4} bg="blue.50" borderRadius="lg">
                                        <VStack align="flex-start" gap={0}>
                                            <Text fontSize="sm" color="blue.600">Cart Items</Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                                                {cartState.totalItems}
                                            </Text>
                                        </VStack>
                                        <Box p={2} bg="blue.100" borderRadius="md">
                                            <Package size={24} color="#2563EB" />
                                        </Box>
                                    </HStack>

                                    <HStack justify="space-between" p={4} bg="green.50" borderRadius="lg">
                                        <VStack align="flex-start" gap={0}>
                                            <Text fontSize="sm" color="green.600">Total Orders</Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="green.700">
                                                {mockOrders.length}
                                            </Text>
                                        </VStack>
                                        <Box p={2} bg="green.100" borderRadius="md">
                                            <Package size={24} color="#059669" />
                                        </Box>
                                    </HStack>

                                    <HStack justify="space-between" p={4} bg="purple.50" borderRadius="lg">
                                        <VStack align="flex-start" gap={0}>
                                            <Text fontSize="sm" color="purple.600">Cart Value</Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="purple.700">
                                                ${cartState.totalPrice.toFixed(2)}
                                            </Text>
                                        </VStack>
                                        <Box p={2} bg="purple.100" borderRadius="md">
                                            <Package size={24} color="#7C3AED" />
                                        </Box>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* Recent Orders */}
                            <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                                <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
                                    Recent Orders
                                </Text>
                                <VStack gap={3} align="stretch">
                                    {mockOrders.map((order) => (
                                        <HStack
                                            key={order.id}
                                            justify="space-between"
                                            p={4}
                                            bg="gray.50"
                                            borderRadius="lg"
                                            _hover={{ bg: "gray.100" }}
                                            transition="background 0.2s"
                                            cursor="pointer"
                                        >
                                            <VStack align="flex-start" gap={1}>
                                                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                                    Order #{order.id}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    {new Date(order.date).toLocaleDateString()} • {order.items} items
                                                </Text>
                                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                                    ${order.total.toFixed(2)}
                                                </Text>
                                            </VStack>
                                            <Badge colorScheme={getStatusColor(order.status)} variant="subtle">
                                                {order.status}
                                            </Badge>
                                        </HStack>
                                    ))}
                                </VStack>
                            </Box>

                            {/* Quick Actions */}
                            <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                                <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
                                    Quick Actions
                                </Text>
                                <VStack gap={3} align="stretch">
                                    <RouterLink to="/cart">
                                        <Button w="full" variant="outline" colorScheme="blue">
                                            <HStack gap={2}>
                                                <Package size={16} />
                                                <Text>View Cart ({cartState.totalItems})</Text>
                                            </HStack>
                                        </Button>
                                    </RouterLink>

                                    <RouterLink to="/shop">
                                        <Button w="full" variant="outline" colorScheme="green">
                                            <HStack gap={2}>
                                                <Package size={16} />
                                                <Text>Continue Shopping</Text>
                                            </HStack>
                                        </Button>
                                    </RouterLink>

                                    <Button
                                        w="full"
                                        variant="outline"
                                        colorScheme="red"
                                        onClick={logout}
                                    >
                                        <HStack gap={2}>
                                            <User size={16} />
                                            <Text>Logout</Text>
                                        </HStack>
                                    </Button>
                                </VStack>
                            </Box>
                        </VStack>
                    </Grid>
                </VStack>
            </Container>
        </Box>
    );
};

export default Profile;