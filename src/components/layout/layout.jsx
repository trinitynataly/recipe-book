import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import TopBar from './topbar';
import { useUser } from '@/context/UserContext';
import BreakfastIcon from '../../../public/icons/brekfast.svg';
import LunchIcon from '../../../public/icons/lunch.svg';
import DinnerIcon from '../../../public/icons/dinner.svg';
import SnacksIcon from '../../../public/icons/snacks.svg';
import DashboardIcon from '../../../public/icons/dashboard.svg';
import BookIcon from '../../../public/icons/book.svg';
import HeartIcon from '../../../public/icons/heart.svg';
import InfoIcon from '../../../public/icons/info.svg';
import AdminIcon from '../../../public/icons/admin.svg';
import ExitIcon from '../../../public/icons/exit.svg';

function Layout({ children }) {
    const { user } = useUser();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 640) {
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

    const menuItems = [
        {
            text: 'All Recipes',
            icon: <DashboardIcon />,
            submenu: [
                { text: 'Breakfast', href: '/recipes/breakfast', icon: <BreakfastIcon /> },
                { text: 'Lunch', href: '/recipes/lunch', icon: <LunchIcon /> },
                { text: 'Dinner', href: '/recipes/dinner', icon: <DinnerIcon /> },
                { text: 'Snacks', href: '/recipes/snacks', icon: <SnacksIcon /> },
            ],
        },
        user && { text: 'My Favourites', href: '/recipes/favorites', icon: <HeartIcon /> },
        { text: 'Blog', href: './blog', icon: <BookIcon /> },
        { text: 'About', href: '/about', icon: <InfoIcon /> },
        user && user.isAdmin && {
            text: 'Admin',
            icon: <AdminIcon />,
            submenu: [
                { text: 'Users', href: '/admin/users', icon: <AdminIcon /> },
                { text: 'Recipes', href: '/admin/recipes', icon: <AdminIcon /> },
            ],
        },
        user && { text: 'Sign Out', href: '/logout', icon: <ExitIcon /> },
    ].filter(Boolean); // Filter out null items

    const handleSearch = (query) => {
        // Implement search functionality here
        console.log('Searching for:', query);
    };

    return (
        <div className={`flex min-h-screen ${isMobile ? 'flex-col' : 'flex-row'}`}>
            <Sidebar items={menuItems} isMobile={isMobile} />
            <div className={`flex-1 flex flex-col ${isMobile ? '' : 'ml-80'}`}> {/* Adjust margin-left to account for sidebar width */}
                <TopBar onSearch={handleSearch} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                <main className="flex-1 overflow-auto p-4 bg-backgroundEnd dark:bg-darkBackgroundEnd text-foreground dark:text-foreground">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
