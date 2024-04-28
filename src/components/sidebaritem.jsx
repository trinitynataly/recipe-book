import { useState } from 'react';
import Link from 'next/link';
import { IoIosArrowForward, IoIosCafe, IoIosPizza, IoIosWine, IoIosNutrition } from "react-icons/io";

function SidebarItem({ icon, text, active, isCollapsed, submenu }) {
    const [isOpen, setIsOpen] = useState(true);
  
    // Function to toggle submenu visibility
    const toggleSubmenu = () => {
      if (submenu) setIsOpen(!isOpen);
    };
  
    return (
      <li className={`group flex flex-col items-start py-2 px-3 my-1 rounded-md hover:bg-red-700 transition-colors cursor-pointer ${active ? 'bg-red-900' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent submenu toggle from bubbling up
            toggleSubmenu();
          }}>
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center">
            <div className="icon-container" style={{ width: '18px', height: '18px' }}>
              {icon}
            </div>
            <span className={`menu-text ml-3 flex-1 ${isCollapsed ? 'opacity-0 group-hover:opacity-100' : ''}`}>
              {text}
            </span>
          </div>
          {submenu && (
            <IoIosArrowForward className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
          )}
        </div>
        {isOpen && submenu && (
          <ul className="w-full pl-6 pt-4"> 
            {submenu.map((item, index) => (
              <li key={index} className="text-white py-1 flex items-center">
                <div className="icon-container" style={{ width: '18px', height: '18px' }}>
                  {item.icon}
                </div>
                <Link href={item.href}>
                  <span className="ml-2 hover:text-gray-300 cursor-pointer block">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  export default SidebarItem;