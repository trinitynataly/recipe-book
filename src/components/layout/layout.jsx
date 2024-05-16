import Sidebar from "./sidebar";
import getUser from "../../lib/getUser";
import BreakfastIcon from '../../../public/icons/brekfast.svg';
import LunchIcon from '../../../public/icons/lunch.svg';
import DinnerIcon from '../../../public/icons/dinner.svg';
import SnacksIcon from '../../../public/icons/snacks.svg';
import DashboardIcon from '../../../public/dashboard.svg';
import BookIcon from '../../../public/icons/book.svg';
import HeartIcon from '../../../public/icons/heart.svg';
import InfoIcon from '../../../public/icons/info.svg';
import AdminIcon from '../../../public/icons/admin.svg';
import ExitIcon from '../../../public/icons/exit.svg';

function Layout({ children }) {
    const user = getUser();

    const menuItems = [
        {
            text: "All Recipes",
            icon: <DashboardIcon />,
            submenu: [
                { text: "Breakfast", href: "/recipes/breakfast", icon: <BreakfastIcon /> },
                { text: "Lunch", href: "/recipes/lunch", icon: <LunchIcon /> },
                { text: "Dinner", href: "/recipes/dinner", icon: <DinnerIcon /> },
                { text: "Snacks", href: "/recipes/snacks", icon: <SnacksIcon /> },
            ]
        },
        { text: "My Favourites", href: "/myfavourites", icon: <HeartIcon /> },
        { text: "Blog", href: "./blog", icon: <BookIcon /> },
        { text: "About", href: "/about", icon: <InfoIcon /> },
        user && user.isAdmin ? {
            text: "Admin",
            icon: <AdminIcon />,
            submenu: [
                { text: "Users", href: "/admin/users", icon: <AdminIcon /> },
                { text: "Recipes", href: "/admin/recipes", icon: <AdminIcon /> },
            ]
        } : null,
        { text: "Sign Out", href: "/logout", icon: <ExitIcon /> },
    ].filter(Boolean); // Filter out null items

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar items={menuItems} />
            <main className="flex-1 overflow-auto p-4">
                {children}
            </main>
        </div>
    );
}

export default Layout;
