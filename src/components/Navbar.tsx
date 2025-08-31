import React from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  useDisclosure,
  Link as ChakraLink,
  Badge,
  type LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps, 
  useLocation,
} from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from '../components/hooks/useCart';

type NavLinkProps = Omit<ChakraLinkProps, "as" | "href"> & RouterLinkProps;

const NavLink: React.FC<NavLinkProps> = (props) => {
  return <ChakraLink as={RouterLink} {...props} />;
};

const Navbar = () => {
  const { pathname } = useLocation();
  const { open, onToggle } = useDisclosure();
  const { state } = useCart();

  // Reusable nav link
  const navLink = (to: string, label: string, icon?: React.ReactNode, showBadge?: boolean) => (
    <Box position="relative" role="group">
      <NavLink
        to={to}
        px={6}
        py={3}
        fontSize="sm"
        fontWeight="medium"
        textTransform="uppercase"
        letterSpacing="wide"
        transition="all 0.5s"
        color={pathname === to ? "#10B981" : "#9CA3AF"}
        _hover={{
          color: pathname === to ? "#10B981" : "white",
        }}
        textDecoration="none"
        display="flex"
        alignItems="center"
        gap={2}
        _focus={{
          boxShadow: "none",
          outline: "none",
        }}
        position="relative"
      >
        {icon && <Box as="span">{icon}</Box>}
        {label}
        {/* Cart Badge */}
        {showBadge && state.totalItems > 0 && (
          <Badge
            position="absolute"
            top="-8px"
            right="-8px"
            bg="red.500"
            color="white"
            borderRadius="full"
            fontSize="xs"
            minW="20px"
            h="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
          >
            {state.totalItems > 99 ? '99+' : state.totalItems}
          </Badge>
        )}
      </NavLink>
      <Box
        position="absolute"
        bottom={0}
        left={0}
        height="2px"
        bg="#10B981"
        width={pathname === to ? "100%" : "0%"}
        transition="width 0.5s"
        _groupHover={{
          width: "100%",
        }}
      />
    </Box>
  );

  return (
    <Box
      as="nav"
      bg="#1C283C"
      borderBottom="1px solid"
      borderBottomColor="rgba(16, 185, 129, 0.2)"
      boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      position="sticky"
      top={0}
      zIndex={50}
    >
      <Box maxW="7xl" mx="auto" px={6} py={4}>
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <NavLink
            to="/"
            fontSize="2xl"
            fontWeight="bold"
            color="#10B981"
            _hover={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
            transition="all 0.3s"
            textDecoration="none"
            _focus={{ boxShadow: "none", outline: "none" }}
          >
            ILi Shop
          </NavLink>

          {/* Desktop Navigation */}
          <Box display={{ base: "none", md: "block" }}>
            <HStack gap={2} alignItems="center">
              {navLink("/", "Home")}
              {navLink("/shop", "Shop")}
              {navLink("/about", "About")}
              {navLink("/contact", "Contact")}
              {navLink(
                "/cart",
                "Cart",
                <ShoppingCart size={20} />,
                true // Show badge for cart
              )}
            </HStack>
          </Box>

          {/* Mobile Menu Button */}
          <Box
            display={{ base: "block", md: "none" }}
            as="button"
            onClick={onToggle}
            w="24px"
            h="20px"
            position="relative"
            cursor="pointer"
          >
            <Box
              as="span"
              position="absolute"
              top={0}
              left={0}
              h="2px"
              w="100%"
              bg="white"
              borderRadius="md"
              transform={open ? "rotate(45deg) translateY(9px)" : "none"}
              transition="0.3s"
            />
            <Box
              as="span"
              position="absolute"
              top="50%"
              left={0}
              h="2px"
              w="100%"
              bg="white"
              borderRadius="md"
              transform="translateY(-50%)"
              opacity={open ? 0 : 1}
              transition="0.3s"
            />
            <Box
              as="span"
              position="absolute"
              bottom={0}
              left={0}
              h="2px"
              w="100%"
              bg="white"
              borderRadius="md"
              transform={open ? "rotate(-45deg) translateY(-9px)" : "none"}
              transition="0.3s"
            />
          </Box>
        </Flex>

        {/* Mobile Menu */}
        {open && (
          <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="#1C283C"
            zIndex={49}
          >
            {/* Logo at top-left */}
            <NavLink
              to="/"
              fontSize="2xl"
              fontWeight="bold"
              color="#10B981"
              position="absolute"
              top={6}
              left={6}
              _hover={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              textDecoration="none"
              _focus={{ boxShadow: "none", outline: "none" }}
              onClick={onToggle}
            >
              ILi Shop
            </NavLink>

            {/* Close Button */}
            <Box
              position="absolute"
              top={6}
              right={6}
              w="8"
              h="8"
              cursor="pointer"
              onClick={onToggle}
            >
              <Box
                position="absolute"
                top="50%"
                left="50%"
                w="100%"
                h="2px"
                bg="white"
                transform="translate(-50%, -50%) rotate(45deg)"
              />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                w="100%"
                h="2px"
                bg="white"
                transform="translate(-50%, -50%) rotate(-45deg)"
              />
            </Box>

            {/* Mobile Nav Links */}
            <VStack h="100%" justify="center" alignItems="center" gap={8}>
              <Box onClick={onToggle}>
                {navLink("/", "Home")}
              </Box>
              <Box onClick={onToggle}>
                {navLink("/shop", "Shop")}
              </Box>
              <Box onClick={onToggle}>
                {navLink("/about", "About")}
              </Box>
              <Box onClick={onToggle}>
                {navLink("/contact", "Contact")}
              </Box>
              <Box onClick={onToggle}>
                {navLink(
                  "/cart",
                  "Cart",
                  <ShoppingCart size={20} />,
                  true // Show badge for cart in mobile too
                )}
              </Box>
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;