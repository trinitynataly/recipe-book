import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken'; // Properly import jwt to use its decoding functionality

const withAuth = (WrappedComponent, { isAdminRequired = false } = {}) => {
  function WithAuthComponent(props) {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
      setIsClient(true);  // Now we know we are on the client
    }, []);

    useEffect(() => {
      if (!isClient) return;  // Only run the following code on the client

      const token = localStorage.getItem('token');
      const user = token ? jwt.decode(token) : null; // Use jwt to decode the token

      if (!token) {
        router.replace('/login'); // Redirect to login if no token
      } else if (isAdminRequired && !user.isAdmin) {
        router.replace('/'); // Redirect to home if not admin
      }
    }, [isClient, router]);

    // Prevent component from rendering on the server if it requires client-specific data
    if (!isClient) return null;

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
