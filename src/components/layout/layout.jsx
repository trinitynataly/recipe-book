import SidebarItem from "../layout/sidebaritem";
import Sidebar from "./sidebar";
import BreakfastIcon from '../../../public/brekfast.svg';
import LunchIcon from '../../../public/lunch.svg';
import DinnerIcon from '../../../public/dinner.svg';
import SnacksIcon from '../../../public/snacks.svg';
import DashboardIcon from '../../../public/dashboard.svg';
import BookIcon from '../../../public/book.svg';
import HeartIcon from '../../../public/heart.svg';
import InfoIcon from '../../../public/info.svg';

function Layout({ children }) {
    const recipesSubmenu = [
        { text: "Breakfast", href: "/recipes/breakfast", icon: <BreakfastIcon /> },
        { text: "Lunch", href: "/recipes/lunch", icon: <LunchIcon /> },
        { text: "Dinner", href: "/recipes/dinner", icon: <DinnerIcon /> },
        { text: "Snacks", href: "/recipes/snacks", icon: <SnacksIcon /> }
    ];
    
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar>
        <SidebarItem icon={<DashboardIcon />} text="All Recipes" submenu={recipesSubmenu}href="/"/>
        <SidebarItem icon={<HeartIcon />} text="My Favourites" href="/myfavourites"/>
        <SidebarItem icon={<BookIcon />} text="Blog"  href="./blog"/>
        <SidebarItem icon={<InfoIcon />} text="About"  href="/about"/>
      </Sidebar>
      <main className="flex-1 overflow-auto p-4"> 
        {children}
      </main>
    </div>
  )
}

export default Layout;
