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
import { Link as RouterLink } from 'react-router-dom';

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

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId] = useState(
    () => Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddressSameAsShipping: true,
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const subtotal = state.totalPrice;
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
    // Simple notification - you can replace this with your preferred toast library
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

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setOrderPlaced(true);
    clearCart();
    setIsPlacingOrder(false);

    showToast(
      "Order placed successfully!",
      `Your order #${orderId} has been confirmed.`
    );
  };

  // Event handlers with proper typing
  const handleShippingChange = (field: keyof ShippingInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    setShippingInfo((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePaymentChange = (field: keyof PaymentInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    // Format expiry date
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }

    // Format CVV (numbers only)
    if (field === 'cvv') {
      value = value.replace(/\D/g, '');
    }

    setPaymentInfo((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo((prev) => ({ ...prev, billingAddressSameAsShipping: e.target.checked }));
  };

  // Simple Checkbox component since Chakra's might not be working
  const CustomCheckbox: React.FC<{ checked: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void; children: React.ReactNode }> = ({
    checked,
    onChange,
    children
  }) => (
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
  const StepIndicator: React.FC<{ step: number; currentStep: number; title: string; description: string }> = ({
    step,
    currentStep,
    title,
    description
  }) => (
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
  if (state.items.length === 0 && !orderPlaced) {
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
                      <Text color="gray.600">Items ({state.totalItems})</Text>
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
                <RouterLink to="/shop">
                  <Button colorScheme="blue" size="lg" w="full">
                    Continue Shopping
                  </Button>
                </RouterLink>
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

          {/* Custom Step Indicator */}
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
                    />
                  )}
                </React.Fragment>
              ))}
            </HStack>
          </Box>

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} w="full" alignItems="start">
            <Box bg="white" p={8} borderRadius="xl" shadow="sm">
              {currentStep === 0 && (
                <VStack align="stretch">
                  <Heading size="lg" mb={6}>Shipping Information</Heading>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                    <Field.Root invalid={!!errors.fullName}>
                      <Field.Label>Full Name</Field.Label>
                      <Input
                        color={"gray.500"}
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange('fullName')}
                        placeholder="John Doe"
                      />
                      <Field.ErrorText>{errors.fullName}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.email}>
                      <Field.Label>Email</Field.Label>
                      <Input
                        color={"gray.500"}
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange('email')}
                        placeholder="john@example.com"
                      />
                      <Field.ErrorText>{errors.email}</Field.ErrorText>
                    </Field.Root>
                  </Grid>

                  <Field.Root invalid={!!errors.phone}>
                    <Field.Label>Phone Number</Field.Label>
                    <Input
                      color={"gray.500"}
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange('phone')}
                      placeholder="(555) 123-4567"
                    />
                    <Field.ErrorText>{errors.phone}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.street}>
                    <Field.Label>Street Address</Field.Label>
                    <Input
                      color={"gray.500"}
                      value={shippingInfo.street}
                      onChange={handleShippingChange('street')}
                      placeholder="123 Main St"
                    />
                    <Field.ErrorText>{errors.street}</Field.ErrorText>
                  </Field.Root>

                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
                    <Field.Root invalid={!!errors.city}>
                      <Field.Label>City</Field.Label>
                      <Input
                        color={"gray.500"}
                        value={shippingInfo.city}
                        onChange={handleShippingChange('city')}
                        placeholder="New York"
                      />
                      <Field.ErrorText>{errors.city}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.state}>
                      <Field.Label>State</Field.Label>
                      <Input
                        color={"gray.500"}
                        value={shippingInfo.state}
                        onChange={handleShippingChange('state')}
                        placeholder="NY"
                      />
                      <Field.ErrorText>{errors.state}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.zipCode}>
                      <Field.Label>ZIP Code</Field.Label>
                      <Input
                        color={"gray.500"}
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange('zipCode')}
                        placeholder="50000"
                      />
                      <Field.ErrorText>{errors.zipCode}</Field.ErrorText>
                    </Field.Root>
                  </Grid>
                </VStack>
              )}

              {currentStep === 1 && (
                <VStack align="stretch">
                  <Heading size="lg" mb={6}>Payment Information</Heading>
                  <Field.Root invalid={!!errors.cardNumber}>
                    <Field.Label>Card Number</Field.Label>
                    <Input
                      color={"gray.500"}
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange('cardNumber')}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    <Field.ErrorText>{errors.cardNumber}</Field.ErrorText>
                  </Field.Root>

                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <Field.Root invalid={!!errors.expiryDate}>
                      <Field.Label>Expiry Date</Field.Label>
                      <Input
                        color={"gray.500"}
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange('expiryDate')}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      <Field.ErrorText>{errors.expiryDate}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.cvv}>
                      <Field.Label>CVV</Field.Label>
                      <Input
                        color={"gray.500"}
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange('cvv')}
                        placeholder="123"
                        maxLength={4}
                      />
                      <Field.ErrorText>{errors.cvv}</Field.ErrorText>
                    </Field.Root>
                  </Grid>

                  <Field.Root invalid={!!errors.cardholderName}>
                    <Field.Label>Cardholder Name</Field.Label>
                    <Input
                      color={"gray.500"}
                      value={paymentInfo.cardholderName}
                      onChange={handlePaymentChange('cardholderName')}
                      placeholder="John Doe"
                    />
                    <Field.ErrorText>{errors.cardholderName}</Field.ErrorText>
                  </Field.Root>

                  <CustomCheckbox

                    checked={paymentInfo.billingAddressSameAsShipping}
                    onChange={handleCheckboxChange}
                  >
                    <Text color="gray.600">
                      Billing address same as shipping
                    </Text>
                  </CustomCheckbox>

                  {!paymentInfo.billingAddressSameAsShipping && (
                    <VStack align="stretch" mt={4}>
                      <Text fontSize="md" fontWeight="semibold" mb={4} color={"gray.400"}>Billing Address</Text>
                      <Field.Root invalid={!!errors.billingStreet}>
                        <Field.Label>Street Address</Field.Label>
                        <Input
                          color={"gray.500"}
                          value={paymentInfo.billingStreet}
                          onChange={handlePaymentChange('billingStreet')}
                          placeholder="123 Billing St"
                        />
                        <Field.ErrorText>{errors.billingStreet}</Field.ErrorText>
                      </Field.Root>
                      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
                        <Field.Root invalid={!!errors.billingCity}>
                          <Field.Label>City</Field.Label>
                          <Input
                            color={"gray.500"}
                            value={paymentInfo.billingCity}
                            onChange={handlePaymentChange('billingCity')}
                            placeholder="New York"
                          />
                          <Field.ErrorText>{errors.billingCity}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={!!errors.billingState}>
                          <Field.Label>State</Field.Label>
                          <Input
                            color={"gray.500"}
                            value={paymentInfo.billingState}
                            onChange={handlePaymentChange('billingState')}
                            placeholder="NY"
                          />
                          <Field.ErrorText>{errors.billingState}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={!!errors.billingZipCode}>
                          <Field.Label>ZIP Code</Field.Label>
                          <Input
                            color={"gray.500"}
                            value={paymentInfo.billingZipCode}
                            onChange={handlePaymentChange('billingZipCode')}
                            placeholder="50000"
                          />
                          <Field.ErrorText>{errors.billingZipCode}</Field.ErrorText>
                        </Field.Root>
                      </Grid>
                    </VStack>
                  )}
                </VStack>
              )}

              {currentStep === 2 && (
                <VStack align="stretch">
                  <Heading size="lg" mb={6} color={"gray.700"}>Review Your Order</Heading>

                  <Box p={4} bg="gray.50" borderRadius="lg" mb={4}>
                    <VStack align="stretch">
                      <Text fontWeight="semibold" mb={3} color={"gray.600"}>Shipping Information</Text>
                      <Text color={"gray.500"}>{shippingInfo.fullName}</Text>
                      <Text color={"gray.500"}>{shippingInfo.email}</Text>
                      <Text color={"gray.500"}>{shippingInfo.phone}</Text>
                      <Text color={"gray.500"}>{shippingInfo.street}</Text>
                      <Text color={"gray.500"}>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</Text>
                    </VStack>
                  </Box>

                  <Box p={4} bg="gray.50" borderRadius="lg" mb={4}>
                    <VStack align="stretch">
                      <Text fontWeight="semibold" mb={3} color={"gray.500"}>Payment Information</Text>
                      <Text color={"gray.500"}>**** **** **** {paymentInfo.cardNumber.replace(/\D/g, '').slice(-4)}</Text>
                      <Text color={"gray.500"}>{paymentInfo.cardholderName}</Text>
                      <Text color={"gray.500"}>Expires: {paymentInfo.expiryDate}</Text>
                    </VStack>
                  </Box>

                  <Box p={4} bg="gray.50" borderRadius="lg">
                    <VStack align="stretch">
                      <Text fontWeight="semibold" mb={3} color={"gray.600"}>Order Items</Text>
                      {state.items.map((item) => (
                        <HStack key={item.id} justify="space-between">
                          <Text color={"gray.500"} truncate>{item.title} × {item.quantity}</Text>
                          <Text color={"gray.500"}>{formatCurrency(item.price * item.quantity)}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              )}

              <HStack justify="space-between" mt={8}>
                <Button
                  color={"gray.500"}
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  _hover={{
                    color: "white",             
                    borderColor: "gray.500", 
                  }}
                >
                  Back
                </Button>
                {currentStep < 2 ? (
                  <Button colorScheme="blue" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    colorScheme="green"
                    onClick={handlePlaceOrder}
                    size="lg"
                    loading={isPlacingOrder}
                    loadingText="Placing Order..."
                  >
                    Place Order
                  </Button>
                )}
              </HStack>
            </Box>

            {/* Order Summary Sidebar */}
            <Box bg="white" p={6} borderRadius="xl" shadow="sm" position="sticky" top="20px">
              <Text fontSize="lg" fontWeight="semibold" mb={4} color={"gray.600"}>
                Order Summary
              </Text>
              <VStack align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">Subtotal ({state.totalItems} items)</Text>
                  <Text fontWeight="semibold" color={"gray.500"}>{formatCurrency(subtotal)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Tax (8%)</Text>
                  <Text fontWeight="semibold" color={"gray.500"}>{formatCurrency(tax)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <HStack>
                    {shippingCost === 0 && (
                      <Badge colorScheme="green" variant="subtle" fontSize="xs">
                        FREE
                      </Badge>
                    )}
                    <Text fontWeight="semibold" color={"gray.500"}>{formatCurrency(shippingCost)}</Text>
                  </HStack>
                </HStack>

                {subtotal < 100 && (
                  <Text fontSize="xs" color="blue.600" textAlign="center">
                    Add {formatCurrency(100 - subtotal)} more for free shipping!
                  </Text>
                )}

                <Separator />
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold" color={"gray.600"}>
                    Total
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600" >
                    {formatCurrency(total)}
                  </Text>
                </HStack>

                {/* Quick cart items preview */}
                <Box mt={4}>
                  <Text fontSize="sm" fontWeight="semibold" mb={2} color={"gray.500"}>Items in cart:</Text>
                  <VStack align="stretch" maxH="200px" overflowY="auto">
                    {state.items.map((item) => (
                      <HStack key={item.id} justify="space-between" fontSize="sm">
                        <Text truncate color={"gray.500"}>{item.title}</Text>
                        <Text color={"gray.500"}>×{item.quantity}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Checkout;