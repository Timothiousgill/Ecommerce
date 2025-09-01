import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Avatar,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@chakra-ui/react';
import { User, Package, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';

export const UserMenu: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { state: cartState } = useCart();

  if (!authState.isAuthenticated || !authState.user) {
    return null;
  }

  const { user } = authState;
  const fullName = `${user.name.firstname} ${user.name.lastname}`;
  const initials = `${user.name.firstname.charAt(0)}${user.name.lastname.charAt(0)}`.toUpperCase();

  const handleLogout = () => {
    logout();
  };

 
  const orderCount = 3; 

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          p={2}
          _hover={{ bg: 'rgba(16, 185, 129, 0.1)' }}
          _active={{ bg: 'rgba(16, 185, 129, 0.2)' }}
        >
          <HStack gap={2}>
            <Avatar.Root size="sm">
              <Avatar.Fallback>{initials}</Avatar.Fallback>
            </Avatar.Root>
            <Box display={{ base: 'none', md: 'block' }}>
              <Text fontSize="sm" fontWeight="medium" color="white">
                {user.name.firstname}
              </Text>
            </Box>
            <ChevronDown size={16} color="white" />
          </HStack>
        </Button>
      </MenuTrigger>

      <MenuContent
        bg="#1C283C"
        border="1px solid"
        borderColor="rgba(16, 185, 129, 0.2)"
        borderRadius="md"
        minW="240px"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      >
        {/* User Info Header */}
        <Box
          p={4}
          borderBottom="1px solid"
          borderBottomColor="rgba(16, 185, 129, 0.2)"
        >
          <HStack gap={3}>
            <Avatar.Root size="md">
              <Avatar.Fallback>{initials}</Avatar.Fallback>
            </Avatar.Root>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="sm" fontWeight="semibold" color="white">
                {fullName}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {user.email}
              </Text>
              {cartState.totalItems > 0 && (
                <Badge colorScheme="green" variant="subtle" fontSize="xs" mt={1}>
                  {cartState.totalItems} items in cart
                </Badge>
              )}
            </VStack>
          </HStack>
        </Box>

        {/* Menu Items */}
        <VStack gap={0} p={2}>
          <MenuItem
            value="profile"
            _hover={{ bg: 'rgba(16, 185, 129, 0.1)' }}
            borderRadius="md"
            w="full"
          >
            <HStack gap={3} w="full">
              <User size={16} color="#10B981" />
              <Text fontSize="sm" color="white">
                Profile
              </Text>
            </HStack>
          </MenuItem>

          <MenuItem
            value="orders"
            _hover={{ bg: 'rgba(16, 185, 129, 0.1)' }}
            borderRadius="md"
            w="full"
          >
            <HStack gap={3} w="full" justify="space-between">
              <HStack gap={3}>
                <Package size={16} color="#10B981" />
                <Text fontSize="sm" color="white">
                  Order History
                </Text>
              </HStack>
              <Badge variant="subtle" colorScheme="blue" fontSize="xs">
                {orderCount}
              </Badge>
            </HStack>
          </MenuItem>

          <MenuItem
            value="settings"
            _hover={{ bg: 'rgba(16, 185, 129, 0.1)' }}
            borderRadius="md"
            w="full"
          >
            <HStack gap={3} w="full">
              <Settings size={16} color="#10B981" />
              <Text fontSize="sm" color="white">
                Settings
              </Text>
            </HStack>
          </MenuItem>

          <Box
            borderTop="1px solid"
            borderTopColor="rgba(16, 185, 129, 0.2)"
            mt={2}
            pt={2}
            w="full"
          >
            <MenuItem
              value="logout"
              onClick={handleLogout}
              _hover={{ bg: 'rgba(239, 68, 68, 0.1)' }}
              borderRadius="md"
              w="full"
            >
              <HStack gap={3} w="full">
                <LogOut size={16} color="#EF4444" />
                <Text fontSize="sm" color="#EF4444">
                  Logout
                </Text>
              </HStack>
            </MenuItem>
          </Box>
        </VStack>
      </MenuContent>
    </MenuRoot>
  );
};
