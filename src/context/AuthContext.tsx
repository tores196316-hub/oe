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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const isAdminUser = user.email?.toLowerCase() === 'tores196316@gmail.com';
        setIsAdmin(isAdminUser);
        setUserProfile({
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
        });
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    await loginWithGoogle();
  };

  const loginWithEmail = (emailInput: string) => {
    const isTargetAdmin = emailInput.trim().toLowerCase() === 'tores196316@gmail.com';
    setIsAdmin(isTargetAdmin);
    setUserProfile({
      uid: 'user-' + Math.random().toString(36).substring(2, 9),
      email: emailInput,
      displayName: emailInput.split('@')[0] || 'Kullanıcı',
      role: isTargetAdmin ? 'admin' : 'user',
      apiKey: 'pv_live_' + Math.random().toString(36).substring(2, 18),
      totalUploads: isTargetAdmin ? 24 : 5,
      totalViews: isTargetAdmin ? 840 : 120,
      totalDownloads: isTargetAdmin ? 190 : 34,
      totalStorageBytes: isTargetAdmin ? 42000000 : 15400000,
      createdAt: new Date().toISOString(),
    });
  };

  const logout = async () => {
    await logoutUser();
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
