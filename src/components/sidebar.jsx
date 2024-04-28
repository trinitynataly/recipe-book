import React, { useState, useEffect } from 'react';
import { LuMenuSquare } from 'react-icons/lu';
import Image from 'next/image';

function Sidebar({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);  // New state to manage collapsed sidebar

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setIsMobile(true);
        setMenuVisible(false);
        setIsCollapsed(false);
      } else {
        setIsMobile(false);
        setMenuVisible(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function toggleSidebar() {
    if (isMobile) {
      setMenuVisible(!menuVisible);
    } else {
      setIsCollapsed(!isCollapsed);  // Toggle collapsed state for desktop
    }
  }

  return (
    <aside id="sidebar" className={`bg-red-800 text-white relative ${isMobile ? 'h-16' : `${isCollapsed ? 'w-16' : 'w-80'} h-screen`}`}>
      <nav className={`${isMobile ? 'flex-row justify-between items-center' : 'flex-col h-full justify-between items-center'}`}>
        <div className="p-4 pb-2 flex justify-between items-center">
          <Image src="/recipe_book_logo.svg" alt="Recipe Book Logo" width={150} height={150} className={`${isCollapsed ? 'hidden' : 'md:w-48'}`} id="sidebar-logo"/>
          <button onClick={toggleSidebar} className="z-20">
            <LuMenuSquare style={{ fontSize: '2em' }} />
          </button>
        </div>
        <ul className={`bg-red-800 flex-1 px-3 ${isMobile ? (menuVisible ? 'block' : 'hidden') : 'block'}`}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { isCollapsed });
            }
            return child;
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
