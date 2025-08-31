import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import videoFile from "../assets/Videos/PixVerse_V4.5_Image_Text_360P_A_stylish_ecomme.mp4";
import videofile2 from "../assets/Videos/PixVerse_V4.5_Image_Text_360P_A_modern_animate.mp4";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
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
        const products = await fetchFeaturedProducts(6);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setProductsLoading(false);
      }
    };
    loadFeaturedProducts();
  }, []);

  // slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

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
          >
            Welcome to ILi Store
          </Heading>
          <Button
            colorScheme="blue"
            size="lg"
            rounded="full"
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* Categories Carousel */}
      <Container maxW="7xl" py={20} textAlign="center">
        <Heading mb={10} fontSize="4xl" fontWeight="bold">
          SHOP BY CATEGORY
        </Heading>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Slider {...settings}>
            {categories.map((cat, index) => (
              <Box key={index} px={3}>
                <Box
                  borderRadius="xl"
                  boxShadow="md"
                  p={6}
                  textAlign="center"
                  bg="white"
                  _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                >
                  <VStack gap={4}>
                    <Heading fontSize="2xl" textTransform="capitalize">
                      {cat}
                    </Heading>
                    <Text fontSize="md" color="gray.600">
                      Explore our collection of {cat}. High quality and stylish
                      products just for you.
                    </Text>
                    <Button
                      bg={"black"}
                      size="lg"
                      color={"white"}
                      rounded="full"
                      onClick={() => navigate("/shop", { state: { category: cat } })}
                    >
                      Shop Now
                    </Button>
                  </VStack>
                </Box>
              </Box>
            ))}
          </Slider>
        )}
      </Container>

      {/* New In Section with Product Grid */}
      <Box py={20} bg="gray.50">
        <Container maxW="7xl">
          <Heading
            mb={12}
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            textAlign="left"
            color="green.400"
            letterSpacing="wider"
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
                          textTransform="uppercase"
                          lineClamp={1}
                        >
                          {featuredProducts[0].title}
                        </Text>
                        <HStack justify="space-between" align="center">
                          <Text fontSize="xl" fontWeight="bold">
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
                          <Text fontSize="md" fontWeight="bold">
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
              rounded="full"
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
            rounded="full"
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
              {/* <ArrowRight size={20} /> */}
            </HStack>
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Home;