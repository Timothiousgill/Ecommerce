import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Heading,
  Spinner,
  Text,
  Container,
  VStack,
  Grid,
  GridItem,
  Image,
  Badge,
  HStack,
  SimpleGrid,
  Link,
  Icon,
  Stack,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";
import videoFile from "../assets/Videos/PixVerse_V4.5_Image_Text_360P_A_stylish_ecomme.mp4";
import videofile2 from "../assets/Videos/PixVerse_V4.5_Image_Text_360P_A_modern_animate.mp4";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Slider from "react-slick";
import { fetchFeaturedProducts } from "../api/productApi";
import type { Product } from "../api/productApi";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://fakestoreapi.com/products/categories"
        );
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await fetchFeaturedProducts(8);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setProductsLoading(false);
      }
    };
    loadFeaturedProducts();
  }, []);



  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getDiscountedPrice = (price: number) => {
    const discount = Math.floor(Math.random() * 30) + 10; // Random discount 10-40%
    return (price * (1 - discount / 100)).toFixed(2);
  };

  const shouldShowSale = (index: number) => {
    return index % 3 === 0; // Show sale badge on every 3rd item
  };

  const shouldShowBestSeller = (index: number) => {
    return index === 1 || index === 4; // Show best seller on specific items
  };

  // category images
  const categoryImages: Record<string, string> = {
    electronics: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop&auto=format",
    jewelery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop&auto=format",
    "men's clothing": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format",
    "women's clothing": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop&auto=format",
  };

  const getCategoryImage = (cat: string) => {
    return categoryImages[cat] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format";
  };

  return (
    <>
      {/* Hero Section */}
      <Box position="relative" w="100%" h="100vh" overflow="hidden">
        <video
          src={videoFile}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
          bg="blackAlpha.500"
        >
          <Heading
            color="white"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            mb={4}
            textAlign="center"
            px={4}
          >
            Welcome to ILi Store
          </Heading>
          <Button
            colorScheme="blue"
            size="lg"
            borderRadius="full"
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* Categories Section - Fixed for Chakra UI v3 */}
      <Container maxW="7xl" py={20} textAlign="center" px={{ base: 4, md: 8 }}>
        <Heading
          mb={10}
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          px={4}
        >
          SHOP BY CATEGORY
        </Heading>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <>
            {/* Desktop and Tablet - Use Grid instead of Slider for v3 compatibility */}
            <Box display={{ base: "none", md: "block" }}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                {categories.map((cat, index) => (
                  <Box
                    key={index}
                    borderRadius="xl"
                    boxShadow="md"
                    p={6}
                    textAlign="center"
                    bg="white"
                    _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                    minH="350px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    cursor="pointer"
                    onClick={() => navigate("/shop", { state: { category: cat } })}
                  >
                    <VStack gap={4}>
                      <Image
                        src={getCategoryImage(cat)}
                        alt={cat}
                        borderRadius="lg"
                        w="100%"
                        h="150px"
                        objectFit="cover"
                        loading="lazy"
                      />
                      <Heading fontSize="xl" textTransform="capitalize" color="gray.800">
                        {cat}
                      </Heading>
                      <Text fontSize="sm" color="gray.600" px={2} textAlign="center">
                        Explore our collection of {cat}. High quality and stylish products just for you.
                      </Text>
                    </VStack>
                    <Button
                      bg="black"
                      size="md"
                      color="white"
                      borderRadius="full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/shop", { state: { category: cat } });
                      }}
                      _hover={{ bg: "gray.800" }}
                      mt={4}
                      w="full"
                    >
                      Shop Now
                    </Button>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {/* Mobile - Use Simple Grid */}
            <Box display={{ base: "block", md: "none" }}>
              <SimpleGrid columns={1} gap={6} px={4}>
                {categories.map((cat, index) => (
                  <Box
                    key={index}
                    borderRadius="xl"
                    boxShadow="md"
                    p={6}
                    textAlign="center"
                    bg="white"
                    _hover={{ transform: "scale(1.02)", transition: "0.3s" }}
                    cursor="pointer"
                    onClick={() => navigate("/shop", { state: { category: cat } })}
                  >
                    <VStack gap={4}>
                      <Image
                        src={getCategoryImage(cat)}
                        alt={cat}
                        borderRadius="lg"
                        w="100%"
                        h="150px"
                        objectFit="cover"
                        loading="lazy"
                      />
                      <Heading fontSize="xl" textTransform="capitalize" color="gray.800">
                        {cat}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        Explore our collection of {cat}. High quality and stylish products just for you.
                      </Text>
                      <Button
                        bg="black"
                        size="md"
                        color="white"
                        borderRadius="full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/shop", { state: { category: cat } });
                        }}
                        _hover={{ bg: "gray.800" }}
                        w="full"
                      >
                        Shop Now
                      </Button>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </>
        )}
      </Container>

      {/* New In Section with Product Grid */}
      <Box py={20} bg="gray.50">
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <Heading
            mb={12}
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            textAlign="left"
            color="gray.600"
            letterSpacing="wider"
            px={4}
          >
            NEW IN
          </Heading>

          {productsLoading ? (
            <Box display="flex" justifyContent="center" py={20}>
              <Spinner size="xl" color="green.400" />
            </Box>
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "2fr 1fr 1fr",
                lg: "2fr 1fr 1fr"
              }}
              templateRows={{
                base: "repeat(6, 400px)",
                md: "repeat(2, 400px)"
              }}
              gap={4}
              h={{ base: "auto", md: "820px" }}
              px={4}
            >
              {/* Large featured product - spans 2 rows on desktop */}
              <GridItem
                rowSpan={{ base: 1, md: 2 }}
                colSpan={{ base: 1, md: 1 }}
                position="relative"
                borderRadius="20px"
                overflow="hidden"
                bg="white"
                boxShadow="lg"
                _hover={{ transform: "scale(1.02)", transition: "all 0.3s" }}
                cursor="pointer"
                onClick={() => navigate("/shop")}
              >
                {featuredProducts[0] && (
                  <>
                    <Box position="relative" h="100%">
                      <Image
                        src={featuredProducts[0].image}
                        alt={featuredProducts[0].title}
                        w="100%"
                        h="70%"
                        objectFit="cover"
                        borderRadius="20px 20px 0 0"
                        loading="lazy"
                      />
                      <Box
                        position="absolute"
                        top={4}
                        left={4}
                        bg="green.400"
                        color="black"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        NEW IN
                      </Box>
                      <Box p={6} h="30%">
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          mb={2}
                          color={"gray.600"}
                          textTransform="uppercase"
                          lineClamp={1}
                        >
                          {featuredProducts[0].title}
                        </Text>
                        <HStack justify="space-between" align="center">
                          <Text fontSize="xl" fontWeight="bold" color={"gray.600"} >
                            {formatPrice(featuredProducts[0].price)}
                          </Text>
                          <Badge colorScheme="yellow" fontSize="xs">
                            ★ {featuredProducts[0].rating.rate}
                          </Badge>
                        </HStack>
                      </Box>
                    </Box>
                  </>
                )}
              </GridItem>

              {/* Grid items for remaining products */}
              {featuredProducts.slice(1, 6).map((product, index) => (
                <GridItem
                  key={product.id}
                  position="relative"
                  borderRadius="20px"
                  overflow="hidden"
                  bg="white"
                  boxShadow="lg"
                  _hover={{ transform: "scale(1.02)", transition: "all 0.3s" }}
                  cursor="pointer"
                  onClick={() => navigate("/shop")}
                >
                  <Box position="relative" h="100%">
                    <Image
                      src={product.image}
                      alt={product.title}
                      w="100%"
                      h="70%"
                      objectFit="cover"
                      loading="lazy"
                    />

                    {/* Badges */}
                    <Box position="absolute" top={3} left={3}>
                      {shouldShowSale(index + 1) && (
                        <Badge
                          bg="green.400"
                          color="black"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontSize="xs"
                          fontWeight="bold"
                          mb={2}
                        >
                          Sale
                        </Badge>
                      )}
                      {shouldShowBestSeller(index + 1) && (
                        <Badge
                          bg="green.400"
                          color="black"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          Best Seller
                        </Badge>
                      )}
                    </Box>

                    <Box p={4} h="30%">
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        mb={1}
                        textTransform="uppercase"
                        lineClamp={1}
                        color="gray.800"
                      >
                        {product.title}
                      </Text>
                      <HStack justify="space-between" align="center">
                        {shouldShowSale(index + 1) ? (
                          <VStack align="start" gap={0}>
                            <Text
                              fontSize="sm"
                              color="gray.400"
                              textDecoration="line-through"
                            >
                              {formatPrice(product.price)}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" color="black">
                              ${getDiscountedPrice(product.price)}
                            </Text>
                          </VStack>
                        ) : (
                          <Text fontSize="md" fontWeight="bold"  color={"gray.600"}>
                            {formatPrice(product.price)}
                          </Text>
                        )}
                      </HStack>
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          )}

          {/* View All Button */}
          <Box textAlign="center" mt={12}>
            <Button
              size="lg"
              bg="black"
              color="white"
              borderRadius="full"
              px={8}
              onClick={() => navigate("/shop")}
              _hover={{ bg: "gray.800", transform: "scale(1.05)" }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Explore Section with Video */}
      <Box position="relative" w="100%" h="100vh" overflow="hidden">
        <video
          src={videofile2}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          zIndex={1}
          bg="blackAlpha.600"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          px={4}
        >
          <Heading
            color="white"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            mb={6}
            textShadow="2px 2px 4px rgba(0,0,0,0.5)"
          >
            Ready to Start Shopping?
          </Heading>
          <Text
            color="whiteAlpha.900"
            fontSize={{ base: "md", md: "lg" }}
            mb={8}
            maxW="xl"
            textShadow="1px 1px 2px rgba(0,0,0,0.5)"
          >
            Explore our complete collection and find exactly what you're looking for
          </Text>
          <Button
            bg="whiteAlpha.900"
            color="black"
            size="lg"
            borderRadius="full"
            px={8}
            py={6}
            fontSize="lg"
            fontWeight="bold"
            onClick={() => navigate("/shop")}
            _hover={{ bg: "white", transform: "scale(1.05)", shadow: "xl" }}
            transition="all 0.3s"
          >
            <HStack gap={2}>
              <Text>Explore Collection</Text>
            </HStack>
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Box bg="gray.900" color="white" py={16}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)"
            }}
            gap={8}
          >
            {/* Company Info */}
            <GridItem>
              <VStack align="start" gap={4}>
                <Heading size="lg" color="green.400">
                  ILi Store
                </Heading>
                <Text fontSize="sm" color="gray.300" lineHeight="tall">
                  Your trusted destination for quality products.
                  We offer a wide range of items with excellent
                  customer service and fast delivery.
                </Text>
                <HStack gap={4} pt={2}>
                  <Icon as={FaFacebook} boxSize={5} cursor="pointer" _hover={{ color: "blue.400" }} />
                  <Icon as={FaTwitter} boxSize={5} cursor="pointer" _hover={{ color: "blue.300" }} />
                  <Icon as={FaInstagram} boxSize={5} cursor="pointer" _hover={{ color: "pink.400" }} />
                  <Icon as={FaLinkedin} boxSize={5} cursor="pointer" _hover={{ color: "blue.500" }} />
                </HStack>
              </VStack>
            </GridItem>

            {/* Quick Links */}
            <GridItem>
              <VStack align="start" gap={4}>
                <Heading size="md" mb={2}>
                  Quick Links
                </Heading>
                <VStack align="start" gap={2}>
                  <Link
                    fontSize="sm"
                    color="gray.300"
                    _hover={{ color: "green.400" }}
                    onClick={() => navigate("/")}
                    cursor="pointer"
                  >
                    Home
                  </Link>
                  <Link
                    fontSize="sm"
                    color="gray.300"
                    _hover={{ color: "green.400" }}
                    onClick={() => navigate("/shop")}
                    cursor="pointer"
                  >
                    Shop
                  </Link>
                  <Link
                    fontSize="sm"
                    color="gray.300"
                    _hover={{ color: "green.400" }}
                    onClick={() => navigate("/about")}
                    cursor="pointer"
                  >
                    About Us
                  </Link>
                  <Link
                    fontSize="sm"
                    color="gray.300"
                    _hover={{ color: "green.400" }}
                    onClick={() => navigate("/contact")}
                    cursor="pointer"
                  >
                    Contact
                  </Link>
                </VStack>
              </VStack>
            </GridItem>

            {/* Categories */}
            <GridItem>
              <VStack align="start" gap={4}>
                <Heading size="md" mb={2}>
                  Categories
                </Heading>
                <VStack align="start" gap={2}>
                  {categories.slice(0, 4).map((cat, index) => (
                    <Link
                      key={index}
                      fontSize="sm"
                      color="gray.300"
                      _hover={{ color: "green.400" }}
                      textTransform="capitalize"
                      onClick={() => navigate("/shop", { state: { category: cat } })}
                      cursor="pointer"
                    >
                      {cat}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            </GridItem>

            {/* Contact Info */}
            <GridItem>
              <VStack align="start" gap={4}>
                <Heading size="md" mb={2}>
                  Contact Info
                </Heading>
                <VStack align="start" gap={3}>
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="green.400" />
                    <Text fontSize="sm" color="gray.300">
                      DHA business hub, Block D, Main Broadway, DHA Phase 8, Lahore
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaPhone} color="green.400" />
                    <Text fontSize="sm" color="gray.300">
                      0321 4224534
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaEnvelope} color="green.400" />
                    <Text fontSize="sm" color="gray.300">
                      info@ilistore.com
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </GridItem>
          </Grid>

          <Box borderBottom="1px" borderColor="gray.700" my={8} />

          {/* Bottom Footer */}
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text fontSize="sm" color="gray.400">
              © 2025 ILi Store. All rights reserved.
            </Text>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Home;