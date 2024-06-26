/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
A context provider for managing toast notifications.
*/

// Import the createContext, useContext, useState, and useCallback hooks from React
import { createContext, useContext, useState, useCallback } from 'react';
// Import the Toast component
import Toast from '@/components/layout/toast';

// Create a new context for the toast notifications
const ToastContext = createContext();

/**
 * ToastProvider component to manage toast notifications.
 * @param children - the child components
 * @returns {JSX.Element} - the provider component for managing toast notifications
 */
export const ToastProvider = ({ children }) => {
  // Define the state variable for the toast message
  const [toast, setToast] = useState(null);

  // Define the function to show a toast message
  const showToast = useCallback((title, text, type) => {
    // Set the toast message with the provided title, text, and type
    setToast({ title, text, type });
    // Hide the toast after 3 seconds
    setTimeout(() => setToast(null), 3000); 
  }, []);

  // Return the provider component with the context value
  return (
    <ToastContext.Provider value={{ showToast }}>
      {/* Render the children components */}
      {children}
      {/* Render the toast component if a toast message is set */}
      {toast && <Toast {...toast} />}
    </ToastContext.Provider>
  );
};

// Define a custom hook to use the toast context
export const useToast = () => useContext(ToastContext);