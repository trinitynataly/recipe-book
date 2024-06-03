/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 25/05/2024
Logout page to sign out the user
*/

// Import the useEffect hook from React
import {useEffect} from 'react';
// Import the useRouter hook from Next.js for routing
import {useRouter} from 'next/router';
// Import the signOut function from the next-auth/react library
import {signOut} from 'next-auth/react';

/**
 * Logout component to sign out the user.
 * @returns {null}
 */
export default function Logout() {
  // Get the router object
  const router = useRouter();

  // Sign out the user with the signOut function
  useEffect(() => {
    // Function to sign out the user
    const logout = async () => {
      // Sign out the user and redirect to the login page
      await signOut({redirect: false});
      // Redirect to the login page
      await router.push('/login');
    };
    // Call the logout function
    logout();
  }, [router]);

  // Render nothing
  return null;
}
