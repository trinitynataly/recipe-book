import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/layout/toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((title, text, type) => {
    setToast({ title, text, type });
    setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast {...toast} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
