import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Alert,
  Grid,
  Field,
  InputGroup,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { Eye, EyeOff, User, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import type { LoginCredentials, RegisterData } from '../api/authApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { state, login, register, clearError } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    username: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterData>({
    email: '',
    username: '',
    password: '',
    name: {
      firstname: '',
      lastname: '',
    },
    address: {
      city: '',
      street: '',
      number: 0,
      zipcode: '',
      geolocation: {
        lat: '',
        long: '',
      },
    },
    phone: '',
  });

  // Reset form when switching modes
  const switchMode = () => {
    setIsLoginMode((m) => !m);
    setErrors({});
    clearError();
    setLoginForm({ username: '', password: '' });
    setRegisterForm({
      email: '',
      username: '',
      password: '',
      name: { firstname: '', lastname: '' },
      address: {
        city: '',
        street: '',
        number: 0,
        zipcode: '',
        geolocation: { lat: '', long: '' },
      },
      phone: '',
    });
  };

  // Handle modal close
  const handleClose = () => {
    setErrors({});
    clearError();
    onClose();
  };

  // Validation functions
  const validateLogin = (): boolean => {
    const newErrors: FormErrors = {};

    if (!loginForm.username.trim()) newErrors.username = 'Username is required';
    if (!loginForm.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (loginForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = (): boolean => {
    const newErrors: FormErrors = {};

    if (!registerForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!registerForm.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (registerForm.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!registerForm.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!registerForm.name.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!registerForm.name.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!registerForm.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!registerForm.address.street.trim()) newErrors.street = 'Street address is required';
    if (!registerForm.address.city.trim()) newErrors.city = 'City is required';
    if (!registerForm.address.zipcode.trim()) newErrors.zipcode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Event handlers
  const handleLoginChange =
    (field: keyof LoginCredentials) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setLoginForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const handleRegisterChange =
    (field: string) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setRegisterForm((prev) => {
        if (field === 'firstname' || field === 'lastname') {
          return { ...prev, name: { ...prev.name, [field]: value } };
        } else if (field === 'street' || field === 'city' || field === 'zipcode' || field === 'number') {
          return {
            ...prev,
            address: { ...prev.address, [field]: field === 'number' ? parseInt(value) || 0 : value },
          };
        } else {
          return { ...prev, [field]: value };
        }
      });

      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  // Form submission
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      await login(loginForm);
      handleClose();
    } catch {
      // handled by auth context
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    try {
      await register(registerForm);
      handleClose();
    } catch {
      // handled by auth context
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(d) => !d.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="md">
            <Dialog.Header>
              <Dialog.Title>{isLoginMode ? 'Sign In' : 'Create Account'}</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={6} align="stretch">
                {/* Error Alert */}
                {state.error && (
                  <Alert.Root status="error" borderRadius="md">
                    <Alert.Title>Error</Alert.Title>
                    <Alert.Description>{state.error}</Alert.Description>
                  </Alert.Root>
                )}

                {/* Login Form */}
                {isLoginMode ? (
                  <Box as="form" onSubmit={handleLoginSubmit}>
                    <VStack gap={4} align="stretch">
                      <Field.Root invalid={!!errors.username}>
                        <Field.Label>Username</Field.Label>
                        <InputGroup startElement={<User size={18} />}>
                          <Input
                            value={loginForm.username}
                            onChange={handleLoginChange('username')}
                            placeholder="Enter your username"
                          />
                        </InputGroup>
                        <Field.ErrorText>{errors.username}</Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={!!errors.password}>
                        <Field.Label>Password</Field.Label>
                        <HStack>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={loginForm.password}
                            onChange={handleLoginChange('password')}
                            placeholder="Enter your password"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword((s) => !s)}
                            p={2}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                        </HStack>
                        <Field.ErrorText>{errors.password}</Field.ErrorText>
                      </Field.Root>

                      <Text fontSize="xs" color="gray.600" textAlign="center" mt={2}>
                        Demo credentials: username: "mor_2314", password: "83r5^_"
                      </Text>

                      <Button
                        type="submit"
                        colorPalette="blue"
                        size="lg"
                        loading={state.isLoading}
                        loadingText="Signing in..."
                      >
                        Sign In
                      </Button>
                    </VStack>
                  </Box>
                ) : (
                  /* Register Form */
                  <Box as="form" onSubmit={handleRegisterSubmit}>
                    <VStack gap={4} align="stretch">
                      {/* Basic Info */}
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Field.Root invalid={!!errors.firstname}>
                          <Field.Label>First Name</Field.Label>
                          <Input
                            value={registerForm.name.firstname}
                            onChange={handleRegisterChange('firstname')}
                            placeholder="Tim"
                          />
                          <Field.ErrorText>{errors.firstname}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.lastname}>
                          <Field.Label>Last Name</Field.Label>
                          <Input
                            value={registerForm.name.lastname}
                            onChange={handleRegisterChange('lastname')}
                            placeholder="Gill"
                          />
                          <Field.ErrorText>{errors.lastname}</Field.ErrorText>
                        </Field.Root>
                      </Grid>

                      <Field.Root invalid={!!errors.email}>
                        <Field.Label>Email</Field.Label>
                        <InputGroup startElement={<Mail size={18} />}>
                          <Input
                            type="email"
                            value={registerForm.email}
                            onChange={handleRegisterChange('email')}
                            placeholder="tim@example.com"
                          />
                        </InputGroup>
                        <Field.ErrorText>{errors.email}</Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={!!errors.username}>
                        <Field.Label>Username</Field.Label>
                        <InputGroup startElement={<User size={18} />}>
                          <Input
                            value={registerForm.username}
                            onChange={handleRegisterChange('username')}
                            placeholder="Tim123"
                          />
                        </InputGroup>
                        <Field.ErrorText>{errors.username}</Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={!!errors.password}>
                        <Field.Label>Password</Field.Label>
                        <HStack>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={registerForm.password}
                            onChange={handleRegisterChange('password')}
                            placeholder="Min. 6 characters"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword((s) => !s)}
                            p={2}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                        </HStack>
                        <Field.ErrorText>{errors.password}</Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={!!errors.phone}>
                        <Field.Label>Phone</Field.Label>
                        <InputGroup startElement={<Phone size={18} />}>
                          <Input
                            type="tel"
                            value={registerForm.phone}
                            onChange={handleRegisterChange('phone')}
                            placeholder="+923214224534"
                          />
                        </InputGroup>
                        <Field.ErrorText>{errors.phone}</Field.ErrorText>
                      </Field.Root>

                      {/* Address Section */}
                      <Box pt={2}>
                        <HStack mb={3}>
                          <MapPin size={18} color="#6B7280" />
                          <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                            Address Information
                          </Text>
                        </HStack>

                        <VStack gap={3} align="stretch">
                          <Field.Root invalid={!!errors.street}>
                            <Field.Label fontSize="sm">Street Address</Field.Label>
                            <Input
                              size="sm"
                              value={registerForm.address.street}
                              onChange={handleRegisterChange('street')}
                              placeholder=" DHA Business Hub, Block D, Main Broadway, DHA Phase 8"
                            />
                            <Field.ErrorText>{errors.street}</Field.ErrorText>
                          </Field.Root>

                          <Grid templateColumns="2fr 1fr" gap={3}>
                            <Field.Root invalid={!!errors.city}>
                              <Field.Label fontSize="sm">City</Field.Label>
                              <Input
                                size="sm"
                                value={registerForm.address.city}
                                onChange={handleRegisterChange('city')}
                                placeholder="Lahore"
                              />
                              <Field.ErrorText>{errors.city}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.zipcode}>
                              <Field.Label fontSize="sm">ZIP Code</Field.Label>
                              <Input
                                size="sm"
                                value={registerForm.address.zipcode}
                                onChange={handleRegisterChange('zipcode')}
                                placeholder="54792"
                              />
                              <Field.ErrorText>{errors.zipcode}</Field.ErrorText>
                            </Field.Root>
                          </Grid>
                        </VStack>
                      </Box>

                      <Button
                        type="submit"
                        colorPalette="blue"
                        size="lg"
                        loading={state.isLoading}
                        loadingText="Creating account..."
                      >
                        Create Account
                      </Button>
                    </VStack>
                  </Box>
                )}

                {/* Mode Switch */}
                <Box textAlign="center" pt={4} borderTop="1px solid" borderTopColor="gray.200">
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
                  </Text>
                  <Button variant="ghost" colorPalette="blue" size="sm" onClick={switchMode}>
                    {isLoginMode ? 'Create Account' : 'Sign In'}
                  </Button>
                </Box>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
