import React, { useState } from 'react';
import {
    Box,
    Text,
    Button,
    VStack,
    HStack,
    Avatar,
} from '@chakra-ui/react';
import { User, Package, Settings, LogOut, ChevronDown } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

export const UserMenu: React.FC = () => {
    const { state: authState, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    if (!authState.isAuthenticated || !authState.user) {
        return null;
    }

    const { user } = authState;
    const initials = `${user.name.firstname.charAt(0)}${user.name.lastname.charAt(0)}`.toUpperCase();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const handleMenuClick = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <Box position="relative">
            {/* User Avatar Button */}
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                p={2}
                _hover={{ bg: "rgba(16, 185, 129, 0.1)" }}
                _active={{ bg: "rgba(16, 185, 129, 0.2)" }}
            >
                <HStack gap={2}>
                    <Avatar.Root size="sm" bg="blue.500" color="white">
                        <Avatar.Fallback fontSize="sm" fontWeight="bold">
                            {initials}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <Text fontSize="sm" color="white" display={{ base: "none", lg: "block" }}>
                        {user.name.firstname}
                    </Text>
                    <Box
                        as={ChevronDown}
                        boxSize={4}
                        color="white"
                        transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                        transition="transform 0.2s"
                    />
                </HStack>
            </Button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <Box
                        position="fixed"
                        top={0}
                        left={0}
                        w="100vw"
                        h="100vh"
                        zIndex={98}
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Menu */}
                    <Box
                        position="absolute"
                        top="100%"
                        right={0}
                        mt={2}
                        w="250px"
                        bg="#1C283C"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="rgba(16, 185, 129, 0.2)"
                        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        zIndex={99}
                        overflow="hidden"
                    >
                        {/* User Info Header */}
                        <Box p={4} borderBottom="1px solid" borderBottomColor="rgba(16, 185, 129, 0.2)">
                            <HStack gap={3}>
                                <Avatar.Root size="md" bg="blue.500" color="white">
                                    <Avatar.Fallback fontSize="md" fontWeight="bold">
                                        {initials}
                                    </Avatar.Fallback>
                                </Avatar.Root>
                                <VStack align="flex-start" gap={0}>
                                    <Text fontSize="sm" fontWeight="semibold" color="white">
                                        {user.name.firstname} {user.name.lastname}
                                    </Text>
                                    <Text fontSize="xs" color="#9CA3AF">
                                        @{user.username}
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>

                        {/* Menu Items */}
                        <VStack gap={0} p={2}>
                            {/* Profile */}
                            <Box
                                w="full"
                                p={3}
                                cursor="pointer"
                                borderRadius="md"
                                _hover={{
                                    bg: "rgba(16, 185, 129, 0.1)",
                                }}
                                transition="all 0.2s"
                                onClick={() => handleMenuClick('/profile')}
                            >
                                <HStack gap={3}>
                                    <User size={16} color="#9CA3AF" />
                                    <Text fontSize="sm" color="#9CA3AF" _hover={{ color: "#10B981" }}>
                                        Profile
                                    </Text>
                                </HStack>
                            </Box>

                            {/* Order History */}
                            <Box
                                w="full"
                                p={3}
                                cursor="pointer"
                                borderRadius="md"
                                _hover={{
                                    bg: "rgba(16, 185, 129, 0.1)",
                                }}
                                transition="all 0.2s"
                                onClick={() => handleMenuClick('/history')}
                            >
                                <HStack gap={3}>
                                    <Package size={16} color="#9CA3AF" />
                                    <Text fontSize="sm" color="#9CA3AF" _hover={{ color: "#10B981" }}>
                                        Order History
                                    </Text>
                                </HStack>
                            </Box>

                            {/* Settings */}
                            <Box
                                w="full"
                                p={3}
                                cursor="pointer"
                                borderRadius="md"
                                _hover={{
                                    bg: "rgba(16, 185, 129, 0.1)",
                                }}
                                transition="all 0.2s"
                                onClick={() => handleMenuClick('/settings')}
                            >
                                <HStack gap={3}>
                                    <Settings size={16} color="#9CA3AF" />
                                    <Text fontSize="sm" color="#9CA3AF" _hover={{ color: "#10B981" }}>
                                        Settings
                                    </Text>
                                </HStack>
                            </Box>
                        </VStack>

                        {/* Logout */}
                        <Box p={2} borderTop="1px solid" borderTopColor="rgba(16, 185, 129, 0.2)">
                            <Box
                                w="full"
                                p={3}
                                cursor="pointer"
                                borderRadius="md"
                                _hover={{
                                    bg: "rgba(239, 68, 68, 0.1)",
                                }}
                                transition="all 0.2s"
                                onClick={handleLogout}
                            >
                                <HStack gap={3}>
                                    <LogOut size={16} color="#EF4444" />
                                    <Text fontSize="sm" color="#EF4444">
                                        Logout
                                    </Text>
                                </HStack>
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};