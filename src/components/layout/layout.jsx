import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useBlog } from '@/context/BlogContext';
import Sidebar from './sidebar';
import TopBar from './topbar';
import Footer from './footer';
import BreakfastIcon from '../../../public/icons/brekfast.svg';
import LunchIcon from '../../../public/icons/lunch.svg';
import DinnerIcon from '../../../public/icons/dinner.svg';
import SnacksIcon from '../../../public/icons/snacks.svg';
import DashboardIcon from '../../../public/icons/dashboard.svg';
import BookIcon from '../../../public/icons/book.svg';
import HeartIcon from '../../../public/icons/heart.svg';
import InfoIcon from '../../../public/icons/info.svg';
import ExitIcon from '../../../public/icons/exit.svg';

function Layout({ children }) {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const user = loading ? null : session?.user;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { categories } = useBlog();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 800) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    const blogSubMenu = categories?.map((category) => ({
        text: category.title,
        href: `/blog/${category.slug}`,
        icon: <BookIcon />, // Replace with appropriate icons if available
      }));

    const menuItems = [
        {
            text: 'All Recipes',
            href: '/',
            icon: <DashboardIcon />,
            submenu: [
                { text: 'Breakfast', href: '/recipes/breakfast', icon: <BreakfastIcon /> },
                { text: 'Lunch', href: '/recipes/lunch', icon: <LunchIcon /> },
                { text: 'Dinner', href: '/recipes/dinner', icon: <DinnerIcon /> },
                { text: 'Snacks', href: '/recipes/snacks', icon: <SnacksIcon /> },
            ],
        },
        user && { text: 'My Favourites', href: '/recipes/favorites', icon: <HeartIcon /> },
        { text: 'Blog', href: '/blog', icon: <BookIcon />, submenu: blogSubMenu },
        { text: 'About', href: '/about', icon: <InfoIcon /> },
        user && { text: 'Sign Out', href: '/logout', icon: <ExitIcon /> },
    ].filter(Boolean); // Filter out null items

    return (
        <div className={`flex min-h-screen ${isMobile ? 'flex-col' : 'flex-row'}`}>
            <Sidebar items={menuItems} isMobile={isMobile} />
            <div className={`flex-1 flex flex-col ${isMobile ? '' : 'ml-80'}`}> {/* Adjust margin-left to account for sidebar width */}
                <TopBar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                <main className="flex-1 overflow-auto p-4 bg-backgroundEnd dark:bg-darkBackgroundEnd text-foreground dark:text-foreground">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Layout;
