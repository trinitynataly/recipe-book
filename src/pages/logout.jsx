import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            await signOut({ redirect: false });
            router.push('/login');
        };

        logout();
    }, [router]);

    return null;  // Render nothing
}
