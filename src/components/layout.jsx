import { BsCollection } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { IoInformationCircleOutline } from "react-icons/io5";
import SidebarItem from "./sidebaritem";
import Sidebar from "./sidebar";
import { IoIosPizza, IoIosWine, IoIosNutrition } from "react-icons/io";
import BreakfastIcon from './icons/breakfast.svg';
import LunchIcon from './icons/lunch.svg';
import DinnerIcon from './icons/dinner.svg';
import SnacksIcon from './icons/snacks.svg';
import Image from "next/image";

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
        <SidebarItem icon={<BsCollection />} text="All Recipes" submenu={recipesSubmenu} />
        <SidebarItem icon={<FaRegHeart />} text="My Favourites" />
        <SidebarItem icon={<HiOutlineBookOpen />} text="Blog" />
        <SidebarItem icon={<IoInformationCircleOutline />} text="About" />
      </Sidebar>
      <main className="flex-1 overflow-auto p-4"> 
        {children}
      </main>
    </div>
  )
}

export default Layout;
