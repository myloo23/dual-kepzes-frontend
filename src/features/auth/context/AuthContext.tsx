import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../../../types/api.types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize from localStorage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                // Optionally validate token specifically if needed, 
                // but api interceptors usually handle 401s
            } catch (error) {
                console.error("Failed to parse stored user", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, newUser: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('role', newUser.role);

        setUser(newUser);

        // Notify other tabs/components if they listen to storage events
        // (though Context handles internal app state now)
        window.dispatchEvent(new Event("localStorageUpdated"));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        setUser(null);

        window.dispatchEvent(new Event("localStorageUpdated"));
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
