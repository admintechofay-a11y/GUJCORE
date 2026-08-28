'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 
  | 'Delegate' 
  | 'Author' 
  | 'Speaker' 
  | 'Exhibitor' 
  | 'Sponsor' 
  | 'Reviewer' 
  | 'Admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  title?: string;
  role: UserRole;
  organization: string;
  designation: string;
  mobileNumber: string;
  city: string;
  country: string;
  membershipType: string;
  membershipNumber?: string;
  registeredAt: string;
  ticketId?: string;
  passTier?: string;
  password?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Partial<UserProfile> & { password?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function cleanFullName(name?: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  const titleTokens = trimmed.match(/(?:(?:Dr|Prof|Mr|Ms|Mrs|Er)\.?\s*)+/gi);
  if (titleTokens && titleTokens[0]) {
    const matched = titleTokens[0].match(/(?:Dr|Prof|Mr|Ms|Mrs|Er)\.?/gi) || [];
    const preferredTitle = matched.find(t => /^Dr\.?$/i.test(t) || /^Prof\.?$/i.test(t)) || matched[0] || 'Mr.';
    const normalizedTitle = preferredTitle.replace(/\.?$/, '.');
    const baseName = trimmed.replace(/(?:(?:Dr|Prof|Mr|Ms|Mrs|Er)\.?\s*)+/gi, '').trim();
    return `${normalizedTitle} ${baseName}`.trim();
  }
  return trimmed;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load stored user session from localStorage
    try {
      const stored = localStorage.getItem('gujcorr_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.fullName) {
          parsed.fullName = cleanFullName(parsed.fullName);
          setUser(parsed);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole = 'Delegate') => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email || !email.includes('@')) {
      setIsLoading(false);
      return { success: false, message: 'Please enter a valid email address.' };
    }

    try {
      // Check registered users list
      const storedUsersRaw = localStorage.getItem('gujcorr_registered_users');
      const registeredUsers: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      let matched = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!matched) {
        // Create authenticated profile for the verified email
        matched = {
          id: 'usr-' + Math.random().toString(36).substr(2, 9),
          email: email.trim().toLowerCase(),
          fullName: cleanFullName(email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())),
          title: 'Mr.',
          role: role,
          organization: 'Participant Organization',
          designation: 'Conference Participant',
          mobileNumber: '+91 98765 43210',
          city: 'Vadodara',
          country: 'India',
          membershipType: 'Non-Member',
          registeredAt: new Date().toISOString().split('T')[0],
          ticketId: 'GUJ27-' + (role?.toUpperCase().slice(0, 3) || 'DEL') + '-' + Math.floor(100000 + Math.random() * 900000),
          passTier: 'Delegate Pass'
        };
        registeredUsers.push(matched);
        localStorage.setItem('gujcorr_registered_users', JSON.stringify(registeredUsers));
      }

      matched.fullName = cleanFullName(matched.fullName);
      setUser(matched);
      localStorage.setItem('gujcorr_auth_user', JSON.stringify(matched));
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, message: 'Authentication error. Please try again.' };
    }
  };

  const register = async (userData: Partial<UserProfile> & { password?: string }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!userData.email || !userData.email.includes('@')) {
      setIsLoading(false);
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      email: userData.email.trim().toLowerCase(),
      fullName: cleanFullName(userData.fullName || 'Conference Delegate'),
      title: userData.title || 'Mr.',
      role: userData.role || 'Author',
      organization: userData.organization || 'Independent Researcher',
      designation: userData.designation || 'Specialist',
      mobileNumber: userData.mobileNumber || '+91 98765 43210',
      city: userData.city || 'Vadodara',
      country: userData.country || 'India',
      membershipType: userData.membershipType || 'Non-Member',
      membershipNumber: userData.membershipNumber,
      registeredAt: new Date().toISOString().split('T')[0],
      ticketId: 'GUJ27-' + (userData.role?.toUpperCase().slice(0, 3) || 'DEL') + '-' + Math.floor(100000 + Math.random() * 900000),
      passTier: userData.passTier || 'Registered Account'
    };

    try {
      const storedUsersRaw = localStorage.getItem('gujcorr_registered_users');
      const registeredUsers: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      
      const existingIdx = registeredUsers.findIndex(u => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (existingIdx >= 0) {
        registeredUsers[existingIdx] = newUser;
      } else {
        registeredUsers.push(newUser);
      }
      localStorage.setItem('gujcorr_registered_users', JSON.stringify(registeredUsers));
    } catch {
      // ignore
    }

    setUser(newUser);
    localStorage.setItem('gujcorr_auth_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gujcorr_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
