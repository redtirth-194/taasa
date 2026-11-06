/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Pre-configured demo accounts
  const DEMO_USERS = {
    admin: {
      id: 'usr_admin',
      name: 'Gayatri Devi (Creative Director)',
      email: 'admin@taasa.com',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    customer: {
      id: 'usr_muse',
      name: 'Chloe Laurent',
      email: 'muse@taasa.com',
      role: 'customer',
      avatar: 'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  };

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('taasa_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      }
    } catch {
      // fallback
    }
    // Default logged in as Admin for instant recording and review
    return DEMO_USERS.admin;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('taasa_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('taasa_auth_user');
    }
  }, [user]);

  const login = (email, _password) => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check if admin
    if (trimmedEmail === 'admin@taasa.com') {
      setUser(DEMO_USERS.admin);
      setIsLoginModalOpen(false);
      return { success: true, user: DEMO_USERS.admin };
    }

    // Default customer login
    const customerUser = {
      ...DEMO_USERS.customer,
      email: trimmedEmail,
      name: trimmedEmail.split('@')[0].toUpperCase()
    };
    setUser(customerUser);
    setIsLoginModalOpen(false);
    return { success: true, user: customerUser };
  };

  const demoLogin = (role = 'admin') => {
    const targetUser = role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.customer;
    setUser(targetUser);
    setIsLoginModalOpen(false);
    return targetUser;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (name, email) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || 'Fashion Muse',
      email: email.trim().toLowerCase(),
      role: 'customer',
      avatar: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=150'
    };
    setUser(newUser);
    setIsLoginModalOpen(false);
    return { success: true, user: newUser };
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      login,
      demoLogin,
      logout,
      register,
      isLoginModalOpen,
      openLoginModal: () => setIsLoginModalOpen(true),
      closeLoginModal: () => setIsLoginModalOpen(false)
    }}>
      {children}
    </AuthContext.Provider>
  );
};
