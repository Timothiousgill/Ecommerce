import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";

const Contact: React.FC = () => {
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);

    // Auto-reset after a while
    setTimeout(() => setMessageSent(false), 3000);
  };

  return (
    <Container maxW="6xl" py={12}>
      {/* Page Header */}
      <VStack gap={4} mb={10} textAlign="center">
        <Heading size="2xl" color="teal.500">
          Contact Us
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="2xl">
          We'd love to hear from you. Fill out the form below or reach us via
          our contact details.
        </Text>
      </VStack>

      {/* Show success message */}
      {messageSent && (
        <Box
          bg="green.500"
          color="white"
          p={4}
          rounded="md"
          mb={6}
          textAlign="center"
          fontWeight="medium"
        >
          ✅ Message successfully sent! We'll be in touch soon.
        </Box>
      )}

      {/* Page Content */}
      <HStack
        align="start"
        gap={10}
        flexDir={{ base: "column", md: "row" }}
      >
        {/* Contact Form */}
        <Box flex="2" bg="white" p={8} rounded="2xl" shadow="md">
          <form onSubmit={handleSubmit}>
            <VStack gap={5} align="stretch">
              <Box>
                <Text fontWeight="semibold" mb={2} color="gray.700">
                  Full Name
                </Text>
                <Input color="gray.600" placeholder="Timothious Gill" required />
              </Box>

              <Box>
                <Text fontWeight="semibold" mb={2} color="gray.700">
                  Email Address
                </Text>
                <Input color="gray.600" type="email" placeholder="tim@example.com" required />
              </Box>

              <Box>
                <Text fontWeight="semibold" mb={2} color="gray.700">
                  Message
                </Text>
                <Textarea
                  placeholder="Type your message here..."
                  rows={5}
                  color="gray.600"
                  required
                />
              </Box>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                w="full"
                rounded="xl"
                fontWeight="bold"
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Contact Details */}
        <VStack
          flex="1"
          bg="gray.50"
          p={8}
          rounded="2xl"
          shadow="sm"
          gap={6}
          align="start"
        >
          <HStack>
            <MdPhone size={22} color="#319795" />
            <Text color="gray.600" fontWeight="medium">+92 321 4224534</Text>
          </HStack>

          <HStack>
            <MdEmail size={22} color="#319795" />
            <Text color="gray.600" fontWeight="medium">support@ilishop.com</Text>
          </HStack>

          <HStack>
            <MdLocationOn size={22} color="#319795" />
            <Text color="gray.600" fontWeight="medium">DHA business hub, Block D, Main Broadway, DHA Phase 8, Lahore</Text>
          </HStack>
        </VStack>
      </HStack>
    </Container>
  );
};

export default Contact;
