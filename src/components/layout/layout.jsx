import SidebarItem from "../layout/sidebaritem";
import Sidebar from "./sidebar";
import getUser from "../../middleware/getUser";
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
    const recipesSubmenu = [
        { text: "Breakfast", href: "/recipes/breakfast", icon: <BreakfastIcon /> },
        { text: "Lunch", href: "/recipes/lunch", icon: <LunchIcon /> },
        { text: "Dinner", href: "/recipes/dinner", icon: <DinnerIcon /> },
        { text: "Snacks", href: "/recipes/snacks", icon: <SnacksIcon /> }
    ];
    
    const adminSubmenu = [
        { text: "Users", href: "/admin/users", icon: <AdminIcon />},
        { text: "Recipes", href: "/admin/recipes", icon: <AdminIcon />},
    ]

    const user = getUser();
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar>
        <SidebarItem icon={<DashboardIcon />} text="All Recipes" submenu={recipesSubmenu}/>
        <SidebarItem icon={<HeartIcon />} text="My Favourites" href="/myfavourites"/>
        <SidebarItem icon={<BookIcon />} text="Blog" href="./blog"/>
        <SidebarItem icon={<InfoIcon />} text="About" href="/about"/>
        {user && user.isAdmin && <SidebarItem icon={<AdminIcon />} text="Admin" submenu={adminSubmenu}/>}
        <SidebarItem icon={<ExitIcon />} text="Sign Out" href="/logout"/>
      </Sidebar>
      <main className="flex-1 overflow-auto p-4"> 
        {children}
      </main>
    </div>
  )
}

export default Layout;
