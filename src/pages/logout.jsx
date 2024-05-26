// pages/logout.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';

export default function Logout() {
    const { logout } = useUser();
    const router = useRouter();

    useEffect(() => {
        logout();  // Call the logout function to clear tokens and user state
        router.push('/login');  // Redirect to login page
    }, [logout, router]);

    return null;  // Render nothing
}
