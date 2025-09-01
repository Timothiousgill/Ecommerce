import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Flex,
  Image,
} from "@chakra-ui/react";


import aboutImg from "../assets/about.png";


const About = () => {
  return (
    <Box bg="#26292eff" minH="100vh" py={12}>
      <Container maxW="6xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="flex-start"
          gap={10}
        >
          {/* Image */}
          <Image
            src={aboutImg}
            alt="About Page"
            borderRadius="lg"
            maxW={{ base: "100%", md: "50%" }}
          />

          {/* Text Section */}
          <VStack align="flex-start" gap={6} flex="1">
            {/* Heading on top left */}
            <Heading color="white" size="xl" textAlign="left">
              OUR STORY
            </Heading>

            <Text color="gray.200" fontSize="lg" textAlign="justify">
              We started this company with a simple idea: to create high-quality
              products that you’ll be proud to own and truly love. Our journey began
              with a passion for craftsmanship and an attention to detail. Every item
              we offer is thoughtfully designed and carefully made, reflecting our
              commitment to quality and transparency.
              <br />
              From the very first click on our website to the moment you open your
              package, we aim to provide an honest and genuine experience. For us,
              it’s about more than just selling products it’s about building a
              community and creating a brand you can trust and connect with.
              Thank you for being part of our story.
            </Text>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default About;
