import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { decodeToken } from '../lib/auth'; // Import the decodeToken function

const withAuth = (WrappedComponent, { isAdminRequired = false } = {}) => {
  function WithAuthComponent(props) {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
      setIsClient(true);  // Now we know we are on the client
    }, []);

    useEffect(() => {
      if (!isClient) return;  // Only run the following code on the client
      const token = localStorage.getItem('access_token');
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        router.replace('/login');
      } else {
        const { user, tokenType } = decodedToken;
        if (!user || tokenType !== 'access_token') {
          router.replace('/login'); // Redirect to login if no user
        } else if (isAdminRequired && !user.isAdmin) {
          router.replace('/'); // Redirect to home if not admin
        }
      }
    }, [isClient, router]);

    // Prevent component from rendering on the server if it requires client-specific data
    if (!isClient) return null;

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
