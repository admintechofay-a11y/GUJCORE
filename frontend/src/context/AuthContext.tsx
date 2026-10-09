'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 
  | 'Super Administrator'
  | 'Administrator'
  | 'Secretariat Staff'
  | 'Finance Staff'
  | 'Paper Coordinator'
  | 'Reviewer'
  | 'Content Editor'
  | 'Delegate' 
  | 'Author' 
  | 'Speaker' 
  | 'Exhibitor' 
  | 'Sponsor' 
  | 'Admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  title?: string;
  role: UserRole;
  organization?: string;
  designation?: string;
  mobileNumber?: string;
  city?: string;
  country?: string;
  membershipType?: string;
  membershipNumber?: string;
  registeredAt?: string;
  ticketId?: string;
  passTier?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, requestedRole?: UserRole) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Partial<UserProfile> & { password?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<UserProfile | null>;
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

  // Server-side session verification
  const checkSession = async (): Promise<UserProfile | null> => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.user) {
          const verifiedUser: UserProfile = {
            ...json.user,
            fullName: cleanFullName(json.user.fullName)
          };
          setUser(verifiedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('gujcorr_auth_user', JSON.stringify(verifiedUser));
          }
          return verifiedUser;
        }
      }
    } catch (err) {
      console.warn('[AUTH] Error checking session from server:', err);
    }

    // If server session invalid, check if we have a non-admin delegate cached
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('gujcorr_auth_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Never trust stored Admin or staff role without server validation!
          const isStaffRole = [
            'Super Administrator',
            'Administrator',
            'Secretariat Staff',
            'Finance Staff',
            'Paper Coordinator',
            'Admin'
          ].includes(parsed.role);

          if (!isStaffRole && parsed.fullName) {
            parsed.fullName = cleanFullName(parsed.fullName);
            setUser(parsed);
            return parsed;
          } else if (isStaffRole) {
            // Clear unverified administrative role from local storage
            localStorage.removeItem('gujcorr_auth_user');
            setUser(null);
          }
        }
      } catch {
        // ignore
      }
    }

    setUser(null);
    return null;
  };

  useEffect(() => {
    checkSession().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string, requestedRole: UserRole = 'Delegate') => {
    setIsLoading(true);

    if (!email || !email.includes('@')) {
      setIsLoading(false);
      return { success: false, message: 'Please enter a valid email address.' };
    }

    try {
      // 1. Always attempt server-side verification first
      const serverRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const serverJson = await serverRes.json();

      if (serverRes.ok && serverJson.success && serverJson.user) {
        const verifiedUser: UserProfile = {
          ...serverJson.user,
          fullName: cleanFullName(serverJson.user.fullName)
        };
        setUser(verifiedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gujcorr_auth_user', JSON.stringify(verifiedUser));
        }
        setIsLoading(false);
        return { success: true };
      }

      // If server returned a rate limit or explicit error
      if (serverRes.status === 429) {
        setIsLoading(false);
        return { success: false, message: serverJson.message };
      }

      // 2. If the user was trying to log into an administrative account, DO NOT FALL BACK TO LOCAL STORAGE
      const isStaffAttempt = [
        'Super Administrator',
        'Administrator',
        'Secretariat Staff',
        'Finance Staff',
        'Paper Coordinator',
        'Admin'
      ].includes(requestedRole);

      if (isStaffAttempt) {
        setIsLoading(false);
        return { 
          success: false, 
          message: serverJson.message || 'Invalid administrative credentials. Check email and password.' 
        };
      }

      // 3. For public attendees/authors (Delegate, Author, Exhibitor), check registered local attendees
      if (typeof window !== 'undefined') {
        const storedUsersRaw = localStorage.getItem('gujcorr_registered_users');
        const registeredUsers: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        let matched = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (matched) {
          // Force non-staff role
          matched.role = (['Delegate', 'Author', 'Speaker', 'Exhibitor', 'Sponsor'].includes(matched.role) 
            ? matched.role 
            : 'Delegate') as UserRole;
          matched.fullName = cleanFullName(matched.fullName);
          setUser(matched);
          localStorage.setItem('gujcorr_auth_user', JSON.stringify(matched));
          setIsLoading(false);
          return { success: true };
        } else if (password && password.length >= 4) {
          // Create participant profile
          const participant: UserProfile = {
            id: 'usr-' + Math.random().toString(36).substring(2, 9),
            email: email.trim().toLowerCase(),
            fullName: cleanFullName(email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())),
            title: 'Mr.',
            role: requestedRole,
            organization: '',
            designation: '',
            mobileNumber: '',
            city: '',
            country: 'India',
            membershipType: 'Non-Member',
            registeredAt: new Date().toISOString().split('T')[0],
            ticketId: 'GUJ27-' + (requestedRole.toUpperCase().slice(0, 3) || 'DEL') + '-' + Math.floor(100000 + Math.random() * 900000),
            passTier: 'Delegate Pass'
          };
          registeredUsers.push(participant);
          localStorage.setItem('gujcorr_registered_users', JSON.stringify(registeredUsers));
          setUser(participant);
          localStorage.setItem('gujcorr_auth_user', JSON.stringify(participant));
          setIsLoading(false);
          return { success: true };
        }
      }

      setIsLoading(false);
      return { 
        success: false, 
        message: serverJson.message || 'Invalid credentials. Please verify your email and password.' 
      };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: 'Authentication error. Please try again.' };
    }
  };

  const register = async (userData: Partial<UserProfile> & { password?: string }) => {
    setIsLoading(true);

    if (!userData.email || !userData.email.includes('@')) {
      setIsLoading(false);
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // CRITICAL SECURITY RULE: Public registration can NEVER grant Admin or Super Administrator
    const sanitizedRole: UserRole = (
      ['Delegate', 'Author', 'Speaker', 'Exhibitor'].includes(userData.role as string)
        ? userData.role!
        : 'Delegate'
    );

    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      email: userData.email.trim().toLowerCase(),
      fullName: cleanFullName(userData.fullName || 'Conference Delegate'),
      title: userData.title || 'Mr.',
      role: sanitizedRole,
      organization: userData.organization || 'Independent Researcher',
      designation: userData.designation || 'Specialist',
      mobileNumber: userData.mobileNumber || '',
      city: userData.city || 'Vadodara',
      country: userData.country || 'India',
      membershipType: userData.membershipType || 'Non-Member',
      membershipNumber: userData.membershipNumber,
      registeredAt: new Date().toISOString().split('T')[0],
      ticketId: 'GUJ27-' + (sanitizedRole.toUpperCase().slice(0, 3) || 'DEL') + '-' + Math.floor(100000 + Math.random() * 900000),
      passTier: userData.passTier || 'Registered Account'
    };

    if (typeof window !== 'undefined') {
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
    }

    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gujcorr_auth_user', JSON.stringify(newUser));
    }
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
    } catch {
      // ignore
    }

    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gujcorr_auth_user');
      sessionStorage.removeItem('gujcorr_admin_unlocked');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkSession
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
