import React, { useState } from "react";
import type { ChangeEvent } from "react";
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
  Input,
  Separator,
  Field,
} from "@chakra-ui/react";

import { Truck, CheckCircle, ArrowLeft } from "lucide-react";
import { useCart } from "../components/hooks/useCart";
import { useAuth } from "../components/hooks/useAuth";
import { Link as RouterLink } from 'react-router-dom';
import { ProtectedRoute } from "../components/ProtectedRoute";

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddressSameAsShipping: boolean;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
}

interface FormErrors {
  [key: string]: string;
}

const steps = [
  { title: "Shipping", description: "Delivery information" },
  { title: "Payment", description: "Payment details" },
  { title: "Review", description: "Order summary" },
];

const CheckoutContent: React.FC = () => {
  const { state: cartState, clearCart } = useCart();
  const { state: authState } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId] = useState(
    () => Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  // Pre-fill shipping info with user data if available
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(() => {
    if (authState.user) {
      return {
        fullName: `${authState.user.name.firstname} ${authState.user.name.lastname}`,
        email: authState.user.email,
        phone: authState.user.phone,
        street: authState.user.address.street,
        city: authState.user.address.city,
        state: "", // FakeStore API doesn't have state
        zipCode: authState.user.address.zipcode,
      };
    }
    return {
      fullName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
    };
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: authState.user ? `${authState.user.name.firstname} ${authState.user.name.lastname}` : "",
    billingAddressSameAsShipping: true,
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const subtotal = cartState.totalPrice;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const shippingCost = subtotal >= 100 ? 0 : 10;
  const total = subtotal + tax + shippingCost;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const showToast = (title: string, description: string) => {
    console.log(`${title}: ${description}`);
    alert(`${title}\n${description}`);
  };

  const validateShipping = (): boolean => {
    const newErrors: FormErrors = {};
    if (!shippingInfo.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!shippingInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!shippingInfo.street.trim()) newErrors.street = "Street is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.state.trim()) newErrors.state = "State is required";
    if (!shippingInfo.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(shippingInfo.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (): boolean => {
    const newErrors: FormErrors = {};
    if (!paymentInfo.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\D/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }
    if (!paymentInfo.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = "Please enter date in MM/YY format";
    } else {
      // Validate that the expiry date is not in the past
      const [month, year] = paymentInfo.expiryDate.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();
      currentDate.setDate(1); // Set to first day of current month for comparison
      if (expiryDate < currentDate) {
        newErrors.expiryDate = "Card has expired";
      }
    }
    if (!paymentInfo.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = "Please enter a valid 3 or 4-digit CVV";
    }
    if (!paymentInfo.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }
    if (!paymentInfo.billingAddressSameAsShipping) {
      if (!paymentInfo.billingStreet.trim()) newErrors.billingStreet = "Billing street is required";
      if (!paymentInfo.billingCity.trim()) newErrors.billingCity = "Billing city is required";
      if (!paymentInfo.billingState.trim()) newErrors.billingState = "Billing state is required";
      if (!paymentInfo.billingZipCode.trim()) {
        newErrors.billingZipCode = "Billing ZIP code is required";
      } else if (!/^\d{5}(-\d{4})?$/.test(paymentInfo.billingZipCode)) {
        newErrors.billingZipCode = "Please enter a valid ZIP code";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateShipping()) return;
    if (currentStep === 1 && !validatePayment()) return;
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setCurrentStep((s) => s - 1);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setOrderPlaced(true);
      clearCart();

      showToast(
        "Order placed successfully!",
        `Your order #${orderId} has been confirmed.`
      );
    } catch (error) {
      console.log(error);
      showToast("Error", "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Event handlers with proper typing
  const handleShippingChange = (field: keyof ShippingInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    setShippingInfo((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePaymentChange = (field: keyof PaymentInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (value.length > 19) return; // Limit to 16 digits + 3 spaces
    }

    // Format expiry date as MM/YY
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      if (value.length > 5) return; // Limit to MM/YY format
    }

    // CVV should only contain digits
    if (field === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) return; // Limit to 4 digits
    }

    setPaymentInfo((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo((prev) => ({
      ...prev,
      billingAddressSameAsShipping: e.target.checked,
      // Clear billing address if checking the box
      ...(e.target.checked && {
        billingStreet: "",
        billingCity: "",
        billingState: "",
        billingZipCode: "",
      })
    }));

    // Clear billing address errors if using shipping address
    if (e.target.checked) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.billingStreet;
        delete newErrors.billingCity;
        delete newErrors.billingState;
        delete newErrors.billingZipCode;
        return newErrors;
      });
    }
  };

  // Custom Checkbox component
  const CustomCheckbox: React.FC<{
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    children: React.ReactNode
  }> = ({ checked, onChange, children }) => (
    <HStack>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ marginRight: '8px' }}
      />
      <Text>{children}</Text>
    </HStack>
  );

  // Step indicator component
  const StepIndicator: React.FC<{
    step: number;
    currentStep: number;
    title: string;
    description: string
  }> = ({ step, currentStep, title, description }) => (
    <Box textAlign="center" flex={1}>
      <Box
        w={10}
        h={10}
        borderRadius="full"
        bg={step <= currentStep ? "blue.500" : "gray.200"}
        color={step <= currentStep ? "white" : "gray.500"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mx="auto"
        mb={2}
        fontWeight="bold"
        transition="all 0.2s"
      >
        {step < currentStep ? <CheckCircle size={20} /> : step + 1}
      </Box>
      <Text fontSize="sm" fontWeight="semibold" color={step <= currentStep ? "blue.600" : "gray.500"}>
        {title}
      </Text>
      <Text fontSize="xs" color="gray.500">
        {description}
      </Text>
    </Box>
  );

  // Empty cart redirect
  if (cartState.items.length === 0 && !orderPlaced) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="6xl">
          <VStack textAlign="center" py={20}>
            <Box
              bg="white"
              p={8}
              borderRadius="2xl"
              shadow="lg"
              maxW="md"
            >
              <Box
                mx="auto"
                mb={6}
                p={4}
                bg="gray.100"
                borderRadius="full"
                w="fit-content"
              >
                <Truck size={48} color="#9CA3AF" />
              </Box>

              <Heading size="lg" mb={4} color="gray.700">
                Your cart is empty
              </Heading>

              <Text color="gray.500" mb={6}>
                Add some items to your cart before checkout.
              </Text>

              <RouterLink to="/shop">
                <Button
                  colorScheme="blue"
                  size="lg"
                  borderRadius="xl"
                >
                  <HStack>
                    <ArrowLeft size={16} />
                    <Text>Continue Shopping</Text>
                  </HStack>
                </Button>
              </RouterLink>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Order success page
  if (orderPlaced) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="4xl">
          <VStack textAlign="center">
            <Box bg="white" p={8} borderRadius="2xl" shadow="lg" w="full" maxW="md">
              <VStack>
                <Box p={4} bg="green.100" borderRadius="full">
                  <CheckCircle size={48} color="green" />
                </Box>
                <Heading size="lg" color="green.600" mb={4}>
                  Order Confirmed!
                </Heading>
                <VStack mb={6}>
                  <Text color="gray.600">Thank you for your order. Your order number is:</Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.600">
                    #{orderId}
                  </Text>
                  {authState.user && (
                    <Text fontSize="sm" color="gray.500">
                      Confirmation sent to {authState.user.email}
                    </Text>
                  )}
                </VStack>
                <Box p={4} bg="blue.50" borderRadius="lg" w="full" mb={6}>
                  <VStack>
                    <HStack>
                      <Truck size={20} color="blue" />
                      <Text fontWeight="semibold" color="blue.800">Estimated Delivery</Text>
                    </HStack>
                    <Text color="blue.700">{getEstimatedDelivery()}</Text>
                  </VStack>
                </Box>
                <VStack w="full" mb={6}>
                  <Text fontSize="lg" fontWeight="semibold">Order Summary</Text>
                  <VStack w="full">
                    <HStack justify="space-between" w="full">
                      <Text color="gray.600">Items ({cartState.totalItems})</Text>
                      <Text fontWeight="semibold">{formatCurrency(subtotal)}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color="gray.600">Tax</Text>
                      <Text fontWeight="semibold">{formatCurrency(tax)}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color="gray.600">Shipping</Text>
                      <Text fontWeight="semibold">{formatCurrency(shippingCost)}</Text>
                    </HStack>
                    <Separator />
                    <HStack justify="space-between" w="full">
                      <Text fontSize="lg" fontWeight="bold">Total</Text>
                      <Text fontSize="lg" fontWeight="bold" color="green.600">
                        {formatCurrency(total)}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
                <VStack gap={3} w="full">
                  <RouterLink to="/profile">
                    <Button colorScheme="blue" size="lg" w="full">
                      View Order History
                    </Button>
                  </RouterLink>
                  <RouterLink to="/shop">
                    <Button variant="outline" size="lg" w="full">
                      Continue Shopping
                    </Button>
                  </RouterLink>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="6xl">
        <VStack>
          <HStack justify="space-between" w="full">
            <Heading size="xl" color="gray.800">Checkout</Heading>
            <RouterLink to="/cart">
              <Button variant="ghost">
                <HStack>
                  <ArrowLeft size={16} />
                  <Text>Back to Cart</Text>
                </HStack>
              </Button>
            </RouterLink>
          </HStack>

          {/* User Welcome Message */}
          {authState.user && (
            <Box w="full" p={4} bg="blue.50" borderRadius="lg" mb={4}>
              <Text color="blue.800" textAlign="center">
                Welcome back, {authState.user.name.firstname}! Your information has been pre-filled.
              </Text>
            </Box>
          )}

          {/* Step Indicator */}
          <Box w="full" maxW="4xl" py={8}>
            <HStack justify="space-between" position="relative">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <StepIndicator
                    step={index}
                    currentStep={currentStep}
                    title={step.title}
                    description={step.description}
                  />
                  {index < steps.length - 1 && (
                    <Box
                      flex={1}
                      h="2px"
                      bg={index < currentStep ? "blue.500" : "gray.200"}
                      mx={4}
                      mt={5}
                      transition="all 0.3s"
                    />
                  )}
                </React.Fragment>
              ))}
            </HStack>
          </Box>

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} w="full" alignItems="start" gap={8}>
            <Box bg="white" p={8} borderRadius="xl" shadow="sm">
              {currentStep === 0 && (
                <VStack align="stretch" gap={6}>
                  <Heading size="lg" mb={6}>Shipping Information</Heading>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                    <Field.Root invalid={!!errors.fullName}>
                      <Field.Label>Full Name *</Field.Label>
                      <Input
                        color={"gray.700"}
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange('fullName')}
                        placeholder="John Doe"
                        borderColor={errors.fullName ? "red.300" : "gray.300"}
                        _focus={{ borderColor: errors.fullName ? "red.500" : "blue.500" }}
                      />
                      <Field.ErrorText>{errors.fullName}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.email}>
                      <Field.Label>Email *</Field.Label>
                      <Input
                        color={"gray.700"}
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange('email')}
                        placeholder="john@example.com"
                        borderColor={errors.email ? "red.300" : "gray.300"}
                        _focus={{ borderColor: errors.email ? "red.500" : "blue.500" }}
                      />
                      <Field.ErrorText>{errors.email}</Field.ErrorText>
                    </Field.Root>
                  </Grid>

                  <Field.Root invalid={!!errors.phone}>
                    <Field.Label>Phone Number *</Field.Label>
                    <Input
                      color={"gray.700"}
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange('phone')}
                      placeholder="(555) 123-4567"
                      borderColor={errors.phone ? "red.300" : "gray.300"}
                      _focus={{ borderColor: errors.phone ? "red.500" : "blue.500" }}
                    />
                    <Field.ErrorText>{errors.phone}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.street}>
                    <Field.Label>Street Address *</Field.Label>
                    <Input
                      color={"gray.700"}
                      value={shippingInfo.street}
                      onChange={handleShippingChange('street')}
                      placeholder="123 Main St"
                      borderColor={errors.street ? "red.300" : "gray.300"}
                      _focus={{ borderColor: errors.street ? "red.500" : "blue.500" }}
                    />
                    <Field.ErrorText>{errors.street}</Field.ErrorText>
                  </Field.Root>

                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
                    <Field.Root invalid={!!errors.city}>
                      <Field.Label>City *</Field.Label>
                      <Input
                        color={"gray.700"}
                        value={shippingInfo.city}
                        onChange={handleShippingChange('city')}
                        placeholder="New York"
                        borderColor={errors.city ? "red.300" : "gray.300"}
                        _focus={{ borderColor: errors.city ? "red.500" : "blue.500" }}
                      />
                      <Field.ErrorText>{errors.city}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.state}>
                      <Field.Label>State *</Field.Label>
                      <Input
                        color={"gray.700"}
                        value={shippingInfo.state}
                        onChange={handleShippingChange('state')}
                        placeholder="NY"
                        borderColor={errors.state ? "red.300" : "gray.300"}
                        _focus={{ borderColor: errors.state ? "red.500" : "blue.500" }}
                      />
                      <Field.ErrorText>{errors.state}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.zipCode}>
                      <Field.Label>ZIP Code *</Field.Label>
                      <Input
                        color={"gray.700"}
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange('zipCode')}
                        placeholder="10001"
                        borderColor={errors.zipCode ? "red.300" : "gray.300"}
                        _focus={{ borderColor: errors.zipCode ? "red.500" : "blue.500" }}
                      />
                      <Field.ErrorText>{errors.zipCode}</Field.ErrorText>
                    </Field.Root>
                  </Grid>
                </VStack>
              )}

              {currentStep === 1 && (
                <VStack align="stretch" gap={6}>
                  <Heading size="lg" mb={6}>Payment Information</Heading>
                  <Field.Root invalid={!!errors.cardNumber}>
                    <Field.Label>Card Number *</Field.Label>
                    <Input
                      color={"gray.700"}
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange('cardNumber')}
                      placeholder="1234 5678 9012 3456"
                      borderColor={errors.cardNumber ? "red.300" : "gray.300"}
                      _focus={{ borderColor: errors.cardNumber ? "red.500" : "blue.500" }}
                    />
                    <Field.ErrorText>{errors.cardNumber}</Field.ErrorText>
                  </Field.Root>

                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <Field.Root invalid={!!errors.expiryDate}>
                      <Field.Label>Expiry Date *</Field.Label>
                      <Input
                        color={"gray.700"}
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange('expiryDate')}
                        placeholder="MM/YY"
                        borderColor={errors.expiryDate ? "red.300" : "gray.300"}
                        _focus={{ borderColor: errors.expiryDate ? "red.500" : "blue.500" }}
                      />
                      <Field.ErrorText>{errors.expiryDate}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.cvv}>
                      <Field.Label>CVV *</Field.Label>
                      <Input
                        color={"gray.700"}
                        type="password"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange('cvv')}
                        placeholder="123"
                        borderColor={errors.cvv ? "red.300" : "gray.300"}
                        _focus={{ borderColor: errors.cvv ? "red.500" : "blue.500" }}
                      />
                      <Field.ErrorText>{errors.cvv}</Field.ErrorText>
                    </Field.Root>
                  </Grid>

                  <Field.Root invalid={!!errors.cardholderName}>
                    <Field.Label>Cardholder Name *</Field.Label>
                    <Input
                      color={"gray.700"}
                      value={paymentInfo.cardholderName}
                      onChange={handlePaymentChange('cardholderName')}
                      placeholder="John Doe"
                      borderColor={errors.cardholderName ? "red.300" : "gray.300"}
                      _focus={{ borderColor: errors.cardholderName ? "red.500" : "blue.500" }}
                    />
                    <Field.ErrorText>{errors.cardholderName}</Field.ErrorText>
                  </Field.Root>

                  <Box p={4} bg="gray.50" borderRadius="lg">
                    <CustomCheckbox
                      checked={paymentInfo.billingAddressSameAsShipping}
                      onChange={handleCheckboxChange}
                    >
                      <Text color="gray.700">
                        Billing address same as shipping
                      </Text>
                    </CustomCheckbox>
                  </Box>

                  {!paymentInfo.billingAddressSameAsShipping && (
                    <VStack align="stretch" mt={4} gap={4}>
                      <Text fontSize="md" fontWeight="semibold" mb={4} color={"gray.600"}>Billing Address</Text>
                      <Field.Root invalid={!!errors.billingStreet}>
                        <Field.Label>Street Address *</Field.Label>
                        <Input
                          color={"gray.700"}
                          value={paymentInfo.billingStreet}
                          onChange={handlePaymentChange('billingStreet')}
                          placeholder="123 Billing St"
                          borderColor={errors.billingStreet ? "red.300" : "gray.300"}
                          _focus={{ borderColor: errors.billingStreet ? "red.500" : "blue.500" }}
                        />
                        <Field.ErrorText>{errors.billingStreet}</Field.ErrorText>
                      </Field.Root>
                      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
                        <Field.Root invalid={!!errors.billingCity}>
                          <Field.Label>City *</Field.Label>
                          <Input
                            color={"gray.700"}
                            value={paymentInfo.billingCity}
                            onChange={handlePaymentChange('billingCity')}
                            placeholder="New York"
                            borderColor={errors.billingCity ? "red.300" : "gray.300"}
                            _focus={{ borderColor: errors.billingCity ? "red.500" : "blue.500" }}
                          />
                          <Field.ErrorText>{errors.billingCity}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={!!errors.billingState}>
                          <Field.Label>State *</Field.Label>
                          <Input
                            color={"gray.700"}
                            value={paymentInfo.billingState}
                            onChange={handlePaymentChange('billingState')}
                            placeholder="NY"
                            borderColor={errors.billingState ? "red.300" : "gray.300"}
                            _focus={{ borderColor: errors.billingState ? "red.500" : "blue.500" }}
                          />
                          <Field.ErrorText>{errors.billingState}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={!!errors.billingZipCode}>
                          <Field.Label>ZIP Code *</Field.Label>
                          <Input
                            color={"gray.700"}
                            value={paymentInfo.billingZipCode}
                            onChange={handlePaymentChange('billingZipCode')}
                            placeholder="10001"
                            borderColor={errors.billingZipCode ? "red.300" : "gray.300"}
                            _focus={{ borderColor: errors.billingZipCode ? "red.500" : "blue.500" }}
                          />
                          <Field.ErrorText>{errors.billingZipCode}</Field.ErrorText>
                        </Field.Root>
                      </Grid>
                    </VStack>
                  )}
                </VStack>
              )}

              {currentStep === 2 && (
                <VStack align="stretch" gap={6}>
                  <Heading size="lg" mb={6} color={"gray.700"}>Review Your Order</Heading>

                  <Box p={6} bg="gray.50" borderRadius="lg" mb={4}>
                    <VStack align="stretch" gap={3}>
                      <Text fontWeight="semibold" mb={3} color={"gray.600"}>Shipping Information</Text>
                      <Text color={"gray.700"}>{shippingInfo.fullName}</Text>
                      <Text color={"gray.700"}>{shippingInfo.email}</Text>
                      <Text color={"gray.700"}>{shippingInfo.phone}</Text>
                      <Text color={"gray.700"}>{shippingInfo.street}</Text>
                      <Text color={"gray.700"}>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</Text>
                    </VStack>
                  </Box>

                  <Box p={6} bg="gray.50" borderRadius="lg" mb={4}>
                    <VStack align="stretch" gap={3}>
                      <Text fontWeight="semibold" mb={3} color={"gray.600"}>Payment Information</Text>
                      <Text color={"gray.700"}>**** **** **** {paymentInfo.cardNumber.replace(/\D/g, '').slice(-4)}</Text>
                      <Text color={"gray.700"}>{paymentInfo.cardholderName}</Text>
                      <Text color={"gray.700"}>Expires: {paymentInfo.expiryDate}</Text>
                    </VStack>
                  </Box>

                  <Box p={6} bg="gray.50" borderRadius="lg">
                    <VStack align="stretch" gap={3}>
                      <Text fontWeight="semibold" mb={3} color={"gray.600"}>Order Items</Text>
                      {cartState.items.map((item) => (
                        <HStack key={item.id} justify="space-between">
                          <VStack align="start" flex={1} gap={1}>
                            <Text color={"gray.700"} fontWeight="medium" lineClamp={2}>
                              {item.title}
                            </Text>
                            <Text color={"gray.500"} fontSize="sm">
                              Quantity: {item.quantity}
                            </Text>
                          </VStack>
                          <Text color={"gray.700"} fontWeight="semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <VStack gap={2}>
                      <HStack>
                        <Truck size={20} color="blue" />
                        <Text fontWeight="semibold" color="blue.800">Estimated Delivery</Text>
                      </HStack>
                      <Text color="blue.700" fontSize="sm">{getEstimatedDelivery()}</Text>
                    </VStack>
                  </Box>
                </VStack>
              )}

              <HStack justify="space-between" mt={8}>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  colorScheme="gray"
                  _hover={{
                    bg: "gray.100",
                  }}
                >
                  <HStack>
                    <ArrowLeft size={16} />
                    <Text>Back</Text>
                  </HStack>
                </Button>
                {currentStep < 2 ? (
                  <Button
                    colorScheme="blue"
                    onClick={handleNext}
                    size="lg"
                    px={8}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    colorScheme="green"
                    size="lg"
                    px={8}
                    onClick={handlePlaceOrder}
                    loading={isPlacingOrder} 
                    loadingText="Placing order..."
                    _hover={{ bg: "green.600" }}
                  >
                    Place Order
                  </Button>
                )}
              </HStack>
            </Box>

            {/* Order Summary Sidebar */}
            <Box bg="white" p={6} borderRadius="xl" shadow="sm" position="sticky" top="20px">
              <Text fontSize="lg" fontWeight="semibold" mb={4} color={"gray.700"}>
                Order Summary
              </Text>
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Text color="gray.600">Subtotal ({cartState.totalItems} items)</Text>
                  <Text fontWeight="semibold" color={"gray.700"}>{formatCurrency(subtotal)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Tax (8%)</Text>
                  <Text fontWeight="semibold" color={"gray.700"}>{formatCurrency(tax)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <HStack>
                    {shippingCost === 0 && (
                      <Badge colorScheme="green" variant="subtle" fontSize="xs">
                        FREE
                      </Badge>
                    )}
                    <Text fontWeight="semibold" color={"gray.700"}>{formatCurrency(shippingCost)}</Text>
                  </HStack>
                </HStack>

                {subtotal < 100 && (
                  <Box p={3} bg="blue.50" borderRadius="md" mt={2}>
                    <Text fontSize="sm" color="blue.600" textAlign="center">
                      Add {formatCurrency(100 - subtotal)} more for free shipping!
                    </Text>
                  </Box>
                )}

                <Separator />
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold" color={"gray.700"}>
                    Total
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    {formatCurrency(total)}
                  </Text>
                </HStack>

                {/* Quick cart items preview */}
                <Box mt={6}>
                  <Text fontSize="sm" fontWeight="semibold" mb={3} color={"gray.600"}>Items in cart:</Text>
                  <VStack align="stretch" maxH="200px" overflowY="auto" gap={2}>
                    {cartState.items.map((item) => (
                      <HStack key={item.id} justify="space-between" fontSize="sm" p={2} bg="gray.50" borderRadius="md">
                        <VStack align="start" flex={1} gap={0}>
                          <Text lineClamp={1} color={"gray.700"} fontWeight="medium">
                            {item.title}
                          </Text>
                          <Text color={"gray.500"} fontSize="xs">
                            {formatCurrency(item.price)} × {item.quantity}
                          </Text>
                        </VStack>
                        <Text color={"gray.700"} fontWeight="semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Security badge */}
                <Box mt={4} p={3} bg="green.50" borderRadius="md" textAlign="center">
                  <HStack justify="center" mb={1}>
                    <CheckCircle size={16} color="green" />
                    <Text fontSize="sm" color="green.700" fontWeight="semibold">
                      Secure Checkout
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="green.600">
                    Your payment information is encrypted and secure
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

// Main Checkout component with protection
const Checkout: React.FC = () => {
  return (
    <ProtectedRoute fallbackMessage="Please log in to proceed with checkout">
      <CheckoutContent />
    </ProtectedRoute>
  );
};

export default Checkout;