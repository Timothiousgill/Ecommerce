import React, { createContext, useReducer, useEffect } from 'react';
import type { User, LoginCredentials, RegisterData } from "../../api/authApi";
import { loginUser, registerUser, getUserProfile } from "../../api/authApi";
// Auth state interface
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Action types for auth operations
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'REGISTER_START' }
    | { type: 'REGISTER_SUCCESS'; payload: { token: string; user: User } }
    | { type: 'REGISTER_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'LOAD_USER_START' }
    | { type: 'LOAD_USER_SUCCESS'; payload: User }
    | { type: 'LOAD_USER_FAILURE'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'SET_LOADING'; payload: boolean };

// Context type
interface AuthContextType {
    state: AuthState;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Local storage keys
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

// Helper functions for localStorage
const saveAuthToStorage = (token: string, user: User) => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.warn('Failed to save auth data to localStorage:', error);
    }
};

const loadAuthFromStorage = (): { token: string | null; user: User | null } => {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);
        const user = userStr ? JSON.parse(userStr) : null;
        return { token, user };
    } catch (error) {
        console.warn('Failed to load auth data from localStorage:', error);
        return { token: null, user: null };
    }
};

const clearAuthFromStorage = () => {
    try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    } catch (error) {
        console.warn('Failed to clear auth data from localStorage:', error);
    }
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
        case 'REGISTER_START':
        case 'LOAD_USER_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                token: action.payload.token,
                user: action.payload.user,
                error: null,
            };

        case 'LOGIN_FAILURE':
        case 'REGISTER_FAILURE':
        case 'LOAD_USER_FAILURE':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                token: null,
                user: null,
                error: action.payload,
            };

        case 'LOAD_USER_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload,
                error: null,
            };

        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };

        default:
            return state;
    }
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load auth data from localStorage
    useEffect(() => {
        const loadStoredAuth = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });

            const { token, user } = loadAuthFromStorage();

            if (token && user) {
                try {
                    // Verify token is still valid by fetching user profile
                    const userData = await getUserProfile(user.id);
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: { token, user: userData },
                    });
                } catch (error) {
                    console.error("Auth error:", error);
                    clearAuthFromStorage();
                    dispatch({ type: "LOGOUT" });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        loadStoredAuth();
    }, []);

    // Login function
    const login = async (credentials: LoginCredentials): Promise<void> => {
        dispatch({ type: 'LOGIN_START' });

        try {
            // First, login to get token
            const loginResponse = await loginUser(credentials);
            const mockUser: User = {
                id: 1, 
                email: credentials.username.includes('@') ? credentials.username : `${credentials.username}@example.com`,
                username: credentials.username,
                password: credentials.password,
                name: {
                    firstname: credentials.username.split('@')[0] || 'John',
                    lastname: 'Doe',
                },
                address: {
                    city: 'New York',
                    street: '123 Main St',
                    number: 1,
                    zipcode: '10001',
                    geolocation: {
                        lat: '40.7128',
                        long: '-74.0060',
                    },
                },
                phone: '555-123-4567',
            };

            // Save to localStorage
            saveAuthToStorage(loginResponse.token, mockUser);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token: loginResponse.token, user: mockUser },
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
            throw error;
        }
    };

    // Register function
    const register = async (userData: RegisterData): Promise<void> => {
        dispatch({ type: 'REGISTER_START' });

        try {
            const newUser = await registerUser(userData);

            // After successful registration, automatically log in
            const loginResponse = await loginUser({
                username: userData.username,
                password: userData.password,
            });

            // Save to localStorage
            saveAuthToStorage(loginResponse.token, newUser);

            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: { token: loginResponse.token, user: newUser },
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        clearAuthFromStorage();
        dispatch({ type: 'LOGOUT' });
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const contextValue: AuthContextType = {
        state,
        login,
        register,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };