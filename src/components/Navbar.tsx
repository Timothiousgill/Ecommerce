import React, { useState, useEffect } from "react";
import { fetchCategories } from "../api/productApi";

import {
  Box,
  Flex,
  HStack,
  VStack,
  useDisclosure,
  Link as ChakraLink,
  Badge,
  Text,
  type LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps, 
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from '../components/hooks/useCart';

type NavLinkProps = Omit<ChakraLinkProps, "as" | "href"> & RouterLinkProps;

const NavLink: React.FC<NavLinkProps> = (props) => {
  return <ChakraLink as={RouterLink} {...props} />;
};

interface Category {
  name: string;
  displayName: string;
}

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { open, onToggle } = useDisclosure();
  const { state } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  const getCategories = async () => {
    try {
      const data = await fetchCategories();

      const transformedCategories: Category[] = data.map((category: string) => ({
        name: category,
        displayName: category
          .split(" ")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .replace(/'/g, ""),
      }));

      setCategories(transformedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);


    } finally {
      setLoading(false);
    }
  };

  getCategories();
}, []);


  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    navigate('/shop', { 
      state: { category: categoryName }
    });
    if (open) {
      onToggle();
    }
  };

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

  // Custom categories dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const categoriesDropdown = () => (
    <Box position="relative" role="group">
      <Box
        px={6}
        py={3}
        fontSize="sm"
        fontWeight="medium"
        textTransform="uppercase"
        letterSpacing="wide"
        transition="all 0.5s"
        color="#9CA3AF"
        _hover={{
          color: "white",
        }}
        cursor="pointer"
        display="flex"
        alignItems="center"
        gap={2}
        position="relative"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        Categories
        <Box
          as={ChevronDown}
          boxSize={4}
          transform={dropdownOpen ? "rotate(180deg)" : "rotate(0deg)"}
          transition="transform 0.3s"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          height="2px"
          bg="#10B981"
          width={dropdownOpen ? "100%" : "0%"}
          transition="width 0.5s"
          _groupHover={{
            width: "100%",
          }}
        />
      </Box>
      
      {/* Dropdown Menu */}
      {dropdownOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          mt={2}
          minW="200px"
          bg="#1C283C"
          borderRadius="md"
          border="1px solid"
          borderColor="rgba(16, 185, 129, 0.2)"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          zIndex={100}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          {loading ? (
            <Box
              px={4}
              py={3}
              color="#9CA3AF"
              fontSize="sm"
            >
              Loading categories...
            </Box>
          ) : (
            categories.map((category) => (
              <Box
                key={category.name}
                px={4}
                py={3}
                cursor="pointer"
                color="#9CA3AF"
                fontSize="sm"
                fontWeight="medium"
                _hover={{ 
                  bg: "rgba(16, 185, 129, 0.1)",
                  color: "#10B981"
                }}
                _first={{ borderTopRadius: "md" }}
                _last={{ borderBottomRadius: "md" }}
                transition="all 0.2s"
                onClick={() => handleCategorySelect(category.name)}
              >
                {category.displayName}
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );

  // Mobile categories dropdown
  const mobileCategoriesDropdown = () => (
    <VStack align="stretch" gap={0} w="full">
      {/* Categories Header */}
      <Box
        px={6}
        py={3}
        borderBottom="1px solid"
        borderBottomColor="rgba(16, 185, 129, 0.2)"
        mb={2}
      >
        <Text
          fontSize="sm"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wide"
          color="#10B981"
        >
          Categories
        </Text>
      </Box>
      
      {loading ? (
        <Box px={6} py={3}>
          <Text fontSize="sm" color="#9CA3AF">Loading categories...</Text>
        </Box>
      ) : (
        <VStack align="stretch" gap={1} w="full">
          {categories.map((category) => (
            <Box
              key={category.name}
              px={6}
              py={3}
              cursor="pointer"
              onClick={() => handleCategorySelect(category.name)}
              _hover={{ 
                bg: "rgba(16, 185, 129, 0.1)",
                borderLeft: "3px solid #10B981"
              }}
              transition="all 0.3s"
              borderLeft="3px solid transparent"
              position="relative"
              role="group"
            >
              <Text
                fontSize="sm"
                fontWeight="medium"
                textTransform="uppercase"
                letterSpacing="wide"
                color="#9CA3AF"
                _groupHover={{ color: "#10B981" }}
                transition="color 0.3s"
              >
                {category.displayName}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
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
              {categoriesDropdown()}
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
            <VStack h="100%" justify="center" alignItems="center" gap={6}>
              <Box onClick={onToggle}>
                {navLink("/", "Home")}
              </Box>
              <Box onClick={onToggle}>
                {navLink("/shop", "Shop")}
              </Box>
              
              {/* Mobile Categories Section */}
              {mobileCategoriesDropdown()}
              
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