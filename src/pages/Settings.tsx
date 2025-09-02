import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Alert,
    Separator,
} from '@chakra-ui/react';
import { 
    ArrowLeft, 
    Bell, 
    Shield, 
    Globe, 
    Trash2, 
    Download,
    AlertTriangle 
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../components/hooks/useAuth';

interface SettingsState {
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        orderUpdates: boolean;
        promotions: boolean;
    };
    privacy: {
        profileVisible: boolean;
        dataCollection: boolean;
        analytics: boolean;
    };
    preferences: {
        darkMode: boolean;
        language: string;
        currency: string;
    };
}

const Settings: React.FC = () => {
    const { state: authState, logout } = useAuth();
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Settings state
    const [settings, setSettings] = useState<SettingsState>({
        notifications: {
            email: true,
            push: true,
            sms: false,
            orderUpdates: true,
            promotions: false,
        },
        privacy: {
            profileVisible: true,
            dataCollection: false,
            analytics: true,
        },
        preferences: {
            darkMode: false,
            language: 'English',
            currency: 'USD',
        },
    });

    // Redirect if not authenticated
    if (!authState.isAuthenticated || !authState.user) {
        return (
            <Box minH="100vh" bg="gray.50" py={8}>
                <Container maxW="4xl">
                    <VStack textAlign="center" py={20}>
                        <Text fontSize="xl" color="gray.600" mb={4}>
                            Please log in to access settings
                        </Text>
                        <RouterLink to="/">
                            <Button colorScheme="blue">
                                Go Home
                            </Button>
                        </RouterLink>
                    </VStack>
                </Container>
            </Box>
        );
    }

    const handleSettingChange = (category: keyof SettingsState, setting: string) => () => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: !prev[category][setting as keyof typeof prev[typeof category]],
            },
        }));

        // Show success message
        setSuccessMessage('Settings updated successfully');
        setTimeout(() => setSuccessMessage(''), 2000);
    };

    const ToggleButton = ({ isOn, onClick, label, description }: { 
        isOn: boolean; 
        onClick: () => void; 
        label: string; 
        description: string; 
    }) => (
        <HStack justify="space-between">
            <VStack align="flex-start" gap={0}>
                <Text fontWeight="medium" color="gray.700">{label}</Text>
                <Text fontSize="sm" color="gray.500">{description}</Text>
            </VStack>
            <Button
                size="sm"
                colorScheme={isOn ? "green" : "gray"}
                variant={isOn ? "solid" : "outline"}
                onClick={onClick}
                minW="60px"
            >
                {isOn ? "ON" : "OFF"}
            </Button>
        </HStack>
    );

    const handleExportData = () => {
        // Simulate data export
        const userData = {
            profile: authState.user,
            settings: settings,
            exportDate: new Date().toISOString(),
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `user-data-${authState.user?.id || 'export'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setSuccessMessage('Data exported successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleDeleteAccount = () => {
        // In a real app, this would call an API to delete the account
        console.log('Account deletion requested');
        setSuccessMessage('Account deletion requested. You will receive a confirmation email.');
        setShowDeleteConfirm(false);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="4xl">
                <VStack gap={8} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="center">
                        <VStack align="flex-start" gap={1}>
                            <Heading size="xl" color="gray.800">
                                Settings
                            </Heading>
                            <Text color="gray.600">
                                Manage your account preferences and privacy settings
                            </Text>
                        </VStack>

                        <RouterLink to="/profile">
                            <Button variant="outline" size="sm">
                                <HStack gap={2}>
                                    <ArrowLeft size={16} />
                                    <Text>Back to Profile</Text>
                                </HStack>
                            </Button>
                        </RouterLink>
                    </HStack>

                    {/* Success Message */}
                    {successMessage && (
                        <Alert.Root status="success" borderRadius="md">
                            <Alert.Indicator />
                            <Alert.Title>Success!</Alert.Title>
                            <Alert.Description>{successMessage}</Alert.Description>
                        </Alert.Root>
                    )}

                    {/* Settings Sections */}
                    <VStack gap={6} align="stretch">
                        {/* Notifications */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                            <HStack gap={3} mb={4}>
                                <Bell size={20} color="#3B82F6" />
                                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                                    Notifications
                                </Text>
                            </HStack>
                            
                            <VStack gap={4} align="stretch">
                                <ToggleButton
                                    isOn={settings.notifications.email}
                                    onClick={handleSettingChange('notifications', 'email')}
                                    label="Email Notifications"
                                    description="Receive updates via email"
                                />

                                <ToggleButton
                                    isOn={settings.notifications.push}
                                    onClick={handleSettingChange('notifications', 'push')}
                                    label="Push Notifications"
                                    description="Browser notifications"
                                />

                                <ToggleButton
                                    isOn={settings.notifications.orderUpdates}
                                    onClick={handleSettingChange('notifications', 'orderUpdates')}
                                    label="Order Updates"
                                    description="Notifications about your orders"
                                />

                                <ToggleButton
                                    isOn={settings.notifications.promotions}
                                    onClick={handleSettingChange('notifications', 'promotions')}
                                    label="Promotional Emails"
                                    description="Special offers and discounts"
                                />
                            </VStack>
                        </Box>

                        {/* Privacy */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                            <HStack gap={3} mb={4}>
                                <Shield size={20} color="#10B981" />
                                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                                    Privacy & Security
                                </Text>
                            </HStack>
                            
                            <VStack gap={4} align="stretch">
                                <ToggleButton
                                    isOn={settings.privacy.profileVisible}
                                    onClick={handleSettingChange('privacy', 'profileVisible')}
                                    label="Profile Visibility"
                                    description="Make your profile visible to others"
                                />

                                <ToggleButton
                                    isOn={settings.privacy.dataCollection}
                                    onClick={handleSettingChange('privacy', 'dataCollection')}
                                    label="Data Collection"
                                    description="Allow data collection for personalization"
                                />

                                <ToggleButton
                                    isOn={settings.privacy.analytics}
                                    onClick={handleSettingChange('privacy', 'analytics')}
                                    label="Analytics"
                                    description="Help improve our service"
                                />
                            </VStack>
                        </Box>

                        {/* Preferences */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                            <HStack gap={3} mb={4}>
                                <Globe size={20} color="#8B5CF6" />
                                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                                    Preferences
                                </Text>
                            </HStack>
                            
                            <VStack gap={4} align="stretch">
                                <ToggleButton
                                    isOn={settings.preferences.darkMode}
                                    onClick={handleSettingChange('preferences', 'darkMode')}
                                    label="Dark Mode"
                                    description="Switch to dark theme"
                                />
                            </VStack>
                        </Box>

                        {/* Data Management */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
                                Data Management
                            </Text>
                            
                            <VStack gap={4} align="stretch">
                                <HStack justify="space-between" p={4} bg="blue.50" borderRadius="lg">
                                    <VStack align="flex-start" gap={1}>
                                        <Text fontWeight="medium" color="blue.700">Export Your Data</Text>
                                        <Text fontSize="sm" color="blue.600">
                                            Download a copy of your account data
                                        </Text>
                                    </VStack>
                                    <Button 
                                        size="sm" 
                                        colorScheme="blue" 
                                        variant="outline"
                                        onClick={handleExportData}
                                    >
                                        <HStack gap={2}>
                                            <Download size={16} />
                                            <Text>Export</Text>
                                        </HStack>
                                    </Button>
                                </HStack>

                                <Separator />

                                {/* Danger Zone */}
                                <Box p={4} bg="red.50" borderRadius="lg" border="1px solid" borderColor="red.200">
                                    <HStack gap={3} mb={3}>
                                        <AlertTriangle size={20} color="#EF4444" />
                                        <Text fontSize="md" fontWeight="semibold" color="red.700">
                                            Danger Zone
                                        </Text>
                                    </HStack>
                                    
                                    {!showDeleteConfirm ? (
                                        <VStack align="stretch" gap={3}>
                                            <Text fontSize="sm" color="red.600">
                                                Once you delete your account, there is no going back. Please be certain.
                                            </Text>
                                            <Button
                                                size="sm"
                                                colorScheme="red"
                                                variant="outline"
                                                onClick={() => setShowDeleteConfirm(true)}
                                                alignSelf="flex-start"
                                            >
                                                <HStack gap={2}>
                                                    <Trash2 size={16} />
                                                    <Text>Delete Account</Text>
                                                </HStack>
                                            </Button>
                                        </VStack>
                                    ) : (
                                        <VStack align="stretch" gap={3}>
                                            <Text fontSize="sm" color="red.700" fontWeight="medium">
                                                Are you absolutely sure? This action cannot be undone.
                                            </Text>
                                            <HStack gap={2}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    colorScheme="red"
                                                    onClick={handleDeleteAccount}
                                                >
                                                    Yes, Delete My Account
                                                </Button>
                                            </HStack>
                                        </VStack>
                                    )}
                                </Box>
                            </VStack>
                        </Box>

                        {/* Account Actions */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
                                Account Actions
                            </Text>
                            
                            <VStack gap={3} align="stretch">
                                <RouterLink to="/profile">
                                    <Button w="full" variant="outline" colorScheme="blue">
                                        <HStack gap={2}>
                                            <ArrowLeft size={16} />
                                            <Text>Back to Profile</Text>
                                        </HStack>
                                    </Button>
                                </RouterLink>

                                <Button
                                    w="full"
                                    variant="outline"
                                    colorScheme="red"
                                    onClick={logout}
                                >
                                    <HStack gap={2}>
                                        <Text>Sign Out</Text>
                                    </HStack>
                                </Button>
                            </VStack>
                        </Box>
                    </VStack>
                </VStack>
            </Container>
        </Box>
    );
};

export default Settings;