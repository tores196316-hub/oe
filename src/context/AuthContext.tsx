import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginGoogle: () => Promise<void>;
  loginWithEmail: (email: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getInitialProfile = (): UserProfile | null => {
    try {
      const saved = localStorage.getItem('picvault_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const initialProfile = getInitialProfile();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialProfile);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(
    initialProfile?.role === 'admin' || initialProfile?.email?.toLowerCase() === 'tores196316@gmail.com'
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const isAdminUser = user.email?.toLowerCase() === 'tores196316@gmail.com';
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
          photoURL: user.photoURL || undefined,
          role: isAdminUser ? 'admin' : 'user',
          apiKey: 'pv_live_' + Math.random().toString(36).substring(2, 18),
          totalUploads: isAdminUser ? 24 : 5,
          totalViews: isAdminUser ? 840 : 120,
          totalDownloads: isAdminUser ? 190 : 34,
          totalStorageBytes: isAdminUser ? 42000000 : 15400000,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('picvault_auth_user', JSON.stringify(profile));
        setIsAdmin(isAdminUser);
        setUserProfile(profile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    const user = await loginWithGoogle();
    if (user) {
      const isAdminUser = user.email?.toLowerCase() === 'tores196316@gmail.com';
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
        photoURL: user.photoURL || undefined,
        role: isAdminUser ? 'admin' : 'user',
        apiKey: 'pv_live_' + Math.random().toString(36).substring(2, 18),
        totalUploads: isAdminUser ? 24 : 5,
        totalViews: isAdminUser ? 840 : 120,
        totalDownloads: isAdminUser ? 190 : 34,
        totalStorageBytes: isAdminUser ? 42000000 : 15400000,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('picvault_auth_user', JSON.stringify(profile));
      setIsAdmin(isAdminUser);
      setUserProfile(profile);
    }
  };

  const loginWithEmail = (emailInput: string) => {
    const isTargetAdmin = emailInput.trim().toLowerCase() === 'tores196316@gmail.com';
    const profile: UserProfile = {
      uid: 'user-' + Date.now(),
      email: emailInput,
      displayName: emailInput.split('@')[0] || 'Kullanıcı',
      role: isTargetAdmin ? 'admin' : 'user',
      apiKey: 'pv_live_' + Math.random().toString(36).substring(2, 18),
      totalUploads: isTargetAdmin ? 24 : 5,
      totalViews: isTargetAdmin ? 840 : 120,
      totalDownloads: isTargetAdmin ? 190 : 34,
      totalStorageBytes: isTargetAdmin ? 42000000 : 15400000,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('picvault_auth_user', JSON.stringify(profile));
    setIsAdmin(isTargetAdmin);
    setUserProfile(profile);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout error', err);
    }
    localStorage.removeItem('picvault_auth_user');
    setUserProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        loginGoogle,
        loginWithEmail,
        logout,
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
